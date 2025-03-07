const logger = require('../utils/logger');
const delay = require('../utils/delay');
const HumanBehavior = require('../utils/human-behavior');

class Copilot {
    constructor() {
        this.url = 'https://github.com/signup';
        this.humanBehavior = new HumanBehavior();
    }

    validateUserInfo(userInfo) {
        if (!userInfo || !userInfo.email || !userInfo.password || !userInfo.firstname || !userInfo.lastname) {
            throw new Error('用户信息不完整');
        }
    }

    
    /**
     * 获取脚本文件的完整路径
     * @param {string} scriptName - 脚本文件名
     * @returns {string} 脚本的完整路径
     */
    getScriptPath(scriptName) {
        return path.join(this.resourcePath, 'scripts', scriptName);
    }

    // 手动注册方法
    async manualRegister(browser, initPage, userInfo) {
        let page;
        try {
            // 验证用户信息
            this.validateUserInfo(userInfo);
            logger.info('开始 Copilot 手动注册流程...');
            
            // 创建新的页面
            page = await browser.newPage();
            logger.info('创建新页面');
            
            // 打开 GitHub 注册页面
            await page.goto(this.url);
            logger.info('已打开 GitHub 注册页面');

            return { browser, page };
        } catch (error) {
            // 如果出错，关闭页面并抛出错误
            if (page) {
                await page.close();
                logger.info('出错关闭页面');
            }
            logger.error('Copilot 手动注册流程出错:', error);
            throw error;
        }
    }

