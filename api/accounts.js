const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const database = require('../utils/database');
const authMiddleware = require('../utils/auth-middleware');
const { isAdminMiddleware } = require('../utils/api-auth-middleware');
const AccountGenerator = require('../utils/account-generator');
const CloudflareEmailManager = require('../utils/cloudflare-email-router');
const { getConfig } = require('../utils/config');

// 添加认证中间件到所有路由
router.use(authMiddleware);

// 添加管理员权限检查中间件到所有路由
router.use(isAdminMiddleware);

/**
 * 获取账号列表（分页）
 *
 * 查询参数:
 * @param {number} [page=1] - 页码，从1开始
 * @param {number} [pageSize=10] - 每页数量
 * @param {string} [search] - 搜索关键词（搜索邮箱或用户名）
 * @param {string} [status] - 状态过滤（active/inactive）
 * @param {string} [sortBy] - 排序字段
 * @param {string} [sortOrder] - 排序方向（asc/desc）
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "accounts": [...],
 *     "pagination": {
 *       "current": 1,
 *       "pageSize": 10,
 *       "total": 100,
 *       "totalPages": 10
 *     }
 *   }
 * }
 */
router.get('/', async (req, res) => {
    try {
        // 获取分页和过滤参数
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'desc';

        // 验证分页参数
        if (page < 1 || pageSize < 1 || pageSize > 100) {
            return res.status(400).json({
                success: false,
                error: '无效的分页参数'
            });
        }

        // 构建过滤条件
        const filters = {};
        if (search) filters.search = search;
        if (status === 'active') filters.is_active = 1;
        if (status === 'inactive') filters.is_active = 0;

        // 管理员可以查看所有账号

        // 获取总数和分页数据
        // 将排序参数添加到过滤条件中
        if (sortBy) filters.sortBy = sortBy;
        if (sortOrder) filters.sortOrder = sortOrder;

        const result = await database.getAccountsPaginated(
            page,
            pageSize,
            filters
        );

        res.json({
            success: true,
            data: {
                accounts: result.accounts,
                pagination: {
                    current: page,
                    pageSize,
                    total: result.total,
                    totalPages: result.pages
                }
            }
        });
    } catch (error) {
        logger.error('获取账号列表失败:', error);
        res.status(500).json({
            success: false,
            error: '获取账号列表失败',
            message: error.message
        });
    }
});

/**
 * 获取账号详情
 *
 * 路径参数:
 * @param {string} id - 账号ID
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "account": {...}
 *   }
 * }
 */
router.get('/:id', async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号详情
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        // 验证用户权限
        if (!req.user.isAdmin && account.email !== req.user.email) {
            return res.status(403).json({
                success: false,
                error: '您没有权限查看此账号'
            });
        }

        res.json({
            success: true,
            data: {
                account
            }
        });
    } catch (error) {
        logger.error('获取账号详情失败:', error);
        res.status(500).json({
            success: false,
            error: '获取账号详情失败',
            message: error.message
        });
    }
});

/**
 * 自动生成账号
 *
 * 请求体:
 * {
 *   "domain": "example.com" // 可选，如果不提供则使用配置中的默认域名
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "account": {...}
 *   }
 * }
 */
router.post('/generate', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const { domain } = req.body;
        const config = getConfig();
        const accountGenerator = new AccountGenerator(config);
        const cloudflareManager = new CloudflareEmailManager(config);

        logger.info('开始自动生成账号...');

        // 生成账号信息
        const account = await accountGenerator.generateAccount(domain);

        // 注册邮件账号到Cloudflare
        await cloudflareManager.registerEmailAccount(account);

        // 保存到数据库
        const result = await database.createAccount({
            username: account.username,
            email: account.email,
            password: account.password,
            is_active: 1,
            created_at: Date.now(),
            last_accessed: null
        });

        // 记录活动
        await database.addActivity(
            'account_create',
            'person-plus',
            `自动生成账号 ${account.email}`,
            result.id,
            { method: 'auto', account: account.email }
        );

        logger.info('账号自动生成成功:', account.email);

        res.json({
            success: true,
            data: {
                account: {
                    id: result.id,
                    ...account,
                    is_active: 1,
                    created_at: Date.now()
                }
            }
        });
    } catch (error) {
        logger.error('自动生成账号失败:', error);
        res.status(500).json({
            success: false,
            error: '自动生成账号失败',
            message: error.message
        });
    }
});

