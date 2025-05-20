class Logger {
    constructor() {
        this.level = 'info'; // 默认日志级别
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
    }

    setLevel(level) {
        if (this.levels.hasOwnProperty(level)) {
            this.level = level;
        }
    }

    shouldLog(level) {
        return this.levels[level] <= this.levels[this.level];
    }

    debug(message, ...args) {
        if (!this.shouldLog('debug')) return;
        console.log('\x1b[36m[调试]\x1b[0m', message, ...args);
    }

    info(message, ...args) {
        if (!this.shouldLog('info')) return;
        console.log('\x1b[32m[信息]\x1b[0m', message, ...args);
    }

    warn(message, ...args) {
        if (!this.shouldLog('warn')) return;
        console.log('\x1b[33m[警告]\x1b[0m', message, ...args);
    }

    error(message, ...args) {
        if (!this.shouldLog('error')) return;
        console.error('\x1b[31m[错误]\x1b[0m', message, ...args);
    }
}

// 创建单例实例
const logger = new Logger();

// 从配置文件加载日志级别
try {
    const { getConfig } = require('./config');
    const config = getConfig();
    if (config && config.logging && config.logging.level) {
        logger.setLevel(config.logging.level);
    }
} catch (error) {
    console.warn('Failed to load logging configuration:', error);
}

module.exports = logger;