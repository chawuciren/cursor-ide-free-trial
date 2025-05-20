/**
 * API权限控制中间件
 * 提供API路由的权限控制功能
 */
const logger = require('./logger');

/**
 * 检查用户是否为管理员
 * 如果不是管理员，返回403错误
 */
const isAdminMiddleware = (req, res, next) => {
    try {
        // 确保用户已通过认证
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: '未认证的请求'
            });
        }

        // 检查用户是否为管理员
        if (!req.user.isAdmin) {
            logger.warn(`非管理员用户 ${req.user.email} 尝试访问管理员API: ${req.method} ${req.path}`);
            return res.status(403).json({
                success: false,
                error: '权限不足，需要管理员权限'
            });
        }

        // 用户是管理员，允许继续
        next();
    } catch (error) {
        logger.error('管理员权限检查中间件错误:', error);
        res.status(500).json({
            success: false,
            error: '权限检查失败'
        });
    }
};

/**
 * 检查用户是否有权限访问指定邮箱的邮件
 * 管理员可以访问所有邮箱的邮件
 * 普通用户只能访问自己邮箱的邮件
 * 
 * 使用方法：
 * 1. 在路由处理函数中，确保req.query.account或req.params.id存在
 * 2. 如果使用ID，需要先从数据库获取邮件信息，然后检查邮件的account字段
 */
const checkEmailAccessMiddleware = (database) => {
    return async (req, res, next) => {
        try {
            // 确保用户已通过认证
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: '未认证的请求'
                });
            }

            // 管理员可以访问所有邮件
            if (req.user.isAdmin) {
                return next();
            }

            // 获取请求中的邮箱账号
            let accountToAccess = null;

            // 从查询参数中获取账号
            if (req.query && req.query.account) {
                accountToAccess = req.query.account;
            }

            // 如果请求体中有账号信息
            if (!accountToAccess && req.body && req.body.account) {
                accountToAccess = req.body.account;
            }

            // 如果是获取邮件详情的请求，通过ID获取邮件信息
            if (!accountToAccess && req.params && req.params.id) {
                const emailId = req.params.id;
                const email = await database.getEmailById(emailId);
                
                if (email) {
                    accountToAccess = email.account;
                } else {
                    return res.status(404).json({
                        success: false,
                        error: '邮件不存在'
                    });
                }
            }

            // 如果没有找到账号信息，默认使用用户自己的邮箱
            if (!accountToAccess) {
                accountToAccess = req.user.email;
            }

            // 检查用户是否有权限访问该邮箱
            if (accountToAccess !== req.user.email) {
                logger.warn(`用户 ${req.user.email} 尝试访问其他邮箱 ${accountToAccess} 的邮件`);
                return res.status(403).json({
                    success: false,
                    error: '您没有权限访问此邮箱的邮件'
                });
            }

            // 用户有权限访问，允许继续
            next();
        } catch (error) {
            logger.error('邮件访问权限检查中间件错误:', error);
            res.status(500).json({
                success: false,
                error: '权限检查失败'
            });
        }
    };
};

module.exports = {
    isAdminMiddleware,
    checkEmailAccessMiddleware
};