/**
 * 手动创建账号
 *
 * 请求体:
 * {
 *   "username": "testuser",
 *   "domain": "example.com",
 *   "password": "password123" // 可选，如果不提供则自动生成
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "account": {...}
 *   }
 * }
 */
router.post('/', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const { username, domain, password } = req.body;

        if (!username || !domain) {
            return res.status(400).json({
                success: false,
                error: '用户名和域名不能为空'
            });
        }

        const config = getConfig();
        const accountGenerator = new AccountGenerator(config);
        const cloudflareManager = new CloudflareEmailManager(config);

        logger.info('开始手动创建账号...');

        // 构建账号信息
        const email = `${username}@${domain}`;
        const accountPassword = password || accountGenerator.generatePassword();

        // 检查邮箱是否已存在
        const existingAccount = await database.getAccountByEmail(email);
        if (existingAccount) {
            return res.status(400).json({
                success: false,
                error: '该邮箱已存在'
            });
        }

        // 注册邮件账号到Cloudflare
        await cloudflareManager.registerEmailAccount({
            email,
            password: accountPassword
        });

        // 保存到数据库
        const result = await database.createAccount({
            username,
            email,
            password: accountPassword,
            is_active: 1,
            created_at: Date.now(),
            last_accessed: null
        });

        // 记录活动
        await database.addActivity(
            'account_create',
            'person-plus',
            `手动创建账号 ${email}`,
            result.id,
            { method: 'manual', account: email }
        );

        logger.info('账号手动创建成功:', email);

        res.json({
            success: true,
            data: {
                account: {
                    id: result.id,
                    username,
                    email,
                    password: accountPassword,
                    is_active: 1,
                    created_at: Date.now()
                }
            }
        });
    } catch (error) {
        logger.error('手动创建账号失败:', error);
        res.status(500).json({
            success: false,
            error: '手动创建账号失败',
            message: error.message
        });
    }
});

/**
 * 编辑账号
 *
 * 路径参数:
 * @param {string} id - 账号ID
 *
 * 请求体:
 * {
 *   "username": "newusername", // 可选
 *   "password": "newpassword", // 可选
 *   "is_active": true/false    // 可选
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "account": {...}
 *   }
 * }
 */
router.put('/:id', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const accountId = req.params.id;
        const { username, password, is_active } = req.body;

        // 获取账号详情
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        // 构建更新数据
        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (password !== undefined) updateData.password = password;
        if (is_active !== undefined) updateData.is_active = is_active ? 1 : 0;

        // 如果没有要更新的数据，直接返回
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: '没有提供要更新的数据'
            });
        }

        // 如果更新了激活状态，同步到Cloudflare
        if (is_active !== undefined) {
            const config = getConfig();
            const cloudflareManager = new CloudflareEmailManager(config);

            if (is_active) {
                // 激活账号
                await cloudflareManager.enableEmailAccount(account.email);
            } else {
                // 停用账号
                await cloudflareManager.disableEmailAccount(account.email);
            }
        }

        // 更新数据库
        await database.updateAccount(accountId, updateData);

        // 获取更新后的账号
        const updatedAccount = await database.getAccountById(accountId);

        // 记录活动
        await database.addActivity(
            'account_update',
            'pencil',
            `编辑账号 ${account.email}`,
            accountId,
            {
                account: account.email,
                changes: updateData
            }
        );

        logger.info('账号编辑成功:', account.email);

        res.json({
            success: true,
            data: {
                account: updatedAccount
            }
        });
    } catch (error) {
        logger.error('编辑账号失败:', error);
        res.status(500).json({
            success: false,
            error: '编辑账号失败',
            message: error.message
        });
    }
});

/**
 * 删除账号
 *
 * 路径参数:
 * @param {string} id - 账号ID
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "账号删除成功"
 *   }
 * }
 */
router.delete('/:id', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const accountId = req.params.id;

        // 获取账号详情
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        const config = getConfig();
        const cloudflareManager = new CloudflareEmailManager(config);

        // 从Cloudflare删除邮件路由
        await cloudflareManager.removeEmailRoute(account.email);

        // 从数据库删除账号
        await database.deleteAccount(accountId);

        // 记录活动
        await database.addActivity(
            'account_delete',
            'trash',
            `删除账号 ${account.email}`,
            null,
            { account: account.email }
        );

        logger.info('账号删除成功:', account.email);

        res.json({
            success: true,
            data: {
                message: '账号删除成功'
            }
        });
    } catch (error) {
        logger.error('删除账号失败:', error);
        res.status(500).json({
            success: false,
            error: '删除账号失败',
            message: error.message
        });
    }
});

/**
 * 重置账号密码
 *
 * 路径参数:
 * @param {string} id - 账号ID
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "password": "新密码"
 *   }
 * }
 */
router.post('/:id/reset-password', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const accountId = req.params.id;

        // 获取账号详情
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        const config = getConfig();
        const accountGenerator = new AccountGenerator(config);
        const cloudflareManager = new CloudflareEmailManager(config);

        // 生成新密码
        const newPassword = accountGenerator.generatePassword();

        // 更新Cloudflare邮件路由密码
        await cloudflareManager.updateEmailAccountPassword(account.email, newPassword);

        // 更新数据库
        await database.updateAccount(accountId, { password: newPassword });

        // 记录活动
        await database.addActivity(
            'account_reset_password',
            'key',
            `重置账号密码 ${account.email}`,
            accountId,
            { account: account.email }
        );

        logger.info('账号密码重置成功:', account.email);

        res.json({
            success: true,
            data: {
                password: newPassword
            }
        });
    } catch (error) {
        logger.error('重置账号密码失败:', error);
        res.status(500).json({
            success: false,
            error: '重置账号密码失败',
            message: error.message
        });
    }
});

/**
 * 同步账号与Cloudflare
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "message": "账号同步成功",
 *     "added": 5,
 *     "updated": 3,
 *     "removed": 1
 *   }
 * }
 */
router.post('/sync', async (req, res) => {
    try {
        // 管理员权限已在中间件中验证

        const config = getConfig();
        const cloudflareManager = new CloudflareEmailManager(config);
        const accountGenerator = new AccountGenerator(config);

        logger.info('开始同步账号...');

        // 获取Cloudflare邮件路由列表
        const cloudflareRoutes = await cloudflareManager.listEmailRoutes();

        // 获取数据库中的所有账号
        const dbAccounts = await database.getAllAccounts();

        // 提取Cloudflare中的邮箱地址
        const cloudflareEmails = cloudflareRoutes
            .filter(route => route.matchers.some(matcher => matcher.type === 'literal' && matcher.field === 'to'))
            .map(route => {
                const matcher = route.matchers.find(m => m.type === 'literal' && m.field === 'to');
                return {
                    email: matcher.value,
                    enabled: route.enabled,
                    id: route.id
                };
            });

        // 提取数据库中的邮箱地址
        const dbEmailMap = {};
        dbAccounts.forEach(account => {
            dbEmailMap[account.email] = account;
        });

        // 统计结果
        const result = {
            added: 0,
            updated: 0,
            removed: 0
        };

        // 1. 添加Cloudflare中有但数据库中没有的账号
        for (const cfEmail of cloudflareEmails) {
            if (!dbEmailMap[cfEmail.email]) {
                // 生成随机密码
                const password = accountGenerator.generatePassword();

                // 添加到数据库
                const accountResult = await database.createAccount({
                    username: cfEmail.email.split('@')[0],
                    email: cfEmail.email,
                    password,
                    is_active: cfEmail.enabled ? 1 : 0,
                    created_at: Date.now(),
                    last_accessed: null
                });

                // 记录活动
                await database.addActivity(
                    'account_sync',
                    'cloud-arrow-down',
                    `从Cloudflare同步添加账号 ${cfEmail.email}`,
                    accountResult.id,
                    { account: cfEmail.email, action: 'add' }
                );

                result.added++;
            }
        }

        // 2. 更新数据库中有的账号状态
        for (const cfEmail of cloudflareEmails) {
            if (dbEmailMap[cfEmail.email]) {
                const dbAccount = dbEmailMap[cfEmail.email];
                const isActive = cfEmail.enabled ? 1 : 0;

                // 如果状态不同，更新数据库
                if (dbAccount.is_active !== isActive) {
                    await database.updateAccount(dbAccount.id, { is_active: isActive });

                    // 记录活动
                    await database.addActivity(
                        'account_sync',
                        'cloud-arrow-down',
                        `从Cloudflare同步更新账号状态 ${cfEmail.email}`,
                        dbAccount.id,
                        {
                            account: cfEmail.email,
                            action: 'update',
                            changes: { is_active: isActive }
                        }
                    );

                    result.updated++;
                }
            }
        }

        logger.info('账号同步完成');

        res.json({
            success: true,
            data: {
                message: '账号同步成功',
                ...result
            }
        });
    } catch (error) {
        logger.error('同步账号失败:', error);
        res.status(500).json({
            success: false,
            error: '同步账号失败',
            message: error.message
        });
    }
});

module.exports = router;
