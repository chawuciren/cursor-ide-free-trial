const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const logger = require('../utils/logger');
const authMiddleware = require('../utils/auth-middleware');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


// 获取用户信息 - 添加 authMiddleware 中间件
router.get('/info', authMiddleware, async (req, res) => {
    try {
        // 由于使用了 auth 中间件，可以直接从 req.user 获取用户信息
        const user = req.user;
        
        // 获取用户最新的account信息
        const latestAccount = await database.query(
            `SELECT username, email, firstname, lastname, password, created_at, expire_time 
             FROM accounts 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [user.id]
        );

        res.json({
            success: true,
            data: {
                username: user.username,
                expireTime: user.expire_time,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
                remainingAccounts: user.remaining_accounts,
                latestAccount: latestAccount.length > 0 ? {
                    username: latestAccount[0].username,
                    email: latestAccount[0].email,
                    firstname: latestAccount[0].firstname,
                    lastname: latestAccount[0].lastname,
                    password: latestAccount[0].password,
                    createdAt: latestAccount[0].created_at,
                    expireTime: latestAccount[0].expire_time
                } : null
            }
        });

    } catch (error) {
        logger.error('获取用户信息失败:', error);
        res.status(500).json({
            success: false,
            error: '获取用户信息失败'
        });
    }
});

// 添加管理员密钥验证中间件
function adminAuthMiddleware(req, res, next) {
    const adminKey = req.headers['admin-key'];
    // 这里替换成你的实际管理员密钥
    const ADMIN_SECRET_KEY = 'yxn1910yxn1910';

    if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
        return res.status(401).json({
            success: false,
            error: '无效的管理员密钥'
        });
    }
    next();
}

// 获取私钥路径
function getPrivateKeyPath() {
    return path.join(process.env.APP_ROOT || path.resolve(__dirname, '..'), 'keys', 'private.pem');
}

// 生成授权码
function generateLicense(data) {
    try {
        const privateKey = fs.readFileSync(getPrivateKeyPath(), 'utf8');
        const buffer = Buffer.from(JSON.stringify(data));
        const encrypted = crypto.privateEncrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            buffer
        );
        return encrypted.toString('base64');
    } catch (error) {
        logger.error('生成授权码失败:', error);
        throw new Error('生成授权码失败');
    }
}

/**
 * 授权用户接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 请求体参数:
 * @param {string} username - 用户名，必需
 * @param {string} machineCode - 机器码，用作用户的唯一标识key，必需
 * @param {number|string} expiryDate - 过期时间，必需
 *                                    接受格式:
 *                                    - 毫秒时间戳 (number): 1703980800000
 *                                    - 日期字符串 (string): "2024-12-31"
 *                                    注意：内部存储使用毫秒时间戳
 * @param {string[]} [features] - 功能列表，可选，默认为空数组
 *                               例如: ["feature1", "feature2"]
 * @param {string} [type] - 授权类型，可选，默认为'standard'
 *                         可选值:
 *                         - 'standard': 标准版
 *                         - 'pro': 专业版
 *                         - 'enterprise': 企业版
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "username": "用户名",
 *     "machineCode": "XXXX-XXXX-XXXX-XXXX",
 *     "expiryDate": 1703980800000,  // 毫秒时间戳
 *     "features": ["feature1", "feature2"],
 *     "type": "pro"
 *   }
 * }
 * 
 * 错误响应示例:
 * {
 *   "success": false,
 *   "error": "错误信息"
 * }
 */
router.post('/license', adminAuthMiddleware, async (req, res) => {
    try {
        const {
            username,
            machineCode,
            expiryDate,
            features = [],
            type = 'standard',
            remaining_accounts = 0
        } = req.body;

        // 参数验证
        if (!username || !machineCode || !expiryDate) {
            return res.status(400).json({
                success: false,
                error: '用户名、机器码和过期时间不能为空'
            });
        }

        // 验证日期格式
        const expireTime = new Date(expiryDate).getTime();
        if (isNaN(expireTime)) {
            return res.status(400).json({
                success: false,
                error: '无效的日期格式'
            });
        }

        // 使用数据库方法创建或更新用户
        const result = await database.authorizeUser(
            username,
            machineCode,
            expireTime,
            remaining_accounts
        );

        // 生成授权信息
        const licenseData = {
            username,
            machineCode,
            expiryDate: expireTime,
            features,
            type,
            issueDate: Date.now()
        };

        // 生成授权码
        const licenseKey = generateLicense(licenseData);

        // 保存授权记录到 licenses 表
        await database.createLicense(result.id, licenseKey, expireTime);

        res.json({
            success: true,
            data: {
                ...licenseData,
                isNewUser: result.isNew,
                licenseKey
            }
        });

    } catch (error) {
        logger.error('授权用户失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '授权失败'
        });
    }
});

// 获取公钥路径
function getPublicKeyPath() {
    return path.join(process.env.APP_ROOT || path.resolve(__dirname, '..'), 'keys', 'public.pem');
}

// 验证授权码
function verifyLicense(license) {
    try {
        const publicKey = fs.readFileSync(getPublicKeyPath(), 'utf8');
        const buffer = Buffer.from(license, 'base64');
        const decrypted = crypto.publicDecrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            buffer
        );
        return JSON.parse(decrypted.toString());
    } catch (error) {
        logger.error('验证授权码失败:', error);
        throw new Error('无效的授权码');
    }
}

/**
 * 查询授权信息接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 请求体参数: (至少需要提供以下参数之一)
 * @param {string} [license] - 授权码
 * @param {string} [username] - 用户名
 * @param {string} [machineCode] - 机器码
 */
router.post('/verify-license', adminAuthMiddleware, async (req, res) => {
    try {
        const { license, username, machineCode } = req.body;
        let user = null;
        let licenseInfo = null;

        // 根据不同参数获取用户信息
        if (license) {
            licenseInfo = verifyLicense(license);
            user = await database.getUserByUsername(licenseInfo.username);
        } else if (username) {
            user = await database.getUserByUsername(username);
        } else if (machineCode) {
            user = await database.getUserByKey(machineCode);
        } else {
            return res.status(400).json({
                success: false,
                error: '请提供授权码、用户名或机器码其中之一'
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                error: '未找到授权用户'
            });
        }

        // 获取用户的账号列表
        const accounts = await database.getAccountsByUserId(user.id);
        
        // 获取用户的授权历史
        const licenses = await database.getUserLicenses(user.id, { limit: 5 });

        res.json({
            success: true,
            data: {
                license: licenseInfo,  // 如果是通过授权码验证，则包含授权码信息
                user: {
                    id: user.id,
                    username: user.username,
                    machineCode: user.key,
                    expireTime: user.expire_time,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                    remainingAccounts: user.remaining_accounts
                },
                accounts: accounts.map(account => ({
                    username: account.username,
                    email: account.email,
                    firstname: account.firstname,
                    lastname: account.lastname,
                    expireTime: account.expire_time,
                    createdAt: account.created_at,
                    updatedAt: account.updated_at
                })),
                licenseHistory: licenses.map(license => ({
                    id: license.id,
                    expireTime: license.expire_time,
                    createdAt: license.created_at
                }))
            }
        });

    } catch (error) {
        logger.error('查询授权信息失败:', error);
        res.status(error.message === '无效的授权码' ? 400 : 500).json({
            success: false,
            error: error.message || '查询授权信息失败'
        });
    }
});

/**
 * 获取用户授权历史接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 请求参数:
 * @param {string} username - 用户名
 * @param {number} [limit=10] - 返回记录数量限制
 * @param {number} [offset=0] - 跳过记录数量
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "total": 5,
 *     "licenses": [{
 *       "id": 1,
 *       "licenseKey": "base64...",
 *       "expireTime": 1703980800000,
 *       "createdAt": 1672444800000
 *     }, ...]
 *   }
 * }
 */
router.get('/licenses/:username', adminAuthMiddleware, async (req, res) => {
    try {
        const { username } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        // 先获取用户信息
        const user = await database.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: '用户不存在'
            });
        }

        // 获取用户的授权历史
        const licenses = await database.getUserLicenses(user.id, { limit, offset });

        res.json({
            success: true,
            data: {
                total: licenses.length,
                licenses: licenses.map(license => ({
                    id: license.id,
                    licenseKey: license.license_key,
                    expireTime: license.expire_time,
                    createdAt: license.created_at
                }))
            }
        });

    } catch (error) {
        logger.error('获取授权历史失败:', error);
        res.status(500).json({
            success: false,
            error: '获取授权历史失败'
        });
    }
});

/**
 * 获取用户列表接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 查询参数:
 * @param {number} page - 当前页码，从1开始
 * @param {number} size - 每页显示数量
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "total": 100,
 *     "currentPage": 1,
 *     "pageSize": 10,
 *     "totalPages": 10,
 *     "users": [{
 *       "id": 1,
 *       "username": "用户名",
 *       "machineCode": "机器码",
 *       "type": "授权类型",
 *       "expireTime": 1703980800000
 *     }, ...]
 *   }
 * }
 */
router.get('/list', adminAuthMiddleware, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const size = Math.max(1, Math.min(100, parseInt(req.query.size) || 10));

        // 使用数据库方法获取用户列表
        const { total, users } = await database.getUserList(page, size);
        const totalPages = Math.ceil(total / size);

        res.json({
            success: true,
            data: {
                total,
                currentPage: page,
                pageSize: size,
                totalPages,
                users
            }
        });

    } catch (error) {
        logger.error('获取用户列表失败:', error);
        res.status(500).json({
            success: false,
            error: '获取用户列表失败'
        });
    }
});

/**
 * 获取账号列表接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 查询参数:
 * @param {number} page - 当前页码，从1开始
 * @param {number} size - 每页显示数量
 * @param {number} [userId] - 可选的用户ID过滤
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "total": 100,
 *     "currentPage": 1,
 *     "pageSize": 10,
 *     "totalPages": 10,
 *     "user": {  // 当指定userId时返回
 *       "username": "用户名",
 *       "expireTime": 1703980800000,
 *       "remainingAccounts": 5
 *     },
 *     "accounts": [{
 *       "username": "账号名",
 *       "email": "邮箱",
 *       "firstname": "名",
 *       "lastname": "姓",
 *       "createdAt": 1703980800000,
 *       "expireTime": 1703980800000
 *     }, ...]
 *   }
 * }
 */
router.get('/accounts', adminAuthMiddleware, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const size = Math.max(1, Math.min(100, parseInt(req.query.size) || 10));
        const userId = req.query.userId ? parseInt(req.query.userId) : null;

        const { total, user, accounts } = await database.getAccountList({ page, size, userId });
        const totalPages = Math.ceil(total / size);

        res.json({
            success: true,
            data: {
                total,
                currentPage: page,
                pageSize: size,
                totalPages,
                user,
                accounts
            }
        });

    } catch (error) {
        logger.error('获取账号列表失败:', error);
        res.status(error.message === '用户不存在' ? 404 : 500).json({
            success: false,
            error: error.message || '获取账号列表失败'
        });
    }
});

/**
 * 删除账号接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 路径参数:
 * @param {string} email - 要删除的账号邮箱
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "账号删除成功"
 *   }
 * }
 */
router.delete('/accounts/:email', adminAuthMiddleware, async (req, res) => {
    try {
        const { email } = req.params;
        await database.deleteAccountByEmail(email);

        res.json({
            success: true,
            data: {
                message: '账号删除成功'
            }
        });

    } catch (error) {
        logger.error('删除账号失败:', error);
        res.status(error.message === '账号不存在或已被删除' ? 404 : 500).json({
            success: false,
            error: error.message || '删除账号失败'
        });
    }
});

/**
 * 获取授权列表接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 查询参数:
 * @param {number} page - 当前页码，从1开始
 * @param {number} size - 每页显示数量
 * @param {number} [userId] - 可选的用户ID过滤
 * @param {string} [username] - 可选的用户名过滤
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "total": 100,
 *     "currentPage": 1,
 *     "pageSize": 10,
 *     "totalPages": 10,
 *     "user": {  // 当指定userId或username时返回
 *       "username": "用户名",
 *       "machineCode": "机器码",
 *       "expireTime": 1703980800000
 *     },
 *     "licenses": [{
 *       "id": 1,
 *       "username": "用户名",
 *       "licenseKey": "授权码",
 *       "expireTime": 1703980800000,
 *       "createdAt": 1672444800000
 *     }, ...]
 *   }
 * }
 */
router.get('/licenses', adminAuthMiddleware, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const size = Math.max(1, Math.min(100, parseInt(req.query.size) || 10));
        const userId = req.query.userId ? parseInt(req.query.userId) : null;
        const username = req.query.username || null;

        const { total, user, licenses } = await database.getLicenseList({ 
            page, 
            size, 
            userId,
            username 
        });

        const totalPages = Math.ceil(total / size);

        res.json({
            success: true,
            data: {
                total,
                currentPage: page,
                pageSize: size,
                totalPages,
                user,
                licenses
            }
        });

    } catch (error) {
        logger.error('获取授权列表失败:', error);
        res.status(error.message === '用户不存在' ? 404 : 500).json({
            success: false,
            error: error.message || '获取授权列表失败'
        });
    }
});

/**
 * 删除授权记录接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 路径参数:
 * @param {number} id - 授权记录ID
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "授权记录删除成功"
 *   }
 * }
 */
router.delete('/licenses/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: '无效的授权记录ID'
            });
        }

        await database.deleteLicense(id);

        res.json({
            success: true,
            data: {
                message: '授权记录删除成功'
            }
        });

    } catch (error) {
        logger.error('删除授权记录失败:', error);
        res.status(error.message === '授权记录不存在' ? 404 : 500).json({
            success: false,
            error: error.message || '删除授权记录失败'
        });
    }
});

/**
 * 删除用户接口
 * 
 * 请求头:
 * - admin-key: 管理员密钥，必需
 * 
 * 路径参数:
 * @param {number} id - 用户ID
 * 
 * 响应示例:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "用户删除成功"
 *   }
 * }
 */
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: '无效的用户ID'
            });
        }

        await database.deleteUser(id);

        res.json({
            success: true,
            data: {
                message: '用户删除成功'
            }
        });

    } catch (error) {
        logger.error('删除用户失败:', error);
        res.status(error.message === '用户不存在' ? 404 : 500).json({
            success: false,
            error: error.message || '删除用户失败'
        });
    }
});

module.exports = router;
