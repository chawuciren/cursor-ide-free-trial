const express = require('express');
const indexRoutes = require('./index');
const accountsRoutes = require('./accounts');
const mailRoutes = require('./mail');

module.exports = (app) => {
    // 主路由
    app.use('/', indexRoutes);

    // 账号管理路由
    app.use('/accounts', accountsRoutes);

    // 邮件管理路由
    app.use('/mail', mailRoutes);

    // 404 处理（仅处理非API请求）
    app.use((req, res, next) => {
        // 如果是API请求，跳过这个中间件
        if (req.path.startsWith('/api')) {
            return next();
        }

        res.status(404).render('error', {
            title: '页面未找到',
            message: '您请求的页面不存在',
            error: {
                status: 404,
                stack: ''
            }
        });
    });

    // 错误处理（仅处理非API请求）
    app.use((err, req, res, next) => {
        // 如果是API请求，跳过这个中间件
        if (req.path.startsWith('/api')) {
            return next(err);
        }

        res.status(err.status || 500).render('error', {
            title: '服务器错误',
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    });
};
