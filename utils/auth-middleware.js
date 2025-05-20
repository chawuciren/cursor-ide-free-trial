const logger = require('./logger');
const { verifyToken } = require('./jwt-helper');

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: '未提供认证token'
            });
        }

        // 验证JWT token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: '无效的token或token已过期'
            });
        }

        // 将用户信息添加到请求对象中
        req.user = decoded;
        next();

    } catch (error) {
        logger.error('认证中间件错误:', error);
        res.status(500).json({
            success: false,
            error: '认证失败'
        });
    }
}

module.exports = authMiddleware;