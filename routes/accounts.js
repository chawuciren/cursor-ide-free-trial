const express = require('express');
const router = express.Router();
const { getConfig } = require('../utils/config');
const CloudflareEmailManager = require('../utils/cloudflare-email-router');
const database = require('../utils/database');
const logger = require('../utils/logger');

// 中间件：检查是否已登录
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return next();
    }
    res.redirect('/login');
};

// 中间件：检查是否是管理员
const isAdmin = (req, res, next) => {
    if (req.session && req.session.authenticated && req.session.isAdmin !== false) {
        return next();
    }
    // 如果是普通用户，重定向到邮件页面
    if (req.session && req.session.authenticated) {
        return res.redirect('/mail');
    }
    // 如果未登录，重定向到登录页面
    res.redirect('/login');
};

// 账号列表页面
router.get('/', isAdmin, async (req, res) => {
    try {
        // 获取分页参数
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 获取筛选参数
        const filters = {
            domain: req.query.domain || 'all',
            status: req.query.status || 'all',
            search: req.query.search || ''
        };

        // 从数据库获取分页账号列表
        const { accounts, total, pages } = await database.getAccountsPaginated(page, pageSize, filters);

        // 从配置文件获取所有域名
        const config = getConfig();
        const domains = config.cloudflare.map(cf => cf.domain);

        res.render('accounts/index', {
            title: '账号管理',
            accounts,
            domains,
            pagination: {
                page,
                pageSize,
                total,
                pages,
                baseUrl: '/accounts'
            },
            filters,
            pageCss: 'accounts',
            pageJs: 'accounts'
        });
    } catch (error) {
        logger.error('获取账号列表失败:', error);
        res.status(500).render('error', {
            title: '错误',
            message: '获取账号列表失败',
            error
        });
    }
});

// 创建账号页面
router.get('/create', isAdmin, (req, res) => {
    try {
        // 从配置文件获取域名列表
        const config = getConfig();
        const domains = config.cloudflare.map((cf, index) => ({
            id: index + 1,
            name: cf.domain
        }));

        res.render('accounts/create', {
            title: '创建账号',
            domains,
            pageCss: 'account-create',
            pageJs: 'account-create'
        });
    } catch (error) {
        logger.error('加载创建账号页面失败:', error);
        res.status(500).render('error', {
            title: '错误',
            message: '加载创建账号页面失败',
            error
        });
    }
});

// 查看账号页面
router.get('/view/:id', isAdmin, async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号信息
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).render('error', {
                title: '错误',
                message: '账号不存在',
                error: { status: 404 }
            });
        }

        res.render('accounts/view', {
            title: '账号详情',
            account,
            pageCss: 'account-view',
            pageJs: 'account-view'
        });
    } catch (error) {
        logger.error(`查看账号失败: ID=${req.params.id}`, error);
        res.status(500).render('error', {
            title: '错误',
            message: '查看账号失败',
            error
        });
    }
});

// 编辑账号页面
router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号信息
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).render('error', {
                title: '错误',
                message: '账号不存在',
                error: { status: 404 }
            });
        }

        res.render('accounts/edit', {
            title: '编辑账号',
            account,
            pageCss: 'account-edit',
            pageJs: 'account-edit'
        });
    } catch (error) {
        logger.error(`加载编辑账号页面失败: ID=${req.params.id}`, error);
        res.status(500).render('error', {
            title: '错误',
            message: '加载编辑账号页面失败',
            error
        });
    }
});

