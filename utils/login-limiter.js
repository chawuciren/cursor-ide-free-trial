/**
 * 登录限制工具
 * 用于防止暴力破解攻击，限制登录失败次数
 */
const logger = require('./logger');
const { getConfig } = require('./config');

// 存储登录失败记录的Map
// 键: 用户名或IP地址
// 值: { failCount: 失败次数, lockUntil: 锁定截止时间 }
const loginAttempts = new Map();

// 默认配置
const DEFAULT_MAX_ATTEMPTS = 5;        // 默认最大尝试次数
const DEFAULT_LOCK_TIME = 10 * 60000;  // 默认锁定时间（10分钟，单位：毫秒）

/**
 * 获取登录限制配置
 * @returns {Object} 登录限制配置
 */
function getLoginLimiterConfig() {
    const config = getConfig();
    return {
        maxAttempts: config.loginLimiter?.maxAttempts || DEFAULT_MAX_ATTEMPTS,
        lockTime: config.loginLimiter?.lockTime || DEFAULT_LOCK_TIME
    };
}

/**
 * 检查用户是否被锁定
 * @param {string} identifier - 用户标识符（用户名或IP地址）
 * @returns {Object} 检查结果 { locked: 是否锁定, remainingTime: 剩余锁定时间（毫秒） }
 */
function isLocked(identifier) {
    const record = loginAttempts.get(identifier);
    
    // 如果没有记录，则未锁定
    if (!record) {
        return { locked: false, remainingTime: 0 };
    }
    
    // 如果有锁定时间且当前时间小于锁定截止时间，则处于锁定状态
    if (record.lockUntil && record.lockUntil > Date.now()) {
        const remainingTime = record.lockUntil - Date.now();
        return { locked: true, remainingTime };
    }
    
    // 如果锁定已过期，清除记录
    if (record.lockUntil && record.lockUntil <= Date.now()) {
        loginAttempts.delete(identifier);
    }
    
    return { locked: false, remainingTime: 0 };
}

/**
 * 记录登录失败
 * @param {string} identifier - 用户标识符（用户名或IP地址）
 * @returns {Object} 更新后的状态 { locked: 是否锁定, remainingAttempts: 剩余尝试次数, lockTime: 锁定时间（毫秒） }
 */
function recordFailedAttempt(identifier) {
    const { maxAttempts, lockTime } = getLoginLimiterConfig();
    
    // 检查是否已锁定
    const lockStatus = isLocked(identifier);
    if (lockStatus.locked) {
        return {
            locked: true,
            remainingAttempts: 0,
            lockTime: lockStatus.remainingTime
        };
    }
    
    // 获取或创建记录
    let record = loginAttempts.get(identifier);
    if (!record) {
        record = { failCount: 0 };
    }
    
    // 增加失败计数
    record.failCount += 1;
    
    // 检查是否达到最大尝试次数
    if (record.failCount >= maxAttempts) {
        record.lockUntil = Date.now() + lockTime;
        loginAttempts.set(identifier, record);
        
        logger.warn(`用户 ${identifier} 登录失败次数过多，已锁定 ${lockTime/60000} 分钟`);
        
        return {
            locked: true,
            remainingAttempts: 0,
            lockTime
        };
    }
    
    // 更新记录
    loginAttempts.set(identifier, record);
    
    return {
        locked: false,
        remainingAttempts: maxAttempts - record.failCount,
        lockTime: 0
    };
}

/**
 * 重置登录失败记录
 * @param {string} identifier - 用户标识符（用户名或IP地址）
 */
function resetAttempts(identifier) {
    loginAttempts.delete(identifier);
}

/**
 * 清理过期的锁定记录（可以定期调用此函数）
 */
function cleanupExpiredLocks() {
    const now = Date.now();
    for (const [identifier, record] of loginAttempts.entries()) {
        if (record.lockUntil && record.lockUntil <= now) {
            loginAttempts.delete(identifier);
        }
    }
}

// 每小时清理一次过期的锁定记录
setInterval(cleanupExpiredLocks, 60 * 60 * 1000);

module.exports = {
    isLocked,
    recordFailedAttempt,
    resetAttempts
};
