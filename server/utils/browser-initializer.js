const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('./logger');
const path = require('path');
const delay = require('./delay');
const HumanBehavior = require('./human-behavior');
const FingerprintSimulator = require('./fingerprint-simulator');
const os = require('os');

// 初始化StealthPlugin
puppeteer.use(
    StealthPlugin({
        enabledEvasions: new Set([
            'chrome.app',
            'chrome.runtime',
            'iframe.contentWindow',
            'media.codecs',
            'navigator.hardwareConcurrency',
            'navigator.languages',
            'navigator.permissions',
            'navigator.plugins',
            'navigator.webdriver',
            'navigator.vendor',
            'webgl.vendor',
            'window.outerdimensions'
        ])
    })
);

// 浏览器扩展配置
const EXTENSIONS = {
    FINGERPRINT_DEFENDER: {
        id: 'pmcpffnpjncfplinfnjebjoonbncnjfl',
        version: '6.19.12_0',
        name: 'Fingerprint Defender'
    }
};

// 获取扩展目录路径
function getExtensionsDir() {
    return process.env.NODE_ENV === 'development'
        ? path.join(process.env.APP_ROOT, 'extensions')
        : path.join(process.env.RES_PATH, 'extensions');
}

// 获取Chrome可执行文件路径
function getChromePath() {
    const platform = os.platform();
    const rootDir = process.env.NODE_ENV === 'development'
        ? process.env.APP_ROOT
        : process.env.RES_PATH;

    switch (platform) {
        case 'win32':
            return path.join(rootDir, 'chrome_win32', 'chrome.exe');
        case 'darwin':
            return path.join(rootDir, 'chrome_mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
        case 'linux':
            return path.join(rootDir, 'chrome_linux', 'chrome');
        default:
            logger.warn(`未知平台 ${platform}，将使用系统默认Chrome`);
            return null;
    }
}

// 浏览器初始化配置
const BROWSER_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,
    MIN_TRUST_SCORE: 50,
    MAX_HEADLESS_PERCENTAGE: 30,
    FINGERPRINT_TEST_SITES: [
        {
            name: 'Intoli',
            url: 'https://bot.sannysoft.com'
        },
        {
            name: 'CreepJS',
            url: 'https://abrahamjuliot.github.io/creepjs'
        }
    ]
};

class BrowserInitializer {
    constructor(config) {
        this.config = config;
        this.retryCount = 0;
        this.humanBehavior = new HumanBehavior();
        this.fingerprintSimulator = new FingerprintSimulator();
    }