// 处理编辑账号请求
router.post('/edit/:id', isAdmin, async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号信息
        const account = await database.getAccountById(accountId);

        if (!account) {
            return res.status(404).render('error', {
                title: '错误',
                message: '账号不存在',
                error: { status: 404 }
            });
        }

        // 获取表单数据
        const { status, notes, password } = req.body;

        // 检查状态是否变更
        const statusChanged = account.status !== status;

        // 更新账号
        const updateData = {
            status,
            notes
        };

        // 如果提供了新密码，则更新密码
        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        const result = await database.updateAccount(accountId, updateData);

        if (result) {
            // 如果状态发生变更，同步更新Cloudflare路由状态
            if (statusChanged) {
                try {
                    logger.info(`账号状态已变更: ${account.email}, 新状态: ${status}`);

                    // 获取配置
                    const config = getConfig();
                    const cloudflareManager = new CloudflareEmailManager(config);

                    // 根据状态设置路由是否启用
                    const enabled = status === 'active';

                    // 更新Cloudflare路由状态
                    const updateResult = await cloudflareManager.updateEmailRouteStatus(account.email, enabled);

                    if (updateResult.success) {
                        logger.info(`Cloudflare路由状态更新成功: ${account.email}, 启用状态: ${enabled}`);
                    } else {
                        logger.warn(`Cloudflare路由状态更新失败: ${account.email}, 错误: ${updateResult.error}`);
                    }
                } catch (cloudflareError) {
                    logger.error(`更新Cloudflare路由状态失败: ${account.email}`, cloudflareError);
                    // 不中断流程，继续重定向
                }
            }

            // 添加活动记录（除了状态和密码更新外的其他更改）
            if (!statusChanged && !updateData.password) {
                await database.addActivity(
                    'account_update',
                    'pencil',
                    `编辑了账号 ${account.email} 的信息`,
                    accountId,
                    { email: account.email, notes: updateData.notes }
                );
            }

            // 更新成功，重定向到账号详情页
            return res.redirect(`/accounts/view/${accountId}`);
        } else {
            // 更新失败，显示错误
            logger.error(`更新账号失败: ID=${accountId}`);

            // 重新渲染编辑页面，显示错误信息
            res.render('accounts/edit', {
                title: '编辑账号',
                account,
                error: '更新账号失败，请重试',
                pageCss: 'account-edit',
                pageJs: 'account-edit'
            });
        }
    } catch (error) {
        logger.error(`更新账号失败: ID=${req.params.id}`, error);

        // 获取账号信息，用于重新渲染编辑页面
        const account = await database.getAccountById(req.params.id);

        res.status(500).render('accounts/edit', {
            title: '编辑账号',
            account,
            error: '更新账号失败: ' + (error.message || '未知错误'),
            pageCss: 'account-edit',
            pageJs: 'account-edit'
        });
    }
});

// 同步账号页面
router.get('/sync', isAdmin, (req, res) => {
    try {
        res.render('accounts/sync', {
            title: '同步账号',
            pageCss: 'account-sync',
            pageJs: 'account-sync'
        });
    } catch (error) {
        logger.error('加载同步账号页面失败:', error);
        res.status(500).render('error', {
            title: '错误',
            message: '加载同步账号页面失败',
            error
        });
    }
});

// 自动生成账号页面
router.get('/generate', isAdmin, (req, res) => {
    try {
        // 从配置文件获取域名列表
        const config = getConfig();
        const domains = config.cloudflare.map((cf, index) => ({
            id: index + 1,
            name: cf.domain
        }));

        res.render('accounts/generate', {
            title: '自动生成账号',
            domains,
            pageCss: 'account-generate',
            pageJs: 'account-generate'
        });
    } catch (error) {
        logger.error('加载自动生成账号页面失败:', error);
        res.status(500).render('error', {
            title: '错误',
            message: '加载自动生成账号页面失败',
            error
        });
    }
});