    async register(browser, initPage, userInfo) {
        let page;
        try {
            // 验证用户信息
            this.validateUserInfo(userInfo);
            logger.info('开始 Copilot 注册流程...');
            
            // 创建新的页面
            page = await browser.newPage();
            logger.info('创建新页面');
            
            // 打开 GitHub 注册页面
            await page.goto(this.url);
            logger.info('已打开 GitHub 注册页面');
            
            // 模拟初始浏览行为
            await this.humanBehavior.simulateHumanBehavior(page);

            // 填写邮箱
            const emailSelector = '#email';
            await page.waitForSelector(emailSelector);
            await this.humanBehavior.simulateHumanTyping(page, emailSelector, userInfo.email.toString().trim());
            logger.info('已填写邮箱');

            // 模拟思考行为
            await this.humanBehavior.simulateHumanBehavior(page, { duration: 2000, movements: 2 });

            // 等待密码输入框出现
            const passwordSelector = '#password';
            await page.waitForSelector(passwordSelector);
            await this.humanBehavior.simulateHumanTyping(page, passwordSelector, userInfo.password.toString().trim());
            logger.info('已填写密码');

            // 模拟思考行为
            await this.humanBehavior.simulateHumanBehavior(page, { duration: 1500, movements: 3 });

            // 填写用户名
            const usernameSelector = '#login';
            await page.waitForSelector(usernameSelector);
            await this.humanBehavior.simulateHumanTyping(page, usernameSelector, userInfo.username.toString().trim());
            logger.info('已填写用户名');

            // 模拟思考和浏览行为
            await this.humanBehavior.simulateHumanBehavior(page, { duration: 2000, movements: 4 });

            // 点击继续按钮
            const selector = 'button[aria-describedby="terms-of-service"]';
            await this.humanBehavior.simulateHoverAndClick(page, selector, {
                maxRetries: 3  // 可选：设置最大重试次数
            });

            logger.info('已模拟点击继续按钮');

            await delay(5000);
            logger.info('页面跳转完毕');

            await this.humanBehavior.simulateHumanBehavior(page, { duration: 2000, movements: 2 });
{/* <button class="sc-nkuzb1-0 sc-d5trka-0 eZxMRy button" data-theme="home.verifyButton">视觉谜题</button> */}

            const visualPuzzleSelector = 'button[data-theme="home.verifyButton"]';
            // await page.waitForSelector(visualPuzzleSelector);
            await this.humanBehavior.simulateHoverAndClick(page, visualPuzzleSelector, {
                maxRetries: 3  // 可选：设置最大重试次数
            });
            logger.info('已模拟视觉谜题按钮');

            // await delay(5000);
            // await this.humanBehavior.simulateHumanBehavior(page, { duration: 1000, movements: 2 });
            const captchaSelector = '#captcha-container-nux';
   
            const captcha = await this.humanBehavior.findElementAcrossDocuments(page, captchaSelector, { 
                visible: true,
                timeout: 30000 
            });
            if (captcha) {
                logger.info('找到验证码元素-需要人工干预');
                // 增加提示信息
                logger.info('请完成人工验证，程序将等待验证完成...');
                
                const startTime = Date.now();
                const maxTimeout = 300000; // 5分钟超时
                let checkInterval = null;
                
                try {
                    // 使用 Promise 和定时器替代可能卡住的循环
                    await new Promise((resolve, reject) => {
                        // 创建超时计时器
                        const timeoutTimer = setTimeout(() => {
                            if (checkInterval) clearInterval(checkInterval);
                            reject(new Error('验证码等待超时，请在5分钟内完成验证'));
                        }, maxTimeout);
                        
                        // 使用间隔计时器定期检查
                        checkInterval = setInterval(async () => {
                            try {
                                logger.info('检查验证码状态...');
                                // 使用更短的超时时间
                                const result = await this.humanBehavior.findElementAcrossDocuments(page, captchaSelector, { 
                                    visible: true,
                                    timeout: 5000
                                }).catch(e => {
                                    logger.info(`检查验证码时出错: ${e.message}`);
                                    return null;
                                });
                                
                                // 如果验证码消失
                                if (!result) {
                                    clearTimeout(timeoutTimer);
                                    clearInterval(checkInterval);
                                    logger.info('验证码元素已消失，验证完成');
                                    resolve();
                                }
                            } catch (error) {
                                logger.info(`检查过程出错: ${error.message}`);
                                // 错误不中断检查，继续下一次
                            }
                        }, 3000); // 每3秒检查一次
                    });
                    
                } catch (error) {
                    logger.info(`验证码等待出错: ${error.message}`);
                    throw error;
                }
            }
            
            logger.info('验证码验证完成，继续执行后续流程');
            // 模拟最终确认的思考行为
          
            await this.humanBehavior.simulateHumanBehavior(page, { duration: 1000, movements: 2 });

            // 判断是否出现视觉谜题的按钮，如果有则点击

            //  判断是否要视觉图形验证码 ，如果出现了则要人工验证点击图形验证码 等待通过了再继续下一个获取验证码的流程 



            // 等待验证码页面加载
            await delay(5000);
            logger.info('等待验证码页面加载');

            return { browser, page };
        } catch (error) {
            if (page) {
                await page.close();
                logger.info('出错关闭页面');
            }
            logger.error('Copilot 注册流程出错:', error);
            throw error;
        }
    }

    async login(browser, initPage, account) {

    }

    async fillVerificationCode(page, code) {
        try {
            if (!code) {
                throw new Error('验证码不能为空');
            }

            logger.info('开始填写验证码...');
            
            // 等待验证码输入框出现
            const codeInputSelector = '#code';
            await page.waitForSelector(codeInputSelector);
            await page.type(codeInputSelector, code.toString().trim());
            logger.info('已填写验证码');

            // 点击验证按钮
            const verifyButtonSelector = 'button[type="submit"]';
            await page.waitForSelector(verifyButtonSelector);
            await page.click(verifyButtonSelector);
            logger.info('已点击验证按钮');

            return page;
        } catch (error) {
            logger.error('验证码填写出错:', error);
            throw error;
        }
    }

