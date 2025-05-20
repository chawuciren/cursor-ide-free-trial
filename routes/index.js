const express = require('express');
const router = express.Router();
const { getConfig } = require('../utils/config');
const loginLimiter = require('../utils/login-limiter');

// 首页路由
router.get('/', async (req, res) => {
    // 检查是否已登录
    if (!req.session || !req.session.authenticated) {
        return res.redirect('/login');
    }

    // 检查是否是普通用户（非管理员）
    if (req.session.isAdmin === false) {
        // 普通用户直接重定向到邮件页面
        return res.redirect('/mail');
    }

    try {
        // 获取真实数据
        const database = require('../utils/database');

        // 获取账号总数
        const accounts = await database.getAllAccounts();
        const accountsCount = accounts.length;

        // 获取未读邮件数量
        const unreadEmails = await database.getAllEmails({ status: 'unread' });
        const unreadCount = unreadEmails.length;

        // 获取域名数量
        const config = getConfig();
        const domainsCount = config.cloudflare ? config.cloudflare.length : 0;

        // 获取最近活动
        const recentActivities = await database.getRecentActivities(5);

        const data = {
            title: '仪表盘',
            username: req.session.username || 'Admin',
            accountsCount,
            unreadCount,
            domainsCount,
            recentActivities
        };

        // 添加页面特定的CSS和JS文件
        data.pageCss = 'dashboard';
        data.pageJs = 'dashboard';

        res.render('index', data);
    } catch (error) {
        console.error('获取仪表盘数据失败:', error);

        // 发生错误时使用默认数据
        const data = {
            title: '仪表盘',
            username: req.session.username || 'Admin',
            accountsCount: 0,
            unreadCount: 0,
            domainsCount: 0,
            recentActivities: [],
            error: '获取数据失败，请刷新页面重试'
        };

        // 添加页面特定的CSS和JS文件
        data.pageCss = 'dashboard';
        data.pageJs = 'dashboard';

        res.render('index', data);
    }
});

// 登录页面
router.get('/login', (req, res) => {
    // 如果已经登录，重定向到首页
    if (req.session && req.session.authenticated) {
        return res.redirect('/');
    }

    res.render('auth/login', {
        title: '登录',
        hideNavbar: true,
        hideFooter: true,
        pageCss: 'login',
        pageJs: 'login'
    });
});