// 处理自动生成账号请求
router.post('/generate', isAdmin, async (req, res) => {
    try {
        const { domain, count, notes } = req.body;
        const generatedAccounts = [];
        const failedAccounts = [];

        // 验证参数
        const accountCount = parseInt(count) || 1;
        if (accountCount < 1 || accountCount > 10) {
            return res.status(400).json({
                success: false,
                error: '生成数量必须在1-10之间',
                step: 1
            });
        }

        // 获取配置
        const config = getConfig();
        const AccountGenerator = require('../utils/account-generator');
        const accountGenerator = new AccountGenerator(config);
        const cloudflareManager = new CloudflareEmailManager(config);

        logger.info(`开始自动生成 ${accountCount} 个账号...`);

        // 生成指定数量的账号
        for (let i = 0; i < accountCount; i++) {
            try {
                // 步骤1: 生成账号信息
                let account;
                if (domain && domain !== 'random') {
                    // 使用指定域名
                    const username = await accountGenerator.getAvailableUsername();
                    const password = accountGenerator.generatePassword();
                    account = {
                        username,
                        email: `${username}${domain}`,
                        password,
                        domain
                    };
                } else {
                    // 随机选择域名
                    account = await accountGenerator.generateAccount();
                    account.domain = account.email.substring(account.email.indexOf('@'));
                    account.username = account.email.substring(0, account.email.indexOf('@'));
                }

                // 步骤2: 推送到Cloudflare
                logger.info(`推送账号到Cloudflare: ${account.email}`);
                const result = await cloudflareManager.createEmailRoute(account.email);

                if (!result.success) {
                    logger.error(`推送到Cloudflare失败: ${account.email}`, result.error);
                    failedAccounts.push({
                        email: account.email,
                        error: '推送到Cloudflare失败'
                    });
                    continue;
                }

                // 步骤3: 保存到数据库
                logger.info(`保存账号到数据库: ${account.email}`);
                const savedAccount = await database.createAccount(
                    account.email,
                    account.username,
                    account.domain,
                    notes || '自动生成的账号',
                    account.password
                );

                generatedAccounts.push({
                    id: savedAccount.id,
                    email: account.email,
                    username: account.username,
                    domain: account.domain,
                    password: account.password
                });

                logger.info(`账号生成成功: ${account.email}`);
            } catch (error) {
                logger.error(`生成账号失败:`, error);
                failedAccounts.push({
                    error: error.message || '未知错误'
                });
            }
        }

        // 添加活动记录
        if (generatedAccounts.length > 0) {
            await database.addActivity(
                'account_generate',
                'magic',
                `自动生成了 ${generatedAccounts.length} 个账号`,
                null,
                {
                    count: generatedAccounts.length,
                    failed: failedAccounts.length,
                    domain: domain || 'random'
                }
            );
        }

        // 返回结果
        res.json({
            success: true,
            accounts: generatedAccounts,
            failed: failedAccounts.length,
            message: `成功生成 ${generatedAccounts.length} 个账号，失败 ${failedAccounts.length} 个`
        });
    } catch (error) {
        logger.error('自动生成账号失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '自动生成账号失败',
            step: 1
        });
    }
});

// 处理创建账号请求
router.post('/create', isAdmin, async (req, res) => {
    try {
        const { username, domain, password, notes } = req.body;

        if (!username || !domain) {
            return res.render('accounts/create', {
                title: '创建账号',
                domains: getConfig().cloudflare.map((cf, index) => ({
                    id: index + 1,
                    name: cf.domain
                })),
                error: '用户名和域名不能为空',
                pageCss: 'account-create',
                pageJs: 'account-create'
            });
        }

        // 验证用户名格式
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(username)) {
            return res.render('accounts/create', {
                title: '创建账号',
                domains: getConfig().cloudflare.map((cf, index) => ({
                    id: index + 1,
                    name: cf.domain
                })),
                error: '用户名只能包含字母、数字、下划线和连字符',
                pageCss: 'account-create',
                pageJs: 'account-create'
            });
        }

        // 构建完整的邮箱地址
        const email = username + domain;

        // 检查邮箱是否已存在
        const existingAccount = await database.getAccountByEmail(email);
        if (existingAccount) {
            return res.render('accounts/create', {
                title: '创建账号',
                domains: getConfig().cloudflare.map((cf, index) => ({
                    id: index + 1,
                    name: cf.domain
                })),
                error: `邮箱 ${email} 已存在`,
                pageCss: 'account-create',
                pageJs: 'account-create'
            });
        }

        // 如果没有提供密码，生成随机密码
        let accountPassword = password;
        if (!accountPassword) {
            const StringHelper = require('../utils/string-helper');
            accountPassword = StringHelper.generateRandomPassword();
        }

        // 创建Cloudflare邮件路由
        const config = getConfig();
        const cloudflareManager = new CloudflareEmailManager(config);

        // 注册邮件账号
        await cloudflareManager.registerEmailAccount({
            email,
            username
        });

        // 保存到数据库
        await database.createAccount(email, username, domain, notes, accountPassword);

        // 重定向到账号列表页面
        res.redirect('/accounts');
    } catch (error) {
        logger.error('创建账号失败:', error);
        res.render('accounts/create', {
            title: '创建账号',
            domains: getConfig().cloudflare.map((cf, index) => ({
                id: index + 1,
                name: cf.domain
            })),
            error: `创建账号失败: ${error.message}`,
            pageCss: 'account-create',
            pageJs: 'account-create'
        });
    }
});