    extractVerificationCode(emailContent) {
        try {
            // 查找验证码的几种模式:
            // 1. 在 "code below" 之后的 6 位数字
            // 2. 在邮件正文中单独出现的 6 位数字
            // 3. 在 "code is" 之后的 6 位数字
            const patterns = [
                /code below[^0-9]*(\d{6})/i,
                /\b(\d{6})\b(?=(?:[^"]*"[^"]*")*[^"]*$)/,
                /code is[^0-9]*(\d{6})/i
            ];

            for (const pattern of patterns) {
                const matches = emailContent.match(pattern);
                if (matches && matches[1]) {
                    return matches[1];
                }
            }

            // 如果上述模式都没匹配到，抛出错误
            throw new Error('无法从邮件中提取验证码');
        } catch (error) {
            logger.error('提取验证码失败:', error);
            throw error;
        }
    }

    // 获取验证邮件发送者地址
    getVerificationEmailSender() {
        return 'no-reply@cursor.sh';
    }

    async getSessionToken(page, maxAttempts = 3, retryInterval = 2000) {
        logger.info('开始获取 Cursor session token...');
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                // 获取所有 cookies
                const client = await page.target().createCDPSession();
                const { cookies } = await client.send('Network.getAllCookies');
                
                // 查找 WorkosCursorSessionToken
                const sessionCookie = cookies.find(cookie => cookie.name === 'WorkosCursorSessionToken');
                
                if (sessionCookie) {
                    const tokenValue = decodeURIComponent(sessionCookie.value).split('::')[1];
                    logger.info('成功获取 Cursor session token');
                    await client.detach();
                    return tokenValue;
                }

                await client.detach();
                attempts++;
                if (attempts < maxAttempts) {
                    logger.warn(`第 ${attempts} 次尝试未获取到 CursorSessionToken，${retryInterval/1000}秒后重试...`);
                    await delay(retryInterval);
                } else {
                    logger.error(`已达到最大尝试次数(${maxAttempts})，获取 CursorSessionToken 失败`);
                }
            } catch (error) {
                logger.error('获取 cookie 失败:', error);
                attempts++;
                if (attempts < maxAttempts) {
                    logger.info(`将在 ${retryInterval/1000} 秒后重试...`);
                    await delay(retryInterval);
                }
            }
        }

        return null;
    }

    async getDbPath() {
        const os = require('os');
        const path = require('path');
        const platform = os.platform();

        let dbPath;
        if (platform === 'win32') {
            const appdata = process.env.APPDATA;
            if (!appdata) {
                throw new Error('APPDATA 环境变量未设置');
            }
            dbPath = path.join(appdata, 'Cursor', 'User', 'globalStorage', 'state.vscdb');
        } else if (platform === 'darwin') {
            dbPath = path.resolve(os.homedir(), 'Library/Application Support/Cursor/User/globalStorage/state.vscdb');
        } else if (platform === 'linux') {
            dbPath = path.resolve(os.homedir(), '.config/Cursor/User/globalStorage/state.vscdb');
        } else {
            throw new Error(`不支持的操作系统: ${platform}`);
        }

        return dbPath;
    }

    async updateAuth(email = null, accessToken = null, refreshToken = null) {
        logger.info('开始更新 Cursor 认证信息...');

        const updates = [
            ['cursorAuth/cachedSignUpType', 'Auth_0']
        ];

        if (email !== null) {
            updates.push(['cursorAuth/cachedEmail', email]);
        }
        if (accessToken !== null) {
            updates.push(['cursorAuth/accessToken', accessToken]);
        }
        if (refreshToken !== null) {
            updates.push(['cursorAuth/refreshToken', refreshToken]);
        }

        if (updates.length === 1) {
            logger.warn('没有提供任何要更新的值');
            return false;
        }

        try {
            const dbPath = await this.getDbPath();
            
            return new Promise((resolve, reject) => {
                // 打开数据库连接
                const db = new sqlite3.Database(dbPath, async (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    try {
                        for (const [key, value] of updates) {
                            // 检查键是否存在
                            await new Promise((res, rej) => {
                                db.get('SELECT COUNT(*) as count FROM itemTable WHERE key = ?', [key], async (err, row) => {
                                    if (err) {
                                        rej(err);
                                        return;
                                    }

                                    try {
                                        if (row.count === 0) {
                                            // 插入新记录
                                            await new Promise((resolve, reject) => {
                                                db.run('INSERT INTO itemTable (key, value) VALUES (?, ?)', [key, value], (err) => {
                                                    if (err) reject(err);
                                                    else {
                                                        logger.info(`插入新记录: ${key.split('/').pop()}`);
                                                        resolve();
                                                    }
                                                });
                                            });
                                        } else {
                                            // 更新现有记录
                                            await new Promise((resolve, reject) => {
                                                db.run('UPDATE itemTable SET value = ? WHERE key = ?', [value, key], function(err) {
                                                    if (err) reject(err);
                                                    else {
                                                        if (this.changes > 0) {
                                                            logger.info(`成功更新: ${key.split('/').pop()}`);
                                                        } else {
                                                            logger.warn(`未找到 ${key.split('/').pop()} 或值未变化`);
                                                        }
                                                        resolve();
                                                    }
                                                });
                                            });
                                        }
                                        res();
                                    } catch (error) {
                                        rej(error);
                                    }
                                });
                            });
                        }

                        db.close((err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            logger.info('认证信息更新完成');
                            resolve(true);
                        });
                    } catch (error) {
                        db.close(() => reject(error));
                    }
                });
            });

        } catch (error) {
            logger.error('更新认证信息失败:', error);
            return false;
        }
    }

    /**
     * 重置机器码
     * 根据不同平台执行不同的重置逻辑
     * @returns {Promise<boolean>} 重置成功返回 true，失败返回 false
     */
    async resetMachineCodes() {
        try {
            const platform = os.platform();
            
            // 根据平台执行不同的重置逻辑
            switch (platform) {
                case 'win32': {
                    logger.info('正在重置机器码...');
                    
                    // 使用 consoleHelper 执行 PowerShell 脚本
                    return await consoleHelper.executePowerShellScript(this.getScriptPath('cursor.ps1'), {
                        noProfile: true,
                        nonInteractive: true
                    });
                }
                
                case 'darwin': {
                    // TODO: 实现 macOS 的重置逻辑
                    logger.warn('macOS 平台的重置机器码功能尚未实现');
                    return false;
                }
                
                case 'linux': {
                    // TODO: 实现 Linux 的重置逻辑
                    logger.warn('Linux 平台的重置机器码功能尚未实现');
                    return false;
                }
                
                default: {
                    logger.error(`不支持的操作系统平台: ${platform}`);
                    return false;
                }
            }
            
        } catch (error) {
            logger.error('重置机器码失败:', error);
            return false;
        }
    }

    /**
     * 禁用自动更新功能
     * 根据不同平台执行不同的禁用逻辑
     * @returns {Promise<boolean>} 禁用成功返回 true，失败返回 false
     */
    async disableAutoUpdate() {
        try {
            const platform = os.platform();
            
            // 根据平台执行不同的禁用逻辑
            switch (platform) {
                case 'win32': {
                    logger.info('正在禁用自动更新...');
                    
                    // 使用 consoleHelper 执行 PowerShell 脚本
                    return await consoleHelper.executePowerShellScript(this.getScriptPath('copilot-update.ps1'), {
                        noProfile: true,
                        nonInteractive: true
                    });
                }
                
                case 'darwin': {
                    // TODO: 实现 macOS 的禁用逻辑
                    logger.warn('macOS 平台的自动更新禁用功能尚未实现');
                    return false;
                }
                
                case 'linux': {
                    // TODO: 实现 Linux 的禁用逻辑
                    logger.warn('Linux 平台的自动更新禁用功能尚未实现');
                    return false;
                }
                
                default: {
                    logger.error(`不支持的操作系统平台: ${platform}`);
                    return false;
                }
            }
            
        } catch (error) {
            logger.error('禁用自动更新失败:', error);
            return false;
        }
    }
    
}

module.exports = Copilot; 