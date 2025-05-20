const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const path = require('path');
const { getConfig } = require('./config');
const logger = require('./logger');
const database = require('./database');

// 邮件拉取进度对象
const mailProgress = {
    isRunning: false,
    step: 0,
    progress: 0,
    message: '准备中...',
    processedEmails: 0,
    totalEmails: 0,
    processedAccounts: 0,
    totalAccounts: 0,
    result: null,
    emailResults: []
};

class MailService {
    constructor() {
        this.config = getConfig();
        this.imapClient = null;
        this.maxReconnectAttempts = 3;
        this.reconnectDelay = 5000; // 5 seconds
        this.attachmentsDir = path.join(process.cwd(), 'data', 'attachments');
        this.fetchTimer = null; // 定时拉取邮件的定时器
    }

    // 重置进度
    resetProgress() {
        mailProgress.isRunning = false;
        mailProgress.step = 0;
        mailProgress.progress = 0;
        mailProgress.message = '准备中...';
        mailProgress.processedEmails = 0;
        mailProgress.totalEmails = 0;
        mailProgress.processedAccounts = 0;
        mailProgress.totalAccounts = 0;
        mailProgress.result = null;
        mailProgress.emailResults = [];
    }

    // 获取当前进度
    getProgress() {
        return { ...mailProgress };
    }

    // 初始化邮件服务
    async initialize() {
        try {
            logger.info('初始化邮件服务...');

            // 确保附件目录存在
            if (!fs.existsSync(this.attachmentsDir)) {
                fs.mkdirSync(this.attachmentsDir, { recursive: true });
                logger.info(`创建附件目录: ${this.attachmentsDir}`);
            }

            // 初始化IMAP客户端
            await this.initImapClient();

            logger.info('邮件服务初始化完成');
        } catch (error) {
            logger.error('邮件服务初始化失败:', error);
            throw error;
        }
    }

    // 初始化IMAP客户端
    async initImapClient() {
        if (!this.config.email.imap.enabled) {
            logger.warn('IMAP服务未启用，跳过初始化');
            return;
        }

        try {
            logger.info('初始化IMAP客户端...');

            // 如果已存在连接，先关闭
            if (this.imapClient) {
                try {
                    await this.imapClient.logout();
                } catch (e) {
                    // 忽略关闭错误
                }
            }

            const imapConfig = {
                host: this.config.email.imap.host,
                port: this.config.email.imap.port,
                secure: this.config.email.imap.secure,
                auth: {
                    user: this.config.email.user,
                    pass: this.config.email.pass,
                },
                logger: false,
                tls: {
                    rejectUnauthorized: false
                }
            };

            // 如果启用了代理，添加代理配置
            if (this.config.proxy && this.config.proxy.enabled) {
                const proxyUrl = `${this.config.proxy.protocol}://${this.config.proxy.host}:${this.config.proxy.port}`;
                logger.info(`IMAP使用代理: ${proxyUrl}`);
                imapConfig.proxy = proxyUrl;
            }

            this.imapClient = new ImapFlow(imapConfig);
            await this.imapClient.connect();
            logger.info('IMAP客户端连接成功');
        } catch (error) {
            logger.error('IMAP客户端初始化失败:', error);
            throw error;
        }
    }

    // 带重试的IMAP操作执行器
    async executeWithRetry(operation, maxAttempts = this.maxReconnectAttempts) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                logger.error(`IMAP操作失败(第${attempt}次尝试):`, error);

