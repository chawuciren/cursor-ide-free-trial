const express = require('express');
const router = express.Router();

// 中间件：检查是否已登录
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return next();
    }
    res.redirect('/login');
};

// 管理员设置页面
router.get('/', isAuthenticated, (req, res) => {
    // 模拟配置数据
    const settings = {
        email: {
            type: 'imap',
            user: 'example@gmail.com',
            smtp: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                enabled: true
            },
            imap: {
                host: 'imap.gmail.com',
                port: 993,
                secure: true,
                enabled: true
            }
        },
        cloudflare: [
            {
                emailForward: 'example@gmail.com',
                domain: '@example.com',
                apiToken: '******',
                zoneId: '******'
            },
            {
                emailForward: 'example@gmail.com',
                domain: '@domain.com',
                apiToken: '******',
                zoneId: '******'
            }
        ],
        server: {
            port: 3000,
            host: '0.0.0.0'
        },
        logging: {
            level: 'info',
            path: 'logs',
            maxSize: '10m',
            maxFiles: 5
        }
    };
    
    res.render('admin/index', {
        title: '系统设置',
        settings
    });
});

// 更新系统设置
router.post('/settings', isAuthenticated, (req, res) => {
    // 这里应该添加更新系统设置的逻辑
    // ...
    
    // 重定向回设置页面
    res.redirect('/admin');
});

// 添加Cloudflare域名
router.post('/cloudflare/add', isAuthenticated, (req, res) => {
    // 这里应该添加添加Cloudflare域名的逻辑
    // ...
    
    // 重定向回设置页面
    res.redirect('/admin');
});

// 删除Cloudflare域名
router.post('/cloudflare/delete/:index', isAuthenticated, (req, res) => {
    const index = req.params.index;
    
    // 这里应该添加删除Cloudflare域名的逻辑
    // ...
    
    // 返回JSON响应
    res.json({ success: true });
});

module.exports = router;
