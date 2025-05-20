const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const mailService = require('../utils/mail-service');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// 中间件：检查是否已登录
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return next();
    }
    res.redirect('/login');
};

// 邮件列表页面
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // 获取分页参数
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 获取筛选参数
        let account = req.query.account || '';
        const sender = req.query.sender || '';
        const subject = req.query.subject || '';
        const status = req.query.status || 'all';
        const date = req.query.date || 'all';
        const hasAttachments = req.query.hasAttachments || 'all';
        const search = req.query.search || '';
        let recipient = req.query.recipient || '';
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';

        // 检查是否是普通用户（非管理员）
        const isRegularUser = req.session && req.session.isAdmin === false;

        // 如果是普通用户，强制使用其邮箱作为筛选条件
        if (isRegularUser && req.session.userEmail) {
            account = req.session.userEmail;
            recipient = req.session.userEmail;
        }

        // 构建筛选条件
        const filters = {
            account: recipient || account,
            sender,
            subject,
            status,
            date,
            hasAttachments,
            search,
            startDate,
            endDate
        };

        // 获取分页邮件列表
        const { emails, total, pages } = await database.getEmailsPaginated(page, pageSize, filters);

        // 获取账号列表用于筛选（仅管理员可见）
        let activeAccounts = [];
        if (!isRegularUser) {
            const accounts = await database.getAllAccounts();
            activeAccounts = accounts.filter(account => account.status === 'active');
        }

        res.render('mail/index', {
            title: '邮件管理',
            emails,
            accounts: activeAccounts,
            selectedAccount: recipient || account || '',
            recipient,
            filters,
            isRegularUser,
            userEmail: req.session.userEmail,
            pagination: {
                page,
                pageSize,
                total,
                pages,
                baseUrl: '/mail'
            },
            pageCss: 'mail',
            pageJs: 'mail'
        });
    } catch (error) {
        logger.error('获取邮件列表失败:', error);
        res.render('mail/index', {
            title: '邮件管理',
            emails: [],
            accounts: [],
            selectedAccount: '',
            isRegularUser: req.session && req.session.isAdmin === false,
            userEmail: req.session ? req.session.userEmail : '',
            filters: {
                account: '',
                sender: '',
                subject: '',
                status: 'all',
                date: 'all',
                hasAttachments: 'all',
                search: ''
            },
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0,
                pages: 0,
                baseUrl: '/mail'
            },
            error: '获取邮件列表失败: ' + error.message,
            pageCss: 'mail',
            pageJs: 'mail'
        });
    }
});

// 查看邮件详情
router.get('/view/:id', isAuthenticated, async (req, res) => {
    try {
        const emailId = req.params.id;

        // 获取邮件详情
        const email = await database.getEmailById(emailId);

        if (!email) {
            return res.status(404).render('error', {
                title: '错误',
                message: '邮件不存在',
                error: { status: 404 }
            });
        }

        // 检查是否是普通用户（非管理员）
        const isRegularUser = req.session && req.session.isAdmin === false;

        // 如果是普通用户，检查邮件是否属于该用户
        if (isRegularUser && req.session.userEmail && email.account !== req.session.userEmail) {
            return res.status(403).render('error', {
                title: '访问被拒绝',
                message: '您没有权限查看此邮件',
                error: { status: 403 }
            });
        }

        // 标记邮件为已读
        await database.markEmailAsRead(emailId);

        // 准备收件人信息
        const recipients = [email.account];

        res.render('mail/view', {
            title: email.subject || '无主题',
            email: {
                ...email,
                recipients,
                cc: [],
                bcc: []
            },
            isRegularUser,
            userEmail: req.session.userEmail,
            pageCss: 'mail',
            pageJs: 'mail'
        });
    } catch (error) {
        logger.error(`获取邮件详情失败: ID=${req.params.id}`, error);
        res.status(500).render('error', {
            title: '错误',
            message: '获取邮件详情失败',
            error: { status: 500, stack: error.stack }
        });
    }
});

// 拉取邮件页面
router.get('/fetch', isAuthenticated, (req, res) => {
    logger.info('访问检查新邮件页面');
    res.render('mail/fetch', {
        title: '检查新邮件',
        pageCss: 'mail-fetch',
        pageJs: 'mail-fetch'
    });
});


// 邮件拉取进度现在由 mailService 管理

// 获取进度API
router.get('/fetch-status', isAuthenticated, (req, res) => {
    logger.info('收到进度查询请求');

    // 从mailService获取进度
    const progress = mailService.getProgress();

    console.log('收到进度查询请求, 当前进度:', {
        isRunning: progress.isRunning,
        step: progress.step,
        progress: progress.progress,
        message: progress.message,
        hasResult: !!progress.result
    });

    res.json(progress);
});

