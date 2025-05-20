const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');
const logger = require('./logger');
const socks = require('socks');
const fs = require('fs');
const path = require('path');

class EmailHandler {
    constructor(config) {
        this.config = config;
        this.smtpTransporter = null;
        this.imapClient = null;
        this.maxReconnectAttempts = 3;
        this.reconnectDelay = 5000; // 5 seconds
    }

    // 初始化所有邮件连接
    async initialize() {
        logger.info('开始初始化邮件处理器...');
        
        // 根据配置决定是否初始化 SMTP
        if (this.config.email.smtp.enabled) {
            await this.initSmtp();
        } else {
            logger.info('SMTP 连接已禁用，跳过初始化');
        }

        // 根据配置决定是否初始化 IMAP
        if (this.config.email.imap.enabled) {
            await this.initImap();
        } else {
            logger.info('IMAP 连接已禁用，跳过初始化');
        }

        logger.info('邮件处理器初始化完成');
    }

    // 初始化 SMTP 客户端
    async initSmtp() {
        if (!this.config.email.smtp.enabled) {
            throw new Error('SMTP 连接已禁用');
        }

        try {
            logger.info('初始化 SMTP 客户端...');
            
            const smtpConfig = {
                ...this.config.email.smtp,  // 展开 SMTP 配置
                auth: {
                    user: this.config.email.user,
                    pass: this.config.email.pass,
                },
                connectionTimeout: 30000,
                socketTimeout: 30000,
                tls: {
                    rejectUnauthorized: false,
                    ciphers: 'SSLv3'
                },
                requireTLS: true
            };

            // 如果启用了代理，添加代理配置
            if (this.config.proxy.enabled) {
                smtpConfig.proxy = `socks5://${this.config.proxy.host}:${this.config.proxy.port}`;
                logger.info(`使用代理: ${smtpConfig.proxy}`);
            }

            this.smtpTransporter = nodemailer.createTransport(smtpConfig);
            this.smtpTransporter.set('proxy_socks_module', socks);

            // 验证连接配置
            await this.smtpTransporter.verify();
            logger.info('SMTP 客户端初始化成功');
        } catch (error) {
            logger.error('SMTP 连接失败:', error);
            throw error;
        }
    }

    // 发送邮件
    async sendMail(to, subject, text) {
        if (!this.config.email.smtp.enabled || !this.smtpTransporter) {
            throw new Error('SMTP 服务未启用或未初始化');
        }

        try {
            const result = await this.smtpTransporter.sendMail({
                from: this.config.email.user,
                to,
                subject,
                text
            });
            logger.info('邮件发送成功');
            return result;
        } catch (error) {
            logger.error('发送邮件失败:', error);
            throw error;
        }
    }

    // 初始化 IMAP 连接
    async initImap() {
        if (!this.config.email.imap.enabled) {
            throw new Error('IMAP 连接已禁用');
        }

        logger.info('初始化 IMAP 连接...');
        try {
            // 如果已存在连接，先关闭
            if (this.imapClient) {
                try {
                    await this.imapClient.logout();
                } catch (e) {
                    // 忽略关闭错误
                }
            }

            const imapConfig = {
                ...this.config.email.imap,  // 展开 IMAP 配置
                auth: {
                    user: this.config.email.user,
                    pass: this.config.email.pass,
                },
                logger: logger,
                tls: {
                    rejectUnauthorized: false
                }
            };

            // 如果启用了代理，添加代理配置
            if (this.config.proxy.enabled) {
                const proxyUrl = `socks5://${this.config.proxy.host}:${this.config.proxy.port}`;
                const logMessage = `\nIMAP使用代理: ${proxyUrl}`;
                logger.info(logMessage);
                imapConfig.proxy = proxyUrl;
            }

            this.imapClient = new ImapFlow(imapConfig);
            await this.imapClient.connect();
            logger.info('IMAP 连接成功');
        } catch (error) {
            logger.error('IMAP 连接错误:', error);
            throw error;
        }
    }

    // 带重试的IMAP操作执行器
    async executeWithRetryImap(operation, maxAttempts = this.maxReconnectAttempts) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                logger.error(`IMAP操作失败(第${attempt}次尝试):`, error);
                
                // 如果不是最后一次尝试，则重新初始化连接并重试
                if (attempt < maxAttempts) {
                    logger.info(`尝试重新初始化IMAP连接(第${attempt}次)...`);
                    try {
                        await this.initImap();
                        logger.info('IMAP重新连接成功，准备重试操作');
                        await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
                        continue;
                    } catch (reconnectError) {
                        logger.error(`重新连接失败(第${attempt}次):`, reconnectError);
                    }
                }
                throw error;
            }
        }
    }

    // 等待并获取验证码邮件
    async waitForVerificationEmail(flow, account, timeout = 300000, pollInterval = 5000) {
        if (!this.config.email.imap.enabled || !this.imapClient) {
            throw new Error('IMAP 服务未启用或未初始化');
        }

        const startTime = Date.now();
        logger.info('开始等待验证码邮件...');

        while (Date.now() - startTime < timeout) {
            try {
                // 使用重试机制执行IMAP操作
                const messages = await this.executeWithRetryImap(async () => {
                    await this.imapClient.mailboxOpen('INBOX');
                    return await this.imapClient.search({
                        unseen: true,
                        from: flow.getVerificationEmailSender(),
                        to: account.email
                    }, {
                        sort: ['-date']
                    });
                });

                logger.info('搜索到的邮件数量：', messages.length);
                
                if (messages.length > 0) {
                    // 使用重试机制获取邮件内容
                    const email = await this.executeWithRetryImap(async () => {
                        return await this.imapClient.fetchOne(messages[0], {
                            source: true,
                            uid: true,
                            flags: true
                        });
                    });
                    
                    if (!email || !email.source) {
                        logger.warn('获取到的邮件格式不正确:', email);
                        continue;
                    }
                    
                    const emailContent = email.source.toString();
                    
                    // 使用传入的解析器提取验证码
                    const verificationCode = flow.extractVerificationCode(emailContent);
                    if (verificationCode) {
                        logger.info('成功获取验证码');
                        return verificationCode;
                    }
                }
                
                // 等待指定时间后再次检查
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            } catch (error) {
                logger.error('检查邮件失败:', error);
                // 等待指定时间后重试
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
        }
        
        throw new Error('等待验证码超时');
    }

    // 关闭连接
    async close() {
        if (this.imapClient) {
            try {
                await this.imapClient.logout();
            } catch (error) {
                logger.warn('关闭IMAP连接时出错:', error);
            }
        }
        if (this.smtpTransporter) {
            this.smtpTransporter.close();
        }
        logger.info('邮件连接已关闭');
    }
}

module.exports = EmailHandler;