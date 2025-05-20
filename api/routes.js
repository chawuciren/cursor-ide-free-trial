const accountsRouter = require('./accounts');
const emailsRouter = require('./emails');
const authRouter = require('./auth');
const logger = require('../utils/logger');

/**
 * 配置API路由
 * @param {Express} app - Express应用实例
 */
module.exports = (app) => {
    // 记录API请求日志
    app.use('/api', (req, res, next) => {
        logger.info(`API请求: ${req.method} ${req.path}`);
        next();
    });

    // 账号管理API
    app.use('/api/accounts', accountsRouter);

    // 邮件管理API
    app.use('/api/emails', emailsRouter);

    // 认证API
    app.use('/api/auth', authRouter);

    // API 404处理
    app.use('/api/*', (req, res) => {
        logger.warn(`API未找到: ${req.method} ${req.path}`);
        res.status(404).json({
            success: false,
            error: 'API路径不存在'
        });
    });

    // API错误处理
    app.use('/api', (err, req, res, next) => {
        logger.error(`API错误: ${req.method} ${req.path}`, err);
        res.status(500).json({
            success: false,
            error: '服务器内部错误',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });
};
