const { connect } = require('puppeteer-real-browser');
const logger = require('./logger');
const path = require('path');
const delay = require('./delay');
const HumanBehavior = require('./human-behavior');

// 浏览器扩展配置
const EXTENSIONS = {
    FINGERPRINT_DEFENDER: {
        id: 'pmcpffnpjncfplinfnjebjoonbncnjfl',
        version: '6.19.12_0',
        name: 'Fingerprint Defender'
    }
    // 如果将来需要添加更多扩展，可以在这里添加
};

// 获取扩展目录路径
function getExtensionsDir() {
    return process.env.NODE_ENV === 'development'
        ? path.join(process.env.APP_ROOT, 'extensions')  // 开发环境：项目根目录下的 extensions
        : path.join(process.env.RES_PATH, 'extensions'); // 生产环境：resources目录下的 extensions
}

// 浏览器初始化配置
const BROWSER_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000, // 5 seconds
    MIN_TRUST_SCORE: 50,
    MAX_HEADLESS_PERCENTAGE: 30
};

class BrowserInitializer {
    constructor(config) {
        this.config = config;
        this.retryCount = 0;
        this.humanBehavior = new HumanBehavior();
    }

    async initBrowser() {
        while (this.retryCount < BROWSER_CONFIG.MAX_RETRIES) {
            try {
                logger.info(`尝试初始化浏览器 (第 ${this.retryCount + 1} 次尝试)...`);
                
                // 构建插件路径
                const extensionPath = path.join(
                    getExtensionsDir(),
                    EXTENSIONS.FINGERPRINT_DEFENDER.id,
                    EXTENSIONS.FINGERPRINT_DEFENDER.version
                );
                logger.info('加载插件');

                // 构建连接选项
                const connectOptions = {
                    headless: this.config.browser.headless,
                    args: [
                        "--no-sandbox",
                        "--disable-blink-features=AutomationControlled",
                        "--disable-audio-output",
                        "--enable-extensions",
                        `--disable-extensions-except=${extensionPath}`,
                        `--load-extension=${extensionPath}`
                    ],
                    customConfig: {},
                    turnstile: true,
                    connectOption: {
                        defaultViewport: { width: 1920, height: 1080 }
                    },
                    disableXvfb: false,
                    ignoreAllFlags: false
                };

                // 添加代理配置
                if (this.config.proxy.enabled && this.config.browser.proxy) {
                    let proxyUrl = `${this.config.proxy.protocol}://${this.config.proxy.host}:${this.config.proxy.port}`;
                    
                    if (this.config.proxy.username && this.config.proxy.password) {
                        proxyUrl = `${this.config.proxy.protocol}://${this.config.proxy.username}:${this.config.proxy.password}@${this.config.proxy.host}:${this.config.proxy.port}`;
                    }

                    connectOptions.args.push(`--proxy-server=${proxyUrl}`);
                    logger.info('代理服务器配置完成');
                }
                
                logger.info('正在启动浏览器...');

                const { browser, page } = await connect(connectOptions);

                // 注入指纹
                logger.info('开始注入浏览器指纹...');
                // await this.configureExtensions(browser);
                logger.info('浏览器指纹注入完成');
                
                // 根据配置决定是否进行指纹检查
                if (this.config.browser.checkFingerprint) {
                    logger.info('开始进行浏览器指纹检查...');
                    const fingerprintPage = await browser.newPage();
                    const fingerprintCheck = await this.checkFingerprint(fingerprintPage);
                    await delay(1000000);
                    await fingerprintPage.close();

                    // 如果指纹检查不通过，关闭浏览器并重试
                    if (!fingerprintCheck.success) {
                        logger.warn(`指纹检查未通过: ${fingerprintCheck.reason}`);
                        await browser.close();
                        this.retryCount++;
                        
                        if (this.retryCount < BROWSER_CONFIG.MAX_RETRIES) {
                            logger.info(`等待 ${BROWSER_CONFIG.RETRY_DELAY/1000} 秒后重试...`);
                            await delay(BROWSER_CONFIG.RETRY_DELAY);
                            continue;
                        } else {
                            throw new Error(`浏览器初始化失败: ${fingerprintCheck.reason}`);
                        }
                    }
                    logger.info('浏览器指纹检查通过');
                } else {
                    logger.info('已跳过浏览器指纹检查');
                }

                logger.info('浏览器启动完成');
                this.retryCount = 0; // 重置重试计数
                return { browser, page };

            } catch (error) {
                logger.error(`浏览器初始化错误 (第 ${this.retryCount + 1} 次尝试):`, error);
                
                this.retryCount++;
                if (this.retryCount < BROWSER_CONFIG.MAX_RETRIES) {
                    logger.info(`等待 ${BROWSER_CONFIG.RETRY_DELAY/1000} 秒后重试...`);
                    await delay(BROWSER_CONFIG.RETRY_DELAY);
                    continue;
                }
                throw new Error(`浏览器初始化失败，已重试 ${BROWSER_CONFIG.MAX_RETRIES} 次: ${error.message}`);
            }
        }
    }