// 删除账号
router.post('/delete/:id', isAdmin, async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号信息
        const account = await database.getAccountById(accountId);
        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        // 删除Cloudflare邮件路由
        const config = getConfig();
        const cloudflareManager = new CloudflareEmailManager(config);

        // 获取所有邮件路由规则
        const emailRoutes = await cloudflareManager.listEmailRoutes();

        // 查找对应的路由规则
        const emailRoute = emailRoutes.find(route =>
            route.matchers.some(matcher =>
                matcher.type === 'literal' &&
                matcher.field === 'to' &&
                matcher.value === account.email
            )
        );

        // 如果找到路由规则，先删除它
        if (emailRoute) {
            await cloudflareManager.removeEmailRoute(emailRoute.id, account.domain);
            logger.info(`Cloudflare 邮件路由规则删除成功: ${account.email}`);
        }

        // 从数据库中删除账号
        await database.deleteAccount(accountId);

        // 返回JSON响应
        res.json({ success: true });
    } catch (error) {
        logger.error('删除账号失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '删除账号失败'
        });
    }
});

// 重置账号密码
router.post('/reset-password/:id', isAuthenticated, async (req, res) => {
    try {
        const accountId = req.params.id;

        // 获取账号信息
        const account = await database.getAccountById(accountId);
        if (!account) {
            return res.status(404).json({
                success: false,
                error: '账号不存在'
            });
        }

        // 重置密码
        const result = await database.resetAccountPassword(accountId);

        if (result.success) {
            logger.info(`重置账号密码成功: ${account.email}`);
            res.json({
                success: true,
                password: result.password,
                message: '密码重置成功'
            });
        } else {
            logger.error(`重置账号密码失败: ${account.email}`);
            res.status(500).json({
                success: false,
                error: '重置密码失败'
            });
        }
    } catch (error) {
        logger.error('重置账号密码失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '重置密码失败'
        });
    }
});

