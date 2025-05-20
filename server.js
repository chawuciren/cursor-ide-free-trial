const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const database = require('./utils/database');
const mailService = require('./utils/mail-service');
const apiRoutes = require('./api/routes');
const webRoutes = require('./routes/routes')
const { getConfig } = require('./utils/config');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();
// 从配置文件获取端口和主机地址
const config = getConfig();
const port = process.env.PORT || config.server.port || 3001; // 使用3002端口
const host = config.server.host || '0.0.0.0';

// 中间件设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置会话
app.use(session({
    secret: 'cloudmail-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1天
}));

// 配置EJS模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// 配置静态文件服务，添加日志
app.use(express.static(path.join(__dirname, 'public'), {
    fallthrough: true, // 如果文件不存在，继续下一个中间件
    redirect: false // 不自动添加尾部斜杠
}));

// 添加静态文件访问日志
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        logger.info(`Request: ${req.method} ${req.path}`);
    }
    next();
});

// 将会话信息传递给所有模板
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// 配置API路由
console.log('正在配置API路由...');
apiRoutes(app);
webRoutes(app);

// 错误处理中间件
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 创建 HTTP 服务器
const server = require('http').createServer(app);

// 初始化数据库和邮件服务，然后启动服务器
async function startServer() {
    try {
        // 初始化SQLite数据库
        await database.initialize();

        // 初始化邮件服务
        await mailService.initialize();

        // 启动定时拉取邮件任务
        const fetchResult = mailService.startScheduledFetching();
        logger.info(fetchResult.message);

        server.listen(port, host, () => {
            logger.info(`Server is running on http://${host}:${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// 处理进程退出时关闭数据库和邮件连接
process.on('SIGINT', async () => {
    try {
        // 停止定时拉取邮件任务
        mailService.stopScheduledFetching();

        // 关闭数据库连接
        await database.close();

        // 关闭邮件服务
        await mailService.close();

        logger.info('Connections closed.');
        process.exit(0);
    } catch (error) {
        logger.error('Error closing connections:', error);
        process.exit(1);
    }
});

startServer();