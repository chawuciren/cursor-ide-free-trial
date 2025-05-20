const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// 默认配置
const defaultConfig = {
    server: {
        port: 3001,
        host: '0.0.0.0'
    },
    proxy: {
        enabled: true,
        host: '127.0.0.1',
        port: 10808,
        protocol: 'socks5' // 可选: http, https, socks5
    },
    cloudflare: [
        {
            emailForward: 'supermailinspector@gmail.com',
            domain: '@nodemail.online',
            apiToken: 'iqsMyZOI1aX4UdiNSkxEmPOlxOjcSoa5JxqEDFDS',
            zoneId: '3bf22b84a17d89ba1713607f462b5627'
        },
        {
            emailForward: 'supermailinspector@gmail.com',
            domain: '@goaiwork.online',
            apiToken: 'iqsMyZOI1aX4UdiNSkxEmPOlxOjcSoa5JxqEDFDS',
            zoneId: '7a0050c33e4fbc89cca2c52e09fdd9bf'
        }
    ],
    email: {
        type: 'imap', // 可选: 'tempmail', 'imap'
        user: 'supermailinspector@gmail.com',
        pass: 'gwlvkblmhmcznial',
        fetchInterval: 10, // 定时拉取邮件的间隔（分钟）
        smtp: {
            enabled: false, // 默认不连接
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        },
        imap: {
            enabled: true, // 默认连接
            host: 'imap.gmail.com',
            port: 993,
            secure: true
        }
    },
    logging: {
        level: 'info',  // 可选: error, warn, info, debug
        path: 'logs',   // 日志文件存储路径
        maxSize: '10m', // 单个日志文件大小上限
        maxFiles: 5     // 保留的日志文件数量
    },
    registration: {
        type: 'cursor', // 可选: 'cursor', 'copilot'
        manual: false,  // 是否启用手动注册模式
    },
    database: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'account_system'
    },
    admin: {
        username: 'admin',
        password: 'admin'
    }
};

let config = { ...defaultConfig };

function loadConfig() {
    const configPath = path.join(__dirname, '../config.yaml');
    try {
        if (fs.existsSync(configPath)) {
            const fileContents = fs.readFileSync(configPath, 'utf8');
            const yamlConfig = yaml.load(fileContents);
            config = { ...defaultConfig, ...yamlConfig };
        } else {
            // 创建默认配置文件
            fs.writeFileSync(configPath, yaml.dump(defaultConfig), 'utf8');
        }
    } catch (error) {
        throw error;
    }
}

function getConfig() {
    return config;
}

function updateConfig(newConfig) {
    const configPath = path.join(__dirname, '../config.yaml');
    try {
        const updatedConfig = { ...config, ...newConfig };
        fs.writeFileSync(configPath, yaml.dump(updatedConfig), 'utf8');
        config = updatedConfig;
        return true;
    } catch (error) {
        throw error;
    }
}

// 初始化时加载配置
loadConfig();

module.exports = {
    getConfig,
    updateConfig
};