    /**
     * 初始化浏览器实例
     * @returns {Promise<{browser: Browser, page: Page}>}
     */
    async initBrowser() {
        while (this.retryCount < BROWSER_CONFIG.MAX_RETRIES) {
            try {
                logger.info(`尝试初始化浏览器 (第 ${this.retryCount + 1} 次尝试)...`);

                const launchOptions = await this._buildLaunchOptions();
                
                logger.info('正在启动浏览器...');
                const browser = await puppeteer.launch(launchOptions);
                const page = await browser.newPage();

                // 重置浏览器指纹
                await this.fingerprintSimulator.resetFingerprint(page);
                
                // 配置扩展
                // await this.configureExtensions(browser);
                
                // 检查指纹
                if (this.config.browser.checkFingerprint) {
                    const result = await this._checkFingerprint(browser);
                    if (!result.success) {
                        await browser.close();
                        this.retryCount++;
                        if (this.retryCount < BROWSER_CONFIG.MAX_RETRIES) {
                            logger.info(`等待 ${BROWSER_CONFIG.RETRY_DELAY/1000} 秒后重试...`);
                            await delay(BROWSER_CONFIG.RETRY_DELAY);
                            continue;
                        }
                        throw new Error(`浏览器初始化失败: ${result.reason}`);
                    }
                }

                logger.info('浏览器启动完成');
                this.retryCount = 0;
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

    /**
     * 构建浏览器启动选项
     * @returns {Promise<Object>} 启动选项配置
     */
    async _buildLaunchOptions() {
        const extensionPath = path.join(
            getExtensionsDir(),
            EXTENSIONS.FINGERPRINT_DEFENDER.id,
            EXTENSIONS.FINGERPRINT_DEFENDER.version
        );
        logger.info('加载插件');

        const launchOptions = {
            headless: this.config.browser.headless ? "new" : false,
            executablePath: getChromePath(),
            args: [
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process,Translate",
                "--disable-blink-features=AutomationControlled",
                "--disable-site-isolation-trials",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-features=Autofill,AutofillServerCommunication",
                "--enable-features=NetworkService,NetworkServiceInProcess",
                "--disable-blink-features",
                "--disable-notifications",
                "--no-first-run",
                "--password-store=basic",
                "--window-size=1920,1080",
                "--start-maximized",
                "--disable-gpu-vsync",
                "--disable-software-rasterizer",
                "--disable-dev-tools",
                "--no-default-browser-check",
                "--disable-sync",
                "--disable-prompt-on-repost",
                "--disable-domain-reliability",
                "--disable-client-side-phishing-detection",
                "--disable-component-update",
                "--disable-breakpad",
                "--disable-background-networking",
                "--disable-default-apps",
                "--disable-dinosaur-easter-egg",
                "--disable-hang-monitor",
                "--disable-popup-blocking",
                "--disable-print-preview",
                "--disable-metrics",
                "--disable-speech-api",
                "--disable-voice-input",
                "--disable-wake-on-wifi",
                "--disable-partial-raster",
                "--metrics-recording-only",
                "--use-mock-keychain",
                "--force-color-profile=srgb",
                "--disable-zero-browsers-open-for-tests",
                "--disable-prompt-on-repost",
                "--disable-setuid-sandbox",
                "--disable-threaded-animation",
                "--disable-threaded-scrolling",
                "--disable-web-security",
                "--disable-xss-auditor",
                "--ignore-certificate-errors",
                "--allow-running-insecure-content",
                "--enable-webgl",
                "--enable-accelerated-2d-canvas",
                "--enable-gpu-rasterization",
                "--disable-automation",
                `--window-position=${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 100)}`,
                `--user-agent=${this.config.browser.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}`
            ],
            defaultViewport: null,
            ignoreDefaultArgs: [
                "--enable-automation",
                "--enable-blink-features=AutomationControlled",
                "--enable-blink-features=IdleDetection",
                "--enable-logging",
                "about:blank",
                "--headless=new"
            ],
            ignoreHTTPSErrors: true
        };

        // 如果找不到指定的Chrome路径，移除executablePath选项
        if (!launchOptions.executablePath) {
            delete launchOptions.executablePath;
            logger.warn('未找到指定的Chrome路径，将使用系统默认Chrome');
        } else {
            logger.info(`使用自定义Chrome路径: ${launchOptions.executablePath}`);
        }

        if (!this.config.browser.headless) {
            launchOptions.args.push("--auto-open-devtools-for-tabs");
        }

        if (this.config.proxy.enabled && this.config.browser.proxy) {
            const proxyUrl = this._buildProxyUrl();
            launchOptions.args.push(`--proxy-server=${proxyUrl}`);
            logger.info('代理服务器配置完成');
        }

        return launchOptions;
    }

    /**
     * 构建代理URL
     * @returns {string} 代理URL
     */
    _buildProxyUrl() {
        const { protocol, host, port, username, password } = this.config.proxy;
        return username && password
            ? `${protocol}://${username}:${password}@${host}:${port}`
            : `${protocol}://${host}:${port}`;
    }

    /**
     * 检查浏览器指纹
     * @param {Browser} browser Puppeteer浏览器实例
     * @returns {Promise<{success: boolean, reason?: string}>}
     */
    async _checkFingerprint(browser) {
        logger.info('开始进行浏览器指纹检查...');
        const fingerprintPage = await browser.newPage();
        
        try {
            // 使用 FingerprintSimulator 重置检查页面的指纹
            await this.fingerprintSimulator.resetFingerprint(fingerprintPage);
            
            // 先使用Intoli进行基础检查
            const intoliCheck = await this._checkIntoliFingerprint(fingerprintPage);
            if (!intoliCheck.success) {
                return intoliCheck;
            }

            // 重新重置指纹后进行CreepJS检查
            await this.fingerprintSimulator.resetFingerprint(fingerprintPage);
            const creepjsCheck = await this._checkCreepJSFingerprint(fingerprintPage);
            if (!creepjsCheck.success) {
                return creepjsCheck;
            }

            logger.info('浏览器指纹检查全部通过');
            return { success: true };

        } catch (error) {
            logger.error('指纹检查过程出错:', error);
            return { success: false, reason: `指纹检查出错: ${error.message}` };
        } finally {
            await fingerprintPage.close().catch(() => {});
        }
    }

    /**
     * 使用Intoli检查基础指纹
     * @param {Page} page Puppeteer页面实例
     */
    async _checkIntoliFingerprint(page) {
        try {
            await page.goto('https://bot.sannysoft.com', { 
                waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
                timeout: 60000 
            });

            // 等待页面完全加载并稳定
            await page.waitForFunction(() => document.readyState === 'complete');
            await delay(2000); // 使用delay工具函数替代waitForTimeout
            await page.waitForSelector('h1 + table tr', { timeout: 30000 });
            
            const testData = await page.evaluate(() => {
                const cleanText = text => text ? text.replace(/\s+/g, ' ').trim() : null;

                const h1 = Array.from(document.querySelectorAll('h1'))
                    .find(h1 => h1.textContent.includes('Intoli.com tests'));
                    
                if (!h1) return null;
                
                const table = h1.nextElementSibling;
                if (!table || table.tagName.toLowerCase() !== 'table') return null;

                const testResults = [];
                table.querySelectorAll('tr').forEach(row => {
                    const testName = cleanText(row.querySelector('td:first-child')?.textContent);
                    const result = cleanText(row.querySelector('td:last-child')?.textContent);
                    
                    if (testName && result) {
                        const isPassed = row.querySelector('.passed') !== null || 
                                       result.includes('passed') ||
                                       !result.includes('failed');
                                       
                        testResults.push({ name: testName, result, passed: isPassed });
                    }
                });

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
                        passedTests: testResults.filter(t => t.passed).length,
                        allCriticalPassed: Object.values(criticalTests).every(v => v)
                    }
                };
            });
            
            logger.info('Intoli测试数据:', testData);
            if (!testData) {
                return { success: false, reason: 'Intoli测试：无法获取测试数据' };
            }

            if (!testData.summary.allCriticalPassed) {
                return {
                    success: false,
                    reason: `Intoli测试：关键测试未通过 (${testData.summary.passedTests}/${testData.summary.totalTests})`
                };
            }

            return { success: true };
        } catch (error) {
            logger.error('Intoli指纹检查出错:', error);
            return { success: false, reason: `Intoli测试出错: ${error.message}` };
        }
    }

    /**
     * 使用CreepJS检查深度指纹
     * @param {Page} page Puppeteer页面实例
     */
    async _checkCreepJSFingerprint(page) {
        try {
            await page.goto('https://abrahamjuliot.github.io/creepjs', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            await delay(1000000);
            
            await page.waitForSelector('.ellipsis-all', { timeout: 30000 });
            
            await page.waitForFunction(() => {
                const fpContainer = document.querySelector('.ellipsis-all');
                return fpContainer && !fpContainer.textContent.includes('Computing');
            }, { timeout: 30000, polling: 1000 });

            await delay(2000); // 使用delay工具函数替代waitForTimeout

            const fpData = await page.evaluate(() => {
                const getSection = (title) => {
                    const section = document.evaluate(
                        `//*[contains(text(), "${title}")]/following-sibling::*[1]`,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    
                    if (!section?.textContent) return null;
                    return section.textContent
                        .replace(/\s+/g, ' ')
                        .replace(/\{[^}]*\}/g, '')
                        .replace(/[×\n\r]/g, '')
                        .replace(/:\s*:/g, ':')
                        .replace(/^:+|:+$/g, '')
                        .trim();
                };

                const getTrustScore = () => {
                    const container = document.evaluate(
                        "//div[contains(text(), 'trust score:')]",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;

                    if (!container) return null;

                    const span = container.querySelector('.unblurred');
                    if (!span) return null;

                    const score = span.childNodes[0].textContent.trim();
                    return score ? parseInt(score) : null;
                };

                return {
                    trustScore: getTrustScore(),
                    headlessPercentage: (() => {
                        const headless = getSection('chromium:');
                        if (!headless) return null;
                        const match = headless.match(/(\d+)%\s*like\s*headless/);
                        return match ? parseInt(match[1]) : null;
                    })(),
                    stealth: getSection('stealth:'),
                    resistance: getSection('privacy:'),
                    userAgent: getSection('userAgent:'),
                    webGL: (() => {
                        const vendor = getSection('gpu:');
                        if (!vendor) return null;
                        return vendor.split('ANGLE')[0].trim();
                    })()
                };
            });

            if (!fpData) {
                return { success: false, reason: 'CreepJS测试：无法获取指纹数据' };
            }

            const { trustScore, headlessPercentage } = fpData;

            if (trustScore !== null && trustScore < BROWSER_CONFIG.MIN_TRUST_SCORE) {
                return {
                    success: false,
                    reason: `CreepJS测试：可信度过低 ${trustScore}% (最低要求: ${BROWSER_CONFIG.MIN_TRUST_SCORE}%)`
                };
            }

            if (headlessPercentage !== null && headlessPercentage > BROWSER_CONFIG.MAX_HEADLESS_PERCENTAGE) {
                return {
                    success: false,
                    reason: `CreepJS测试：Headless特征过于明显 ${headlessPercentage}% (最大允许: ${BROWSER_CONFIG.MAX_HEADLESS_PERCENTAGE}%)`
                };
            }

            // 记录测试结果
            let resultText = '=== CreepJS 浏览器指纹检测结果 ===\n\n';
            resultText += '检测结果:\n';
            [
                ['Trust Score', fpData.trustScore],
                ['Headless 检测', fpData.headlessPercentage],
                ['Stealth 评分', fpData.stealth],
                ['隐私保护', fpData.resistance],
                ['User Agent', fpData.userAgent],
                ['WebGL 信息', fpData.webGL],
            ].forEach(([name, value]) => {
                resultText += `${name}: ${value || 'Unknown'}\n`;
            });

            logger.info('\n' + resultText);
            return { success: true };

        } catch (error) {
            logger.warn('CreepJS指纹检查失败:', error.message);
            return { success: false, reason: `CreepJS测试失败: ${error.message}` };
        }
    }

    /**
     * 配置浏览器插件
     * @param {Browser} browser Puppeteer浏览器实例
     */
    async configureExtensions(browser) {
        try {
            logger.info('开始配置插件...');
            const extensionPage = await browser.newPage();
            
            try {
                const extensionUrl = `chrome-extension://${EXTENSIONS.FINGERPRINT_DEFENDER.id}/index.html`;
                await extensionPage.goto(extensionUrl, { waitUntil: 'networkidle0', timeout: 30000 });

                const extensionStorageConfig = {
                    'browser-__index__': ["aeb006a8-3325-c7a4-5c5d-e6faa32e1244"],
                    'browser-aeb006a8-3325-c7a4-5c5d-e6faa32e1244': {
                        "customProtos": [
                            {"name":"Screen","properties":[
                                {"key":"colorDepth","type":"number","value":24},
                                {"key":"pixelDepth","type":"number","value":24}
                            ]},
                            {"name":"Navigator","properties":[
                                {"key":"maxTouchPoints","type":"number","value":0}
                            ]}
                        ],
                        "customVars":[],
                        "factors": {
                            "audio":4.751,"canvas":3.406,"clientRect":3.744,
                            "fonts":0.644,"plugins":3.048,"voice":4.341,
                            "webgl":2.13,"webgpu":2.046
                        },
                        "gpu": {
                            "renderer":"ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)",
                            "vendor":"Google Inc. (Apple)"
                        },
                        "id":"aeb006a8-3325-c7a4-5c5d-e6faa32e1244",
                        "language":"dynamic",
                        "location":{"lat":"dynamic","lng":"dynamic"},
                        "memoryCapacity":8,
                        "name":"Random Browser:0",
                        "processors":1,
                        "screen":{"height":1068,"noise":8,"width":1722},
                        "timezone":"dynamic",
                        "uaInfo": {
                            "cpu":{"architecture":"amd64"},
                            "device":{},
                            "engine":{"name":"Blink","version":"133.0.0.0"},
                            "os":{"name":"Windows","version":"10"},
                            "product":{"major":"133","name":"Chrome","version":"133.0.0.0"}
                        },
                        "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 11969",
                        "webrtc":"dynamic"
                    },
                    'config-__index__': ["option","device","hostEnable","fixedBrowserId"],
                    'config-device': "desktop",
                    'config-hostEnable': '',
                    'config-fixedBrowserId': "aeb006a8-3325-c7a4-5c5d-e6faa32e1244",
                    'config-option': '静态',
                    'config-safeMode': true
                };

                // 设置扩展存储
                for (const [key, value] of Object.entries(extensionStorageConfig)) {
                    await extensionPage.evaluate(async ([key, value]) => {
                        await new Promise((resolve, reject) => {
                            try {
                                chrome.storage.local.set({ [key]: value }, () => {
                                    chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
                                });
                            } catch (error) {
                                reject(error);
                            }
                        });
                    }, [key, value]);
                }

                logger.info('扩展存储设置成功');
                await extensionPage.reload({ waitUntil: 'networkidle0' });

            } catch (error) {
                logger.warn('配置 Fingerprint Defender 时出错:', error.message);
                logger.warn('错误堆栈:', error.stack);
            } finally {
                await extensionPage.close().catch(e => logger.warn('关闭配置页面时出错:', e.message));
            }
            
            logger.info('插件配置完成');
        } catch (error) {
            logger.error('配置插件时出错:', error);
            throw error;
        }
    }
}

module.exports = BrowserInitializer;
