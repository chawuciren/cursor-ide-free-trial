/**
 * 创建一个延时Promise
 * @param {number} ms 延时的毫秒数
 * @returns {Promise<void>} 延时Promise
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = delay; 