// 拉取邮件进度API
router.post('/fetch-progress', isAuthenticated, async (req, res) => {
    logger.info('收到检查新邮件请求');
    console.log('收到检查新邮件请求');

    // 立即返回响应
    res.json({
        success: true,
        message: '邮件检查已开始'
    });

    // 异步处理邮件检查
    (async () => {
        try {
            logger.info('开始检查新邮件...');
            console.log('开始检查新邮件...');

            // 使用抽取的邮件服务方法拉取邮件
            const result = await mailService.fetchNewEmails();

            // 设置成功消息
            if (result.success) {
                req.session.mailCheckSuccess = true;
                req.session.mailCheckCount = result.totalEmails || 0;

                // 添加活动记录
                if (result.totalEmails > 0) {
                    await database.addActivity(
                        'email_check',
                        'arrow-repeat',
                        `检查邮件完成，获取到 ${result.totalEmails} 封新邮件`,
                        null,
                        { count: result.totalEmails }
                    );
                } else {
                    await database.addActivity(
                        'email_check',
                        'arrow-repeat',
                        '检查邮件完成，没有新邮件',
                        null,
                        { count: 0 }
                    );
                }
            } else {
                // 设置错误消息
                req.session.mailCheckError = result.error || '检查邮件失败';
            }
        } catch (error) {
            logger.error('检查邮件失败:', error);
            console.error('检查邮件失败:', error);

            // 设置错误消息
            req.session.mailCheckError = error.message;
        }
    })();
});

// 下载附件
router.get('/attachment/:emailId/:attachmentId', isAuthenticated, async (req, res) => {
    try {
        const emailId = req.params.emailId;
        const attachmentId = req.params.attachmentId;

        // 获取邮件详情
        const email = await database.getEmailById(emailId);

        if (!email) {
            return res.status(404).send('邮件不存在');
        }

        // 查找附件
        const attachment = email.attachments.find(a => a.id == attachmentId);

        if (!attachment) {
            return res.status(404).send('附件不存在');
        }

        // 检查文件是否存在
        const filePath = attachment.path;
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('附件文件不存在');
        }

        // 设置响应头
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.name)}"`);
        if (attachment.type) {
            res.setHeader('Content-Type', attachment.type);
        }

        // 发送文件
        res.sendFile(path.resolve(filePath));
    } catch (error) {
        logger.error(`下载附件失败: emailId=${req.params.emailId}, attachmentId=${req.params.attachmentId}`, error);
        res.status(500).send('下载附件失败: ' + error.message);
    }
});

// 批量标记邮件为已读
router.post('/mark-all-as-read', isAuthenticated, async (req, res) => {
    try {
        logger.info('收到全部设为已读请求，请求体:', req.body);

        // 获取筛选参数
        const account = req.body.account || '';
        const sender = req.body.sender || '';
        const subject = req.body.subject || '';
        const status = req.body.status || 'all';
        const date = req.body.date || 'all';
        const hasAttachments = req.body.hasAttachments || 'all';
        const search = req.body.search || '';
        const startDate = req.body.startDate || '';
        const endDate = req.body.endDate || '';

        // 构建筛选条件
        const filters = {
            account,
            sender,
            subject,
            status,
            date,
            hasAttachments,
            search,
            startDate,
            endDate
        };

        logger.info('筛选条件:', filters);

        // 标记邮件为已读
        const result = await database.markEmailsAsReadByFilters(filters);
        logger.info('标记邮件为已读结果:', result);

        if (result.success) {
            // 设置成功消息
            req.session.markReadSuccess = true;
            req.session.markReadCount = result.count;

            logger.info(`成功将 ${result.count} 封邮件标记为已读`);
            return res.json({
                success: true,
                count: result.count,
                message: `成功将 ${result.count} 封邮件标记为已读`
            });
        } else {
            logger.error('标记邮件为已读失败:', result.error || '未知错误');
            return res.status(500).json({
                success: false,
                message: '标记邮件为已读失败: ' + (result.error || '未知错误')
            });
        }
    } catch (error) {
        logger.error('标记邮件为已读失败:', error);
        res.status(500).json({
            success: false,
            message: '标记邮件为已读失败: ' + error.message
        });
    }
});

// 删除邮件
router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const emailId = req.params.id;

        // 获取邮件详情
        const email = await database.getEmailById(emailId);

        if (!email) {
            return res.status(404).json({ success: false, message: '邮件不存在' });
        }

        // 删除邮件
        const result = await database.deleteEmail(emailId);

        if (result) {
            // 删除附件文件
            if (email.attachments && email.attachments.length > 0) {
                for (const attachment of email.attachments) {
                    try {
                        if (fs.existsSync(attachment.path)) {
                            fs.unlinkSync(attachment.path);
                        }
                    } catch (e) {
                        logger.warn(`删除附件文件失败: ${attachment.path}`, e);
                    }
                }
            }

            return res.json({ success: true });
        } else {
            return res.status(500).json({ success: false, message: '删除邮件失败' });
        }
    } catch (error) {
        logger.error(`删除邮件失败: ID=${req.params.id}`, error);
        res.status(500).json({ success: false, message: '删除邮件失败: ' + error.message });
    }
});

module.exports = router;