// 处理登录请求
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const database = require('../utils/database');

    // 获取客户端IP地址
    const clientIp = req.ip || req.socket.remoteAddress;

    // 创建用户标识符（用户名+IP地址）
    const identifier = `${username}@${clientIp}`;

    try {
        // 检查用户是否被锁定
        const lockStatus = loginLimiter.isLocked(identifier);
        if (lockStatus.locked) {
            // 计算剩余锁定时间（分钟）
            const remainingMinutes = Math.ceil(lockStatus.remainingTime / 60000);

            // 记录锁定状态
            await database.addActivity(
                'login_blocked',
                'lock',
                `用户 ${username} 登录被阻止（账号已锁定）`,
                null,
                {
                    username,
                    ip: clientIp,
                    userAgent: req.headers['user-agent'],
                    remainingTime: lockStatus.remainingTime
                }
            );

            // 返回锁定信息
            return res.render('auth/login', {
                title: '登录',
                hideNavbar: true,
                hideFooter: true,
                pageCss: 'login',
                pageJs: 'login',
                error: `账号已锁定，请在 ${remainingMinutes} 分钟后重试`
            });
        }

        // 从配置文件中获取管理员凭据
        const config = getConfig();
        const adminCredentials = config.admin || { username: 'admin', password: 'admin' };

        // 首先检查是否是管理员登录
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // 登录成功，重置失败计数
            loginLimiter.resetAttempts(identifier);

            // 设置管理员会话
            req.session.authenticated = true;
            req.session.username = username;
            req.session.isAdmin = true;

            // 记录登录活动
            await database.addActivity(
                'user_login',
                'box-arrow-in-right',
                `管理员 ${username} 登录系统`,
                null,
                {
                    username,
                    isAdmin: true,
                    ip: clientIp,
                    userAgent: req.headers['user-agent']
                }
            );

            // 重定向到首页
            return res.redirect('/');
        }

        // 如果不是管理员，尝试通过邮箱账号登录
        // 尝试查找匹配的账号
        const account = await database.getAccountByEmail(username);

        // 如果找到账号并且密码匹配
        if (account && account.password === password) {
            // 登录成功，重置失败计数
            loginLimiter.resetAttempts(identifier);

            // 设置普通用户会话
            req.session.authenticated = true;
            req.session.username = account.username;
            req.session.userEmail = account.email;
            req.session.isAdmin = false;

            // 记录登录活动
            await database.addActivity(
                'user_login',
                'box-arrow-in-right',
                `邮箱账号 ${account.email} 登录系统`,
                account.id,
                {
                    username: account.username,
                    email: account.email,
                    isAdmin: false,
                    ip: clientIp,
                    userAgent: req.headers['user-agent']
                }
            );

            // 更新最后访问时间
            await database.updateAccountLastAccessed(account.id);

            // 重定向到邮件页面
            return res.redirect('/mail');
        }

        // 登录失败，记录失败尝试
        const attemptResult = loginLimiter.recordFailedAttempt(identifier);

        // 记录登录失败活动
        await database.addActivity(
            'login_failed',
            'exclamation-triangle',
            `用户 ${username} 登录失败（剩余尝试次数: ${attemptResult.remainingAttempts}）`,
            null,
            {
                username,
                ip: clientIp,
                userAgent: req.headers['user-agent'],
                remainingAttempts: attemptResult.remainingAttempts
            }
        );

        // 如果此次失败导致账号被锁定
        if (attemptResult.locked) {
            const lockMinutes = Math.ceil(attemptResult.lockTime / 60000);
            return res.render('auth/login', {
                title: '登录',
                hideNavbar: true,
                hideFooter: true,
                pageCss: 'login',
                pageJs: 'login',
                error: `登录失败次数过多，账号已锁定 ${lockMinutes} 分钟`
            });
        }

        // 普通登录失败
        res.render('auth/login', {
            title: '登录',
            hideNavbar: true,
            hideFooter: true,
            pageCss: 'login',
            pageJs: 'login',
            error: `用户名或密码不正确（剩余尝试次数: ${attemptResult.remainingAttempts}）`
        });
    } catch (error) {
        console.error('登录处理失败:', error);

        // 登录失败
        res.render('auth/login', {
            title: '登录',
            hideNavbar: true,
            hideFooter: true,
            pageCss: 'login',
            pageJs: 'login',
            error: '登录处理失败，请稍后重试'
        });
    }
});

// 清空活动记录
router.post('/clear-activities', async (req, res) => {
    // 检查是否已登录
    if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ success: false, message: '未授权' });
    }

    try {
        const database = require('../utils/database');
        const result = await database.clearAllActivities();

        if (result.success) {
            return res.json({
                success: true,
                message: `成功清空 ${result.count} 条活动记录`
            });
        } else {
            return res.status(500).json({
                success: false,
                message: '清空活动记录失败',
                error: result.error
            });
        }
    } catch (error) {
        console.error('清空活动记录失败:', error);
        return res.status(500).json({
            success: false,
            message: '清空活动记录失败',
            error: error.message
        });
    }
});

// 退出登录
router.get('/logout', async (req, res) => {
    // 记录登出活动
    try {
        if (req.session && req.session.authenticated) {
            const username = req.session.username || 'Admin';
            const database = require('../utils/database');
            await database.addActivity(
                'user_logout',
                'box-arrow-right',
                `用户 ${username} 退出系统`,
                null,
                {
                    username,
                    ip: req.ip || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent']
                }
            );
        }
    } catch (error) {
        console.error('记录登出活动失败:', error);
    }

    // 清除会话
    req.session.destroy();

    // 重定向到登录页面
    res.redirect('/login');
});

module.exports = router;
