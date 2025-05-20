const logger = require('./logger');

class StringHelper {
    /**
     * 将JSON对象转换为格式化的字符串，每个键值对占一行
     * @param {Object} json - 要转换的JSON对象
     * @returns {string} - 格式化后的字符串
     */
    static formatJsonToLines(json) {
        try {
            return Object.entries(json)
                .map(([key, value]) => {
                    // 如果值是数组，将其转换为字符串
                    if (Array.isArray(value)) {
                        value = JSON.stringify(value);
                    }
                    return `${key}: ${value}`;
                })
                .join('\n');
        } catch (error) {
            logger.error('格式化JSON出错:', error);
            return JSON.stringify(json); // 发生错误时返回普通的JSON字符串
        }
    }

    /**
     * 生成随机密码
     * @param {number} length - 密码长度
     * @returns {string} - 生成的随机密码
     */
    static generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
}

module.exports = StringHelper;