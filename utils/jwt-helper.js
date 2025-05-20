const jwt = require('jsonwebtoken');
const { getConfig } = require('./config');
const logger = require('./logger');

// 从配置文件获取JWT密钥，如果没有则使用默认值
const getJwtSecret = () => {
    const config = getConfig();
    return config.jwt?.secret || 'your-default-jwt-secret-key';
};

// 生成JWT token
const generateToken = (user) => {
    try {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            // 添加其他需要的用户信息
        };

        const config = getConfig();
        const expiresIn = config.jwt?.expiresIn || '24h'; // 默认24小时过期

        const token = jwt.sign(payload, getJwtSecret(), { expiresIn });
        return { token, expiresIn };
    } catch (error) {
        logger.error('生成JWT token失败:', error);
        throw new Error('生成认证token失败');
    }
};

// 验证JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        return decoded;
    } catch (error) {
        logger.error('验证JWT token失败:', error);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