                // 如果不是最后一次尝试，则重新初始化连接并重试
                if (attempt < maxAttempts) {
                    logger.info(`尝试重新初始化IMAP连接(第${attempt}次)...`);
                    try {
                        await this.initImapClient();
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

    // 获取新邮件列表
    async getNewEmailsList(sinceDate) {
        try {
            logger.info(`获取新邮件列表，起始日期: ${sinceDate.toISOString()}`);

            if (!this.imapClient || !this.imapClient.usable) {
                await this.initImapClient();
            }

            // 打开收件箱
            await this.executeWithRetry(async () => {
                await this.imapClient.mailboxOpen('INBOX');
            });

            // 搜索邮件 - 使用SINCE条件获取指定日期之后的所有邮件
            const messages = await this.executeWithRetry(async () => {
                return await this.imapClient.search({
                    since: sinceDate
                }, {
                    sort: ['-date']
                });
            });

            logger.info(`IMAP服务器中找到 ${messages.length} 封自 ${sinceDate.toISOString()} 以来的新邮件`);

            // 获取每封邮件的基本信息（不包含完整内容）
            const emailInfoList = [];
            for (const seq of messages) {
                try {
                    const message = await this.executeWithRetry(async () => {
                        return await this.imapClient.fetchOne(seq, {
                            envelope: true,
                            uid: true
                        });
                    });

                    if (message && message.envelope) {
                        // 提取收件人信息
                        const recipients = [];
                        if (message.envelope.to) {
                            message.envelope.to.forEach(to => {
                                if (to.address) {
                                    recipients.push(to.address.toLowerCase());
                                }
                            });
                        }

                        emailInfoList.push({
                            seq,
                            uid: message.uid,
                            date: message.envelope.date,
                            recipients,
                            messageId: message.envelope.messageId
                        });
                    }
                } catch (error) {
                    logger.error(`获取邮件 ${seq} 基本信息失败:`, error);
                    // 继续处理其他邮件
                }
            }

            logger.info(`成功获取 ${emailInfoList.length} 封邮件的基本信息`);
            return emailInfoList;
        } catch (error) {
            logger.error('获取新邮件列表失败:', error);
            throw error;
        }
    }

    // 处理单个邮件
    async processEmail(emailInfo, activeAccounts) {
        try {
            const emailAddresses = activeAccounts.map(account => account.email);
            const seq = emailInfo.seq;

            // 获取邮件详情
            const message = await this.executeWithRetry(async () => {
                return await this.imapClient.fetchOne(seq, {
                    source: true,
                    envelope: true,
                    bodyStructure: true
                });
            });

            if (!message || !message.source) {
                logger.warn(`邮件 ${seq} 格式不正确，跳过`);
                return { success: false, reason: 'invalid_format' };
            }

            // 解析邮件
            const parsedEmail = await simpleParser(message.source);

            // 使用已获取的收件人信息
            const recipients = emailInfo.recipients || [];

            // 如果emailInfo中没有收件人信息，则从解析的邮件中获取
            if (recipients.length === 0 && parsedEmail.to && parsedEmail.to.value) {
                parsedEmail.to.value.forEach(to => {
                    if (to.address) recipients.push(to.address.toLowerCase());
                });
            }

            // 检查邮件是否发送给我们的任何一个活跃账号
            const matchedEmails = emailAddresses.filter(email =>
                recipients.includes(email.toLowerCase())
            );

            if (matchedEmails.length === 0) {
                logger.debug(`邮件 ${parsedEmail.messageId} 不是发送给我们的账号，跳过`);
                return { success: false, reason: 'no_matching_account' };
            }

            // 处理结果
            const results = [];

            // 处理每个匹配的邮箱账号
            for (const email of matchedEmails) {
                // 规范化邮件ID
                const messageId = parsedEmail.messageId;
                const normalizedMessageId = messageId ? messageId.replace(/[<>\s]/g, '') : '';

                // 检查邮件是否已存在于数据库
                const existingEmail = await database.checkEmailExists(email, normalizedMessageId);

                if (existingEmail) {
                    logger.debug(`邮件 ${messageId} 已存在于账号 ${email}，跳过`);
                    results.push({
                        account: email,
                        success: false,
                        reason: 'already_exists'
                    });
                    continue;
                }

                logger.info(`处理账号 ${email} 的新邮件: ${messageId}, 主题: ${parsedEmail.subject}`);

                // 处理附件
                const attachments = [];
                if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
                    for (const attachment of parsedEmail.attachments) {
                        const attachmentPath = await this.saveAttachment(attachment, email);
                        if (attachmentPath) {
                            attachments.push({
                                name: attachment.filename,
                                size: attachment.size,
                                type: attachment.contentType,
                                path: attachmentPath
                            });
                        }
                    }
                }

                // 提取预览文本
                const preview = parsedEmail.text ? parsedEmail.text.substring(0, 100) : '';

                // 保存邮件到数据库
                const emailData = {
                    account: email,
                    message_id: normalizedMessageId,
                    sender: parsedEmail.from.value[0].address,
                    sender_name: parsedEmail.from.value[0].name,
                    subject: parsedEmail.subject,
                    preview: preview,
                    body: parsedEmail.html || parsedEmail.textAsHtml || parsedEmail.text,
                    date: parsedEmail.date.getTime(),
                    attachments: attachments
                };

                await database.saveEmail(emailData);
                logger.info(`成功保存邮件到账号 ${email}`);

                results.push({
                    account: email,
                    success: true,
                    subject: parsedEmail.subject,
                    sender: parsedEmail.from.value[0].address
                });
            }

            return {
                success: results.some(r => r.success),
                results,
                messageId: parsedEmail.messageId,
                subject: parsedEmail.subject
            };
        } catch (error) {
            logger.error(`处理邮件 ${emailInfo.seq} 失败:`, error);
            return { success: false, reason: 'error', error: error.message };
        }
    }

    // 保存附件
    async saveAttachment(attachment, email) {
        try {
            // 创建账号目录
            const accountDir = path.join(this.attachmentsDir, email.replace(/[@.]/g, '_'));
            if (!fs.existsSync(accountDir)) {
                fs.mkdirSync(accountDir, { recursive: true });
            }

            // 生成唯一文件名
            const timestamp = Date.now();
            const filename = `${timestamp}_${attachment.filename}`;
            const filePath = path.join(accountDir, filename);

            // 写入文件
            fs.writeFileSync(filePath, attachment.content);

            // 返回相对路径
            return path.relative(process.cwd(), filePath);
        } catch (error) {
            logger.error(`保存附件 ${attachment.filename} 失败:`, error);
            return null;
        }
    }

    // 关闭连接
    async close() {
        if (this.imapClient) {
            try {
                await this.imapClient.logout();
                logger.info('IMAP客户端已关闭');
            } catch (error) {
                logger.warn('关闭IMAP客户端时出错:', error);
            }
        }
    }

    // 拉取新邮件的主要方法
    async fetchNewEmails(specificAccount = null) {
        // 如果已经在运行，直接返回
        if (mailProgress.isRunning) {
            logger.info('邮件拉取已在进行中');
            return {
                success: true,
                message: '邮件拉取已在进行中'
            };
        }

        // 重置进度
        this.resetProgress();

        try {
            logger.info('开始拉取新邮件...');

            // 初始化邮件服务
            logger.info('初始化邮件服务...');

            // 确保进度状态正确
            mailProgress.isRunning = true;
            mailProgress.step = 1;
            mailProgress.progress = 5;
            mailProgress.message = '初始化邮件服务...';

            await this.initialize();

            // 获取所有账号
            const accounts = await database.getAllAccounts();

            // 如果指定了特定账号，只处理该账号
            const activeAccounts = specificAccount
                ? accounts.filter(acc => acc.status === 'active' && acc.email === specificAccount)
                : accounts.filter(acc => acc.status === 'active');

            mailProgress.totalAccounts = activeAccounts.length;

            // 更新进度
            mailProgress.step = 2;
            mailProgress.message = '连接IMAP服务器...';
            mailProgress.progress = 10;

            logger.info(`找到 ${activeAccounts.length} 个活跃账号`);

            // 如果没有活跃账号，直接完成
            if (activeAccounts.length === 0) {
                logger.info('没有活跃账号，检查完成');

                // 更新进度到100%
                mailProgress.progress = 100;
                mailProgress.message = '检查完成';
                mailProgress.result = {
                    success: true,
                    totalEmails: 0,
                    accountStats: []
                };

                // 设置一个短暂的延迟后重置进度状态
                setTimeout(() => {
                    mailProgress.isRunning = false;
                    logger.info('邮件检查已完成，进度状态已重置为非运行状态');
                }, 3000); // 3秒后重置运行状态

                return {
                    success: true,
                    message: '没有活跃账号，检查完成',
                    totalEmails: 0
                };
            }

            // 获取数据库中最后一封邮件的日期
            const lastEmailDate = await database.getLastEmailDate(specificAccount);

            // 如果有最后邮件日期，使用该日期减去1小时作为搜索起点（避免时区问题导致漏掉邮件）
            let sinceDate = null;
            if (lastEmailDate) {
                sinceDate = new Date(lastEmailDate - 3600000); // 减去1小时
                logger.info(`使用上次邮件日期作为搜索起点: ${sinceDate.toISOString()}`);
            } else {
                // 如果没有最后邮件日期，使用30天前作为默认起点
                sinceDate = new Date();
                sinceDate.setDate(sinceDate.getDate() - 30);
                logger.info(`没有找到上次邮件日期，使用30天前作为默认起点: ${sinceDate.toISOString()}`);
            }

            // 更新进度
            mailProgress.step = 3;
            mailProgress.message = '获取邮件列表...';
            mailProgress.progress = 20;

            // 获取新邮件列表
            const emailInfoList = await this.getNewEmailsList(sinceDate);

            // 更新总邮件数
            mailProgress.totalEmails = emailInfoList.length;

            logger.info(`IMAP服务器中找到 ${emailInfoList.length} 封自 ${sinceDate.toISOString()} 以来的新邮件`);

            // 如果没有新邮件，直接完成
            if (emailInfoList.length === 0) {
                logger.info('没有新邮件，检查完成');

                // 更新进度到100%
                mailProgress.progress = 100;
                mailProgress.message = '检查完成';
                mailProgress.result = {
                    success: true,
                    totalEmails: 0,
                    accountStats: []
                };

                // 设置一个短暂的延迟后重置进度状态
                setTimeout(() => {
                    mailProgress.isRunning = false;
                    logger.info('邮件检查已完成，进度状态已重置为非运行状态');
                }, 3000); // 3秒后重置运行状态

                return {
                    success: true,
                    message: '没有新邮件，检查完成',
                    totalEmails: 0
                };
            }

            // 更新进度
            mailProgress.step = 4;
            mailProgress.message = '处理邮件...';
            mailProgress.progress = 30;

            // 处理每封邮件
            const accountStats = {};
            const processedEmails = [];

            for (let i = 0; i < emailInfoList.length; i++) {
                const emailInfo = emailInfoList[i];

                // 更新进度
                const emailProgress = Math.floor(30 + (i / emailInfoList.length) * 65);
                mailProgress.progress = emailProgress;
                mailProgress.processedEmails = i;
                mailProgress.message = `处理邮件 ${i + 1}/${emailInfoList.length}...`;

                logger.info(`处理邮件 ${i + 1}/${emailInfoList.length}...`);

                // 处理单个邮件
                const result = await this.processEmail(emailInfo, activeAccounts);

                // 记录处理结果
                if (result.success) {
                    processedEmails.push(result);

                    // 更新账号统计
                    result.results.forEach(r => {
                        if (r.success) {
                            if (!accountStats[r.account]) {
                                accountStats[r.account] = { count: 0, emails: [] };
                            }
                            accountStats[r.account].count++;
                            accountStats[r.account].emails.push({
                                subject: r.subject,
                                sender: r.sender
                            });
                        }
                    });
                }

                // 添加到结果列表
                mailProgress.emailResults.push(result);
            }

            // 完成处理
            mailProgress.progress = 95;
            mailProgress.message = '完成处理...';

            // 关闭IMAP连接
            await this.close();

            // 计算总结果
            const totalProcessed = processedEmails.length;
            const accountStatsArray = Object.entries(accountStats).map(([account, stats]) => ({
                account,
                count: stats.count,
                emails: stats.emails
            }));

            // 设置最终结果
            mailProgress.progress = 100;
            mailProgress.message = '检查完成';
            mailProgress.result = {
                success: true,
                totalEmails: totalProcessed,
                accountStats: accountStatsArray
            };

            logger.info(`邮件检查完成，成功处理 ${totalProcessed} 封邮件`);

            // 设置一个短暂的延迟后重置进度状态
            setTimeout(() => {
                mailProgress.isRunning = false;
                logger.info('邮件检查已完成，进度状态已重置为非运行状态');
            }, 3000); // 3秒后重置运行状态

            return {
                success: true,
                message: `邮件检查完成，成功处理 ${totalProcessed} 封邮件`,
                totalEmails: totalProcessed,
                accountStats: accountStatsArray
            };
        } catch (error) {
            logger.error('检查邮件失败:', error);

            // 尝试关闭邮件服务连接
            try {
                await this.close();
            } catch (closeError) {
                logger.warn('关闭邮件服务连接失败:', closeError);
            }

            // 更新错误状态
            mailProgress.message = '检查邮件失败: ' + error.message;
            mailProgress.result = {
                success: false,
                error: error.message || '检查邮件时发生未知错误'
            };

            // 立即将isRunning设置为false，允许用户重试
            mailProgress.isRunning = false;
            logger.info('邮件检查失败，进度状态已重置为非运行状态');

            return {
                success: false,
                error: error.message || '检查邮件时发生未知错误'
            };
        } finally {
            // 10分钟后完全重置所有进度信息，包括结果
            setTimeout(() => {
                this.resetProgress();
                logger.info('进度状态已在超时后完全重置（包括结果信息）');
            }, 600000); // 10分钟后完全清除，包括结果信息
        }
    }

    // 启动定时拉取邮件任务
    startScheduledFetching() {
        const config = getConfig();
        const interval = (config.email && config.email.fetchInterval) ? config.email.fetchInterval : 10; // 默认10分钟

        logger.info(`启动定时拉取邮件任务，间隔: ${interval} 分钟`);

        // 清除可能存在的旧定时器
        if (this.fetchTimer) {
            clearInterval(this.fetchTimer);
        }

        // 设置新的定时器
        this.fetchTimer = setInterval(async () => {
            logger.info('执行定时拉取邮件任务...');
            try {
                await this.fetchNewEmails();
            } catch (error) {
                logger.error('定时拉取邮件失败:', error);
            }
        }, interval * 60 * 1000); // 转换为毫秒

        return {
            success: true,
            message: `定时拉取邮件任务已启动，间隔: ${interval} 分钟`
        };
    }

    // 停止定时拉取邮件任务
    stopScheduledFetching() {
        if (this.fetchTimer) {
            clearInterval(this.fetchTimer);
            this.fetchTimer = null;
            logger.info('定时拉取邮件任务已停止');
            return {
                success: true,
                message: '定时拉取邮件任务已停止'
            };
        }

        return {
            success: false,
            message: '没有正在运行的定时拉取邮件任务'
        };
    }
}

// 创建单例实例
const mailService = new MailService();

module.exports = mailService;