    async initInternalBrowser() {
        try {            
            logger.info('配置内部浏览器启动选项...');
            
            // 构建连接选项
            const connectOptions = {
                headless: this.config.browser.headless,
                args: [
                    "--no-sandbox",
                ],
                connectOption: {},
                disableXvfb: false,
                ignoreAllFlags: false
            };
            
            logger.info('正在启动内部浏览器...');

            try {
                const { browser, page } = await connect(connectOptions);
                
                logger.info('内部浏览器启动完成');
                return { browser, page };
            } catch (launchError) {
                logger.error('启动浏览器失败:', launchError);
                throw launchError;
            }
        } catch (error) {
            logger.error('初始化过程出错:', error);
            throw error;
        }
    }

    async checkFingerprint(page) {
        const fingerprintTestSites = [
            {
                url: 'https://bot.sannysoft.com',
                evaluator: async () => {
                    // 等待页面加载完成，等待第一个表格
                    await page.waitForSelector('h1 + table tr', { timeout: 30000 });
                    
                    // 获取测试结果
                    const testData = await page.evaluate(() => {
                        // 清理文本内容的辅助函数
                        const cleanText = (text) => {
                            if (!text) return null;
                            return text.replace(/\s+/g, ' ').trim();
                        };

                        // 找到第一个 h1 标题后的表格
                        const h1 = Array.from(document.querySelectorAll('h1'))
                            .find(h1 => h1.textContent.includes('Intoli.com tests'));
                            
                        if (!h1) return null;
                        
                        // 获取该 h1 后的第一个表格
                        const table = h1.nextElementSibling;
                        if (!table || table.tagName.toLowerCase() !== 'table') return null;

                        const testResults = [];
                        const rows = table.querySelectorAll('tr');
                        
                        rows.forEach(row => {
                            const testName = cleanText(row.querySelector('td:first-child')?.textContent);
                            const result = cleanText(row.querySelector('td:last-child')?.textContent);
                            
                            if (testName && result) {
                                // 检查结果是否通过
                                const isPassed = row.querySelector('.passed') !== null || 
                                               result.includes('passed') ||
                                               !result.includes('failed');
                                               
                                testResults.push({
                                    name: testName,
                                    result: result,
                                    passed: isPassed
                                });
                            }
                        });

                        // 获取关键指标
                        const criticalTests = {
                            'WebDriver': testResults.find(r => r.name.includes('WebDriver'))?.passed,
                            'Chrome': testResults.find(r => r.name.includes('Chrome'))?.passed,
                            'UserAgent': testResults.find(r => r.name.includes('User Agent'))?.passed,
                            'WebGL': testResults.find(r => r.name.includes('WebGL Vendor'))?.passed
                        };

                        return {
                            allTests: testResults,
                            criticalTests,
                            summary: {
                                totalTests: testResults.length,
                                passedTests: testResults.filter(r => r.passed).length,
                                allCriticalPassed: Object.values(criticalTests).every(v => v === true)
                            }
                        };
                    });
                    
                    if (!testData) {
                        logger.warn('无法找到 Intoli.com tests 表格');
                        return { success: false, reason: '无法获取测试数据' };
                    }

                    // 检查总体状态
                    if (!testData.summary.allCriticalPassed) {
                        const failedTests = Object.entries(testData.criticalTests)
                            .filter(([, passed]) => !passed)
                            .map(([name]) => name)
                            .join(', ');
                            
                        return {
                            success: false,
                            reason: `关键测试未通过: ${failedTests}`
                        };
                    }

                    // 生成结果字符串
                    let resultText = '=== Intoli.com 浏览器检测结果 ===\n\n';
                    
                    // 添加总体状态
                    resultText += `总体状态: ${testData.summary.allCriticalPassed ? '通过' : '未通过'}\n`;
                    resultText += `通过率: ${testData.summary.passedTests}/${testData.summary.totalTests}\n\n`;
                    
                    // 添加关键测试结果
                    resultText += '关键测试项:\n';
                    Object.entries(testData.criticalTests).forEach(([test, passed]) => {
                        resultText += `${test}: ${passed ? '通过' : '未通过'}\n`;
                    });

                    // 添加详细测试结果
                    resultText += '详细测试结果:\n';
                    testData.allTests.forEach(({ name, result, passed }) => {
                        resultText += `${name}: ${result} ${passed ? '✓' : '✗'}\n`;
                    });

                    // 直接记录结果字符串
                    logger.info('\n' + resultText);
                    
                    return { success: true };
                }
            },
            {
                url: 'https://abrahamjuliot.github.io/creepjs',
                evaluator: async () => {
                    // 等待页面加载完成
                    await page.waitForSelector('.ellipsis-all', { timeout: 30000 });
                    
                    // 等待指纹计算完成（不再显示 Computing...）
                    await page.waitForFunction(() => {
                        const fpContainer = document.querySelector('.ellipsis-all');
                        if (!fpContainer) return false;
                        
                        const text = fpContainer.textContent || '';
                        return text && !text.includes('Computing') && text.trim() !== '';
                    }, { timeout: 30000, polling: 1000 });

                    // 获取完整的指纹ID和其他指标
                    const fpData = await page.evaluate(() => {
                        // 清理文本内容的辅助函数
                        const cleanText = (text) => {
                            if (!text) return null;
                            // 移除多余空白字符
                            text = text.replace(/\s+/g, ' ').trim();
                            // 移除CSS样式块
                            text = text.replace(/\{[^}]*\}/g, '');
                            // 移除特殊字符和空行
                            text = text.replace(/[×\n\r]/g, '');
                            // 移除多余的冒号
                            text = text.replace(/:\s*:/g, ':');
                            // 移除前后的冒号
                            text = text.replace(/^:+|:+$/g, '');
                            return text;
                        };

                        const fpContainer = document.querySelector('.ellipsis-all');
                        if (!fpContainer) return null;

                        const fpId = fpContainer.textContent.trim().replace('FP ID:', '').trim();
                            
                        // 获取其他重要指标
                        const getSection = (title) => {
                            const section = document.evaluate(
                                `//*[contains(text(), "${title}")]/following-sibling::*[1]`,
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;
                            return cleanText(section?.textContent);
                        };

                        // 获取 Trust Score
                        const getTrustScore = () => {
                            const trustScoreContainer = document.evaluate(
                                "//div[contains(text(), 'trust score:')]",
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;

                            if (!trustScoreContainer) return null;

                            const unblurredSpan = trustScoreContainer.querySelector('.unblurred');
                            if (!unblurredSpan) return null;

                            const percentage = unblurredSpan.childNodes[0].textContent.trim();
                            return percentage ? parseInt(percentage) : null;
                        };

                        // 获取 WebGL 信息
                        const getWebGLInfo = () => {
                            const vendor = getSection('gpu:');
                            if (!vendor) return null;
                            const parts = vendor.split('ANGLE');
                            return parts[0].trim();
                        };

                        // 获取 Headless 检测结果
                        const getHeadlessInfo = () => {
                            const headless = getSection('chromium:');
                            if (!headless) return null;
                            const match = headless.match(/(\d+)%\s*like\s*headless/);
                            return match ? parseInt(match[1]) : null;
                        };

                        return {
                            fpId,
                            trustScore: getTrustScore(),
                            headlessPercentage: getHeadlessInfo(),
                            stealth: getSection('stealth:'),
                            resistance: getSection('privacy:'),
                            userAgent: getSection('userAgent:'),
                            webGL: getWebGLInfo()
                        };
                    });

                    if (!fpData || !fpData.fpId) {
                        logger.warn('无法获取完整的指纹ID');
                        return null;
                    }

                    // 检查可信度和headless检测结果
                    const trustScore = fpData.trustScore;
                    const headlessPercentage = fpData.headlessPercentage;

                    if (trustScore !== null && trustScore < BROWSER_CONFIG.MIN_TRUST_SCORE) {
                        return {
                            success: false,
                            reason: `可信度过低: ${trustScore}% (最低要求: ${BROWSER_CONFIG.MIN_TRUST_SCORE}%)`
                        };
                    }

                    if (headlessPercentage !== null && headlessPercentage > BROWSER_CONFIG.MAX_HEADLESS_PERCENTAGE) {
                        return {
                            success: false,
                            reason: `Headless检测值过高: ${headlessPercentage}% (最大允许: ${BROWSER_CONFIG.MAX_HEADLESS_PERCENTAGE}%)`
                        };
                    }

                    // 生成结果字符串
                    let resultText = '=== CreepJS 浏览器指纹检测结果 ===\n\n';

                    // 添加指纹ID
                    resultText += '指纹信息:\n';
                    resultText += `Fingerprint ID: ${fpData.fpId}\n\n`;

                    // 添加检测结果
                    resultText += '检测结果:\n';
                    const results = [
                        { name: 'Trust Score', value: fpData.trustScore },
                        { name: 'Headless 检测', value: fpData.headlessPercentage },
                        { name: 'Stealth 评分', value: fpData.stealth },
                        { name: '隐私保护', value: fpData.resistance },
                        { name: 'User Agent', value: fpData.userAgent },
                        { name: 'WebGL 信息', value: fpData.webGL },
                    ];

                    results.forEach(({ name, value }) => {
                        resultText += `${name}: ${value || 'Unknown'}\n`;
                    });

                    // 直接记录结果字符串
                    logger.info('\n' + resultText);
                    
                    return { success: true };
                }
            }
        ];

        for (const site of fingerprintTestSites) {
            try {
                logger.info(`正在使用 ${site.url} 检查浏览器指纹...`);
                await page.goto(site.url, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                const result = await site.evaluator();
                if (!result.success) {
                    return result;
                }
            } catch (error) {
                logger.warn(`访问 ${site.url} 失败:`, error.message);
                continue;
            }
        }
        
        return { success: true };
    }

    /**
     * 配置浏览器插件
     * @param {Browser} browser Puppeteer浏览器实例
     */
    async configureExtensions(browser) {
        try {
            logger.info('开始配置插件...');

            // 打开插件配置页面
            const extensionPage = await browser.newPage();
            
            // 配置 Fingerprint Defender
            try {
                const extensionUrl = `chrome-extension://${EXTENSIONS.FINGERPRINT_DEFENDER.id}/index.html`;
                await extensionPage.goto(extensionUrl, { waitUntil: 'networkidle0', timeout: 30000 });

                // 定义扩展存储配置
                const extensionStorageConfig = {
                    'browser-__index__': ["aeb006a8-3325-c7a4-5c5d-e6faa32e1244"],
                    'browser-aeb006a8-3325-c7a4-5c5d-e6faa32e1244': {"customProtos":[{"name":"Screen","properties":[{"key":"colorDepth","type":"number","value":24},{"key":"pixelDepth","type":"number","value":24}]},{"name":"Navigator","properties":[{"key":"maxTouchPoints","type":"number","value":0}]}],"customVars":[],"factors":{"audio":4.751,"canvas":3.406,"clientRect":3.744,"fonts":0.644,"plugins":3.048,"voice":4.341,"webgl":2.13,"webgpu":2.046},"gpu":{"renderer":"ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)","vendor":"Google Inc. (Apple)"},"id":"aeb006a8-3325-c7a4-5c5d-e6faa32e1244","language":"dynamic","location":{"lat":"dynamic","lng":"dynamic"},"memoryCapacity":8,"name":"Random Browser:0","processors":1,"screen":{"height":1068,"noise":8,"width":1722},"timezone":"dynamic","uaInfo":{"cpu":{"architecture":"amd64"},"device":{},"engine":{"name":"Blink","version":"133.0.0.0"},"os":{"name":"Windows","version":"10"},"product":{"major":"133","name":"Chrome","version":"133.0.0.0"}},"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 11969","webrtc":"dynamic"},
                    'config-__index__': ["option","device","hostEnable","fixedBrowserId"],
                    'config-device': "desktop",
                    'config-hostEnable': '',
                    'config-fixedBrowserId': "aeb006a8-3325-c7a4-5c5d-e6faa32e1244",
                    'config-option': '静态',
                    'config-safeMode': true
                    // 在这里添加更多配置项
                };

                // 设置扩展存储
                // 遍历配置并设置存储
                for (const [key, value] of Object.entries(extensionStorageConfig)) {
                    await extensionPage.evaluate(
                        async ([storageKey, storageValue]) => {
                            return new Promise((resolve, reject) => {
                                try {
                                    chrome.storage.local.set(
                                        { [storageKey]: storageValue },
                                        () => {
                                            if (chrome.runtime.lastError) {
                                                reject(chrome.runtime.lastError);
                                            } else {
                                                resolve();
                                            }
                                        }
                                    );
                                } catch (error) {
                                    reject(error);
                                }
                            });
                        },
                        [key, value]
                    );
                }

                logger.info('扩展存储设置成功');

                // 等待操作完成
                await delay(2000);

                // 刷新页面以加载新的存储配置
                await extensionPage.reload({ waitUntil: 'networkidle0' });

                // 添加调试信息，获取页面上所有的class和data-v属性
                await extensionPage.evaluate(() => {
                    const allElements = document.querySelectorAll('*');
                    const classes = new Set();
                    const dataAttrs = new Set();
                    
                    allElements.forEach(el => {
                        el.classList.forEach(cls => classes.add(cls));
                        Object.keys(el.dataset).forEach(key => dataAttrs.add(`data-${key}`));
                    });
                    
                    console.log('Available classes:', Array.from(classes));
                    console.log('Available data attributes:', Array.from(dataAttrs));
                });

                // 等待页面内容加载
                await delay(3000);

                // 尝试使用更通用的选择器
                await extensionPage.waitForSelector('.cardWrap, .card-wrap, [class*="cardWrap"]', {
                    visible: true,
                    timeout: 10000
                });

                // 获取并记录找到的元素信息
                const cardInfo = await extensionPage.evaluate(() => {
                    const cards = document.querySelectorAll('.cardWrap, .card-wrap, [class*="cardWrap"]');
                    return Array.from(cards).map(card => ({
                        className: card.className,
                        attributes: Array.from(card.attributes).map(attr => `${attr.name}=${attr.value}`),
                        innerHTML: card.innerHTML.substring(0, 100) // 只获取前100个字符
                    }));
                });

                // 找到第一个卡片中的下拉按钮并模拟鼠标悬停
                const dropdownElement = await extensionPage.evaluate(() => {
                    const cards = document.querySelectorAll('.cardWrap, .card-wrap, [class*="cardWrap"]');
                    if (cards.length > 0) {
                        const dropdown = cards[0].querySelector('.el-dropdown, [class*="dropdown"]');
                        if (dropdown) {
                            // 获取元素的位置信息
                            const rect = dropdown.getBoundingClientRect();
                            return {
                                x: rect.x + rect.width / 2,
                                y: rect.y + rect.height / 2,
                                found: true
                            };
                        } else {
                            console.log('未找到下拉按钮');
                            return { found: false };
                        }
                    } else {
                        console.log('未找到卡片元素');
                        return { found: false };
                    }
                });

                if (dropdownElement.found) {                    
                    await extensionPage.mouse.move(dropdownElement.x, dropdownElement.y);
                    await delay(1000);

                    // 移动鼠标到菜单第一项的位置（向下50px）
                    const menuX = dropdownElement.x;
                    const menuY = dropdownElement.y + 50;

                    await extensionPage.mouse.move(menuX, menuY);
                    await delay(500);
                    await extensionPage.mouse.click(menuX, menuY);
                }

                await delay(1000);

                // 获取参考元素位置
                const referencePos = await extensionPage.evaluate(() => {
                    const buildElement = document.getElementById('build');
                    if (!buildElement) {
                        console.log('未找到build元素');
                        return null;
                    }
                    const rect = buildElement.getBoundingClientRect();

                    return {
                        x: rect.x,
                        y: rect.y
                    };
                });

                // 第一次点击保存按钮
                const saveButtonX = referencePos.x + 220;
                const saveButtonY = referencePos.y + 46;
                await extensionPage.mouse.move(saveButtonX, saveButtonY);
                await delay(500);
                await extensionPage.mouse.click(saveButtonX, saveButtonY);

                await delay(1000);

                // 点击随机按钮
                await extensionPage.mouse.move(saveButtonX, saveButtonY);
                await delay(1000);
                await extensionPage.mouse.click(saveButtonX, saveButtonY);

                await delay(1000);

                // 第二次点击保存按钮
                const save2ButtonX = referencePos.x + 350;
                const save2ButtonY = referencePos.y + 46;
                await extensionPage.mouse.move(save2ButtonX, save2ButtonY);
                await delay(500);
                await extensionPage.mouse.click(save2ButtonX, save2ButtonY);

                await delay(1000);

                await extensionPage.goBack();

                // 等待保存完成
                await delay(1000);

                logger.info('Fingerprint Defender 配置完成');
            } catch (error) {
                logger.warn('配置 Fingerprint Defender 时出错:', error.message);
                logger.warn('错误堆栈:', error.stack);
            } finally {
                // 确保无论如何都关闭配置页面
                try {
                    await extensionPage.close();
                } catch (closeError) {
                    logger.warn('关闭配置页面时出错:', closeError.message);
                }
            }
            
            logger.info('插件配置完成');
        } catch (error) {
            logger.error('配置插件时出错:', error);
            throw error;
        }
    }
}

module.exports = BrowserInitializer; 