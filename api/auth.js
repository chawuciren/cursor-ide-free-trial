const express = require('express');
const router = express.Router();
const { getConfig } = require('../utils/config');
const database = require('../utils/database');
const logger = require('../utils/logger');
const { generateToken } = require('../utils/jwt-helper');
const loginLimiter = require('../utils/login-limiter');

/**
 * 登录接口 - 通过账号密码获取JWT token
 *
 * 请求体:
 * @param {string} username - 用户名或邮箱
 * @param {string} password - 密码
 *
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "expiresIn": "24h",
 *     "user": {
 *       "id": 1,
 *       "username": "admin",
 *       "isAdmin": true
 *     }
 *   }
 * }
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: '用户名和密码不能为空'
            });
        }

        // 获取客户端IP地址
        const clientIp = req.ip || req.socket.remoteAddress;

        // 创建用户标识符（用户名+IP地址）
        const identifier = `${username}@${clientIp}`;

        // 检查用户是否被锁定
        const lockStatus = loginLimiter.isLocked(identifier);
        if (lockStatus.locked) {
            // 计算剩余锁定时间（分钟）
            const remainingMinutes = Math.ceil(lockStatus.remainingTime / 60000);

            // 记录锁定状态
            await database.addActivity(
                'login_blocked',
                'lock',
                `用户 ${username} 通过API登录被阻止（账号已锁定）`,
                null,
                {
                    username,
                    ip: clientIp,
                    userAgent: req.headers['user-agent'],
                    remainingTime: lockStatus.remainingTime,
                    via: 'api'
                }
            );

            // 返回锁定信息
            return res.status(429).json({
                success: false,
                error: `账号已锁定，请在 ${remainingMinutes} 分钟后重试`,
                lockStatus: {
                    locked: true,
                    remainingTime: lockStatus.remainingTime,
                    remainingMinutes
                }
            });
        }

        // 从配置文件中获取管理员凭据
        const config = getConfig();
        const adminCredentials = config.admin || { username: 'admin', password: 'admin' };

        // 首先检查是否是管理员登录
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // 登录成功，重置失败计数
            loginLimiter.resetAttempts(identifier);

            // 创建管理员用户对象
            const adminUser = {
                id: 0, // 管理员使用特殊ID
                username: adminCredentials.username,
                email: null,
                isAdmin: true
            };

            // 生成JWT token
            const { token, expiresIn } = generateToken(adminUser);

            // 记录登录活动
            await database.addActivity(
                'user_login',
                'box-arrow-in-right',
                `管理员 ${username} 通过API登录系统`,
                null,
                {
                    username,
                    isAdmin: true,
                    ip: clientIp,
                    userAgent: req.headers['user-agent'],
                    via: 'api'
                }
            );

            return res.json({
                success: true,
                data: {
                    token,
                    expiresIn,
                    user: {
                        username: adminUser.username,
                        isAdmin: adminUser.isAdmin
                    }
                }
            });
        }

        // 如果不是管理员，尝试通过邮箱账号登录
        const account = await database.getAccountByEmail(username);

        // 如果找到账号并且密码匹配
        if (account && account.password === password) {
            // 登录成功，重置失败计数
            loginLimiter.resetAttempts(identifier);

            // 创建普通用户对象
            const regularUser = {
                id: account.id,
                username: account.username,
                email: account.email,
                isAdmin: false
            };

            // 生成JWT token
            const { token, expiresIn } = generateToken(regularUser);

            // 记录登录活动
            await database.addActivity(
                'user_login',
                'box-arrow-in-right',
                `邮箱账号 ${account.email} 通过API登录系统`,
                account.id,
                {
                    username: account.username,
                    email: account.email,
                    isAdmin: false,
                    ip: clientIp,
                    userAgent: req.headers['user-agent'],
                    via: 'api'
                }
            );

            // 更新最后访问时间
            await database.updateAccountLastAccessed(account.id);

            return res.json({
                success: true,
                data: {
                    token,
                    expiresIn,
                    user: {
                        id: account.id,
                        username: account.username,
                        email: account.email,
                        isAdmin: false
                    }
                }
            });
        }

        // 登录失败，记录失败尝试
        const attemptResult = loginLimiter.recordFailedAttempt(identifier);

        // 记录登录失败活动
        await database.addActivity(
            'login_failed',
            'exclamation-triangle',
            `用户 ${username} 通过API登录失败（剩余尝试次数: ${attemptResult.remainingAttempts}）`,
            null,
            {
                username,
                ip: clientIp,
                userAgent: req.headers['user-agent'],
                remainingAttempts: attemptResult.remainingAttempts,
                via: 'api'
            }
        );

        // 如果此次失败导致账号被锁定
        if (attemptResult.locked) {
            const lockMinutes = Math.ceil(attemptResult.lockTime / 60000);
            return res.status(429).json({
                success: false,
                error: `登录失败次数过多，账号已锁定 ${lockMinutes} 分钟`,
                lockStatus: {
                    locked: true,
                    remainingTime: attemptResult.lockTime,
                    remainingMinutes: lockMinutes
                }
            });
        }

        // 普通登录失败
        return res.status(401).json({
            success: false,
            error: `用户名或密码错误（剩余尝试次数: ${attemptResult.remainingAttempts}）`,
            remainingAttempts: attemptResult.remainingAttempts
        });

    } catch (error) {
        logger.error('登录失败:', error);
        res.status(500).json({
            success: false,
            error: '登录失败'
        });
    }
});

/**
 * 刷新token接口
 *
 * 请求头:
 * Authorization: Bearer <token>
 *
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "token": "新的JWT token",
 *     "expiresIn": "24h"
 *   }
 * }
 */
router.post('/refresh', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: '未提供认证token'
            });
        }

        // 验证当前token
        const { verifyToken, generateToken } = require('../utils/jwt-helper');
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: '无效的token'
            });
        }

        // 生成新token
        const user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            isAdmin: decoded.isAdmin
        };

        const { token: newToken, expiresIn } = generateToken(user);

        res.json({
            success: true,
            data: {
                token: newToken,
                expiresIn
            }
        });

    } catch (error) {
        logger.error('刷新token失败:', error);
        res.status(500).json({
            success: false,
            error: '刷新token失败'
        });
    }
});

module.exports = router;
