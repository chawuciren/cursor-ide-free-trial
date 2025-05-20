const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const database = require('../utils/database');
const authMiddleware = require('../utils/auth-middleware');
const { checkEmailAccessMiddleware } = require('../utils/api-auth-middleware');
const mailService = require('../utils/mail-service');

// 添加认证中间件
router.use(authMiddleware);

// 创建邮件访问权限检查中间件
const checkEmailAccess = checkEmailAccessMiddleware(database);

// 初始化邮件客户端
// 注意：此函数已不再使用，邮件拉取现在直接使用mailService

/**
 * 获取邮件列表
 *
 * 查询参数:
 * @param {string} [account] - 邮箱账号，如果不提供则获取所有邮件
 * @param {number} [page=1] - 页码，从1开始
 * @param {number} [limit=20] - 每页数量
 * @param {string} [sender] - 发件人过滤
 * @param {string} [subject] - 主题过滤
 * @param {string} [startDate] - 开始日期过滤 (YYYY-MM-DD)
 * @param {string} [endDate] - 结束日期过滤 (YYYY-MM-DD)
 * @param {boolean} [unreadOnly=false] - 是否只显示未读邮件
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "emails": [...],
 *     "total": 100,
 *     "page": 1,
 *     "limit": 20,
 *     "totalPages": 5
 *   }
 * }
 */
router.get('/list', checkEmailAccess, async (req, res) => {
    try {
        const {
            account,
            page = 1,
            limit = 20,
            sender,
            subject,
            startDate,
            endDate,
            unreadOnly
        } = req.query;

        // 权限检查已在中间件中完成

        // 构建过滤条件
        const filters = {};
        if (account) filters.account = account;
        if (sender) filters.sender = sender;
        if (subject) filters.subject = subject;
        if (startDate) filters.startDate = new Date(startDate).getTime();
        if (endDate) filters.endDate = new Date(endDate).getTime();
        if (unreadOnly === 'true') filters.is_read = 0;

        // 获取邮件列表
        const result = await database.getEmailsPaginated(
            parseInt(page),
            parseInt(limit),
            filters
        );

        res.json({
            success: true,
            data: {
                emails: result.emails,
                total: result.total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: result.pages
            }
        });
    } catch (error) {
        logger.error('获取邮件列表失败:', error);
        res.status(500).json({
            success: false,
            error: '获取邮件列表失败',
            message: error.message
        });
    }
});

/**
 * 获取邮件详情
 *
 * 路径参数:
 * @param {number} id - 邮件ID
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "email": {...}
 *   }
 * }
 */
router.get('/:id', checkEmailAccess, async (req, res) => {
    try {
        const emailId = parseInt(req.params.id);

        // 获取邮件详情
        const email = await database.getEmailById(emailId);

        if (!email) {
            return res.status(404).json({
                success: false,
                error: '邮件不存在'
            });
        }

        // 权限检查已在中间件中完成

        res.json({
            success: true,
            data: {
                email
            }
        });
    } catch (error) {
        logger.error('获取邮件详情失败:', error);
        res.status(500).json({
            success: false,
            error: '获取邮件详情失败',
            message: error.message
        });
    }
});

/**
 * 标记邮件为已读
 *
 * 路径参数:
 * @param {number} id - 邮件ID
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "邮件已标记为已读"
 *   }
 * }
 */
router.put('/:id/read', checkEmailAccess, async (req, res) => {
    try {
        const emailId = parseInt(req.params.id);

        // 获取邮件详情
        const email = await database.getEmailById(emailId);

        if (!email) {
            return res.status(404).json({
                success: false,
                error: '邮件不存在'
            });
        }

        // 权限检查已在中间件中完成

        // 标记为已读
        await database.markEmailAsRead(emailId);

        res.json({
            success: true,
            data: {
                message: '邮件已标记为已读'
            }
        });
    } catch (error) {
        logger.error('标记邮件为已读失败:', error);
        res.status(500).json({
            success: false,
            error: '标记邮件为已读失败',
            message: error.message
        });
    }
});

/**
 * 批量标记邮件为已读
 *
 * 请求体:
 * {
 *   "ids": [1, 2, 3] // 邮件ID数组
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "邮件已批量标记为已读",
 *     "count": 3
 *   }
 * }
 */
router.put('/batch/read', checkEmailAccess, async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: '请提供有效的邮件ID数组'
            });
        }

        // 对于非管理员，需要验证所有邮件都属于该用户
        if (!req.user.isAdmin) {
            for (const id of ids) {
                const email = await database.getEmailById(id);
                if (!email || email.account !== req.user.email) {
                    return res.status(403).json({
                        success: false,
                        error: '您没有权限操作某些邮件'
                    });
                }
            }
        }

        // 批量标记为已读
        const count = await database.markEmailsAsRead(ids);

        res.json({
            success: true,
            data: {
                message: '邮件已批量标记为已读',
                count
            }
        });
    } catch (error) {
        logger.error('批量标记邮件为已读失败:', error);
        res.status(500).json({
            success: false,
            error: '批量标记邮件为已读失败',
            message: error.message
        });
    }
});

// 邮件拉取进度现在由 mailService 管理

/**
 * 获取邮件拉取进度
 *
 * 响应:
 * {
 *   "isRunning": true,
 *   "step": 2,
 *   "progress": 45,
 *   "message": "处理邮件 5/10...",
 *   "processedEmails": 5,
 *   "totalEmails": 10,
 *   "processedAccounts": 1,
 *   "totalAccounts": 3,
 *   "result": { ... } // 如果完成，包含结果信息
 * }
 */
router.get('/check-status', checkEmailAccess, (_, res) => {
    logger.info('收到API进度查询请求');

    // 从mailService获取进度
    const progress = mailService.getProgress();
    res.json(progress);
});

/**
 * 从IMAP服务器拉取新邮件
 *
 * 查询参数:
 * @param {string} [account] - 邮箱账号，如果不提供则检查所有邮箱
 *
 * 响应:
 * {
 *   "success": true,
 *   "message": "邮件拉取已开始"
 * }
 */
router.post('/check', checkEmailAccess, async (req, res) => {
    try {
        const { account } = req.query;

        // 权限检查已在中间件中完成

        // 立即返回响应
        res.json({
            success: true,
            message: '邮件拉取已开始'
        });

        // 异步处理邮件拉取
        (async () => {
            try {
                logger.info('开始拉取新邮件...');

                // 使用抽取的邮件服务方法拉取邮件
                const result = await mailService.fetchNewEmails(account);

                // 添加活动记录
                if (result.success) {
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
                }
            } catch (error) {
                logger.error('检查邮件失败:', error);
            }
        })();
    } catch (error) {
        logger.error('启动邮件拉取失败:', error);
        res.status(500).json({
            success: false,
            error: '启动邮件拉取失败',
            message: error.message
        });
    }
});

// 在进程退出前关闭邮件服务连接
process.on('exit', () => {
    logger.info('进程退出，关闭邮件服务连接');
    mailService.close().catch(err => logger.error('关闭邮件服务连接失败:', err));
});

// 导出路由
module.exports = router;