// 同步账号
router.post('/sync', isAuthenticated, async (req, res) => {
    try {
        logger.info('开始同步账号...');

        // 从Cloudflare获取所有邮件路由规则
        const config = getConfig();
        const cloudflareManager = new CloudflareEmailManager(config);
        const emailRoutes = await cloudflareManager.listEmailRoutes();

        // 从数据库获取所有账号
        const localAccounts = await database.getAllAccounts();

        // 提取Cloudflare中的账号信息
        const cloudflareAccounts = [];
        emailRoutes.forEach(route => {
            // 查找邮箱地址匹配器
            const emailMatcher = route.matchers.find(matcher =>
                matcher.type === 'literal' &&
                matcher.field === 'to'
            );

            if (emailMatcher) {
                const email = emailMatcher.value;
                // 确保邮箱地址包含@符号
                if (email.includes('@')) {
                    const domain = email.substring(email.indexOf('@'));
                    const username = email.substring(0, email.indexOf('@'));

                    // 确保域名在配置文件中
                    if (config.cloudflare.some(cf => cf.domain === domain)) {
                        cloudflareAccounts.push({
                            email,
                            username,
                            domain,
                            enabled: route.enabled, // 保存路由规则的启用状态
                            routeId: route.id // 保存路由规则ID，便于后续操作
                        });
                    }
                }
            }
        });

        // 找出需要添加的账号（Cloudflare中有但本地没有）
        const accountsToAdd = cloudflareAccounts.filter(cloudAccount =>
            !localAccounts.some(localAccount => localAccount.email === cloudAccount.email)
        );

        // 找出需要删除的账号（本地有但Cloudflare中没有）
        const accountsToRemove = localAccounts.filter(localAccount =>
            !cloudflareAccounts.some(cloudAccount => cloudAccount.email === localAccount.email)
        );

        logger.info(`同步账号: 需要添加 ${accountsToAdd.length} 个账号，需要删除 ${accountsToRemove.length} 个账号`);

        // 添加新账号到本地数据库
        const addedAccounts = [];
        for (const account of accountsToAdd) {
            try {
                // 根据Cloudflare路由规则的启用状态确定账号状态
                const status = account.enabled ? 'active' : 'inactive';

                const newAccount = await database.createAccount(
                    account.email,
                    account.username,
                    account.domain,
                    '通过同步添加',
                    null, // 密码将自动生成
                    status // 使用与Cloudflare路由规则一致的状态
                );

                // 添加路由状态信息到返回结果
                addedAccounts.push({
                    ...newAccount,
                    cloudflareEnabled: account.enabled
                });

                logger.info(`同步添加账号成功: ${account.email}, 状态: ${status}`);
            } catch (error) {
                logger.error(`同步添加账号失败: ${account.email}`, error);
            }
        }

        // 从本地数据库删除不存在的账号
        const removedAccounts = [];
        for (const account of accountsToRemove) {
            try {
                await database.deleteAccount(account.id);
                removedAccounts.push(account);
                logger.info(`同步删除账号成功: ${account.email}`);
            } catch (error) {
                logger.error(`同步删除账号失败: ${account.email}`, error);
            }
        }

        // 检查并更新没有密码的账号
        const StringHelper = require('../utils/string-helper');
        const allAccounts = await database.getAllAccounts();
        const updatedPasswordAccounts = [];
        const updatedStatusAccounts = [];

        for (const account of allAccounts) {
            // 检查是否需要更新密码
            if (!account.password) {
                // 生成随机密码
                const password = StringHelper.generateRandomPassword();

                // 更新账号密码
                await database.updateAccount(account.id, { password });

                updatedPasswordAccounts.push({
                    id: account.id,
                    email: account.email,
                    updateType: 'password'
                });

                logger.info(`为账号生成密码: ${account.email}`);
            }

            // 检查是否需要更新状态
            const cloudflareAccount = cloudflareAccounts.find(ca => ca.email === account.email);
            if (cloudflareAccount) {
                // 根据Cloudflare路由规则的启用状态确定本地账号状态
                const cloudflareStatus = cloudflareAccount.enabled ? 'active' : 'inactive';

                // 如果状态不一致，则更新本地账号状态
                if (account.status !== cloudflareStatus) {
                    logger.info(`账号状态需要更新: ${account.email}, 当前状态: ${account.status}, Cloudflare状态: ${cloudflareStatus}`);

                    // 更新账号状态
                    await database.updateAccount(account.id, { status: cloudflareStatus });

                    updatedStatusAccounts.push({
                        id: account.id,
                        email: account.email,
                        oldStatus: account.status,
                        newStatus: cloudflareStatus,
                        updateType: 'status'
                    });

                    logger.info(`账号状态已更新: ${account.email}, 新状态: ${cloudflareStatus}`);
                }
            }
        }

        // 合并所有更新的账号
        const updatedAccounts = [...updatedPasswordAccounts, ...updatedStatusAccounts];

        // 添加活动记录
        await database.addActivity(
            'account_sync',
            'cloud-arrow-down',
            `同步账号完成，新增${addedAccounts.length}个，删除${removedAccounts.length}个，更新${updatedAccounts.length}个`,
            null,
            {
                added: addedAccounts.length,
                removed: removedAccounts.length,
                updatedPassword: updatedPasswordAccounts.length,
                updatedStatus: updatedStatusAccounts.length
            }
        );

        // 返回同步结果
        res.json({
            success: true,
            added: addedAccounts,
            removed: removedAccounts,
            updated: updatedAccounts,
            updatedPassword: updatedPasswordAccounts.length,
            updatedStatus: updatedStatusAccounts.length,
            message: `同步完成！新增 ${addedAccounts.length} 个账号，删除 ${removedAccounts.length} 个账号，更新 ${updatedPasswordAccounts.length} 个账号密码，更新 ${updatedStatusAccounts.length} 个账号状态。`
        });

    } catch (error) {
        logger.error('同步账号失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '同步账号失败'
        });
    }
});

module.exports = router;
