const logger = require('./logger');
const delay = require('./delay');

class HumanBehavior {
    #versions = {
        chrome: ['108', '109', '110', '111', '112', '113', '114', '115'],
        firefox: ['108', '109', '110', '111', '112'],
        safari: ['14.1.2', '15.0', '15.1', '15.2', '15.3']
    };

    #osVersions = {
        win: ['10.0', '11.0'],
        mac: ['10_15_7', '11_0_0', '12_0_0', '13_0_0'],
        linux: ['x86_64', 'aarch64']
    };

    #gpuVendors = [
        {
            vendor: 'Intel Inc.',
            renderer: 'Intel Iris OpenGL Engine'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)'
        },
        {
            vendor: 'Intel Open Source Technology Center',
            renderer: 'Mesa DRI Intel(R) HD Graphics (Skylake GT2)'
        }
    ];

    #languages = [
        ['en-US', 'en'],
        ['en-GB', 'en'],
        ['en-CA', 'en-GB', 'en'],
        ['zh-CN', 'zh'],
        ['zh-TW', 'zh-CN', 'zh']
    ];

    #screenResolutions = [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 1536, height: 864 },
        { width: 1440, height: 900 },
        { width: 1280, height: 720 }
    ];

    constructor() {
        this.minDelay = 500;
        this.maxDelay = 2000;
        this.typeMinDelay = 50;
        this.typeMaxDelay = 200;
    }

    /**
     * 生成随机的用户代理字符串
     * @private
     * @returns {string} 用户代理字符串
     */
    #generateRandomUserAgent() {
        const platforms = {
            win: {
                os: `Windows NT ${this.#getRandomItem(this.#osVersions.win)}; Win64; x64`,
                webkit: '537.36',
                chrome: this.#getRandomItem(this.#versions.chrome),
                firefox: this.#getRandomItem(this.#versions.firefox)
            },
            mac: {
                os: `Macintosh; Intel Mac OS X ${this.#getRandomItem(this.#osVersions.mac)}`,
                webkit: '537.36',
                chrome: this.#getRandomItem(this.#versions.chrome),
                firefox: this.#getRandomItem(this.#versions.firefox),
                safari: this.#getRandomItem(this.#versions.safari)
            },
            linux: {
                os: `X11; Linux ${this.#getRandomItem(this.#osVersions.linux)}`,
                webkit: '537.36',
                chrome: this.#getRandomItem(this.#versions.chrome),
                firefox: this.#getRandomItem(this.#versions.firefox)
            }
        };

        const platformKeys = ['win', 'mac', 'linux'];
        const platformKey = this.#getRandomItem(platformKeys);
        const platform = platforms[platformKey];

        const browserConfigs = {
            chrome: {
                weight: 70,
                generator: () => `Mozilla/5.0 (${platform.os}) AppleWebKit/${platform.webkit} (KHTML, like Gecko) Chrome/${platform.chrome}.0.0.0 Safari/${platform.webkit}`
            },
            firefox: {
                weight: 20,
                generator: () => `Mozilla/5.0 (${platform.os}; rv:${platform.firefox}.0) Gecko/20100101 Firefox/${platform.firefox}.0`
            },
            safari: {
                weight: 10,
                generator: () => platformKey === 'mac' ? 
                    `Mozilla/5.0 (${platform.os}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${platform.safari} Safari/605.1.15` : 
                    this.#generateRandomUserAgent()
            }
        };

        const totalWeight = Object.values(browserConfigs).reduce((sum, config) => sum + config.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedBrowser;

        for (const [browser, config] of Object.entries(browserConfigs)) {
            random -= config.weight;
            if (random <= 0) {
                selectedBrowser = browser;
                break;
            }
        }

        return browserConfigs[selectedBrowser].generator();
    }

    // Private helper methods
    #getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    #getRandomPoint(maxX, maxY) {
        return {
            x: this.#getRandomInt(0, maxX),
            y: this.#getRandomInt(0, maxY)
        };
    }

    /**
     * 重置页面的浏览器指纹和注入保护脚本
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     */
    async resetBrowserFingerprint(page) {
        try {
            logger.info('开始重置浏览器指纹...');
            
            // 获取CDP会话
            const client = await page.target().createCDPSession();

            // 注入预防检测的 JavaScript
            await page.evaluateOnNewDocument(() => {
                // 处理 webdriver
                delete Object.getPrototypeOf(navigator).webdriver;
                
                // 使用多层保护来隐藏 webdriver
                const originalNavigator = navigator;
                const navigatorProxy = new Proxy(navigator, {
                    has: (target, key) => {
                        if (key === 'webdriver') return false;
                        return key in target;
                    },
                    get: (target, key) => {
                        if (key === 'webdriver') return undefined;
                        return Reflect.get(target, key);
                    }
                });

                // 替换全局的 navigator
                Object.defineProperty(window, 'navigator', {
                    value: navigatorProxy,
                    configurable: false,
                    writable: false
                });

                // 处理 navigator 原型
                const navigatorProto = Object.getPrototypeOf(originalNavigator);
                Object.defineProperty(navigatorProto, 'webdriver', {
                    get: () => undefined,
                    set: () => false,
                    configurable: false,
                    enumerable: false
                });

                // 清理所有可能的自动化标记
                const cleanAutomationFlags = () => {
                    const protectedProps = [
                        'webdriver',
                        '_selenium',
                        'callSelenium',
                        '_Selenium_IDE_Recorder',
                        '__webdriver_evaluate',
                        '__selenium_evaluate',
                        '__webdriver_script_fn',
                        '__webdriver_script_func',
                        '__webdriver_script_function',
                        '__webdriver',
                        '__webdriver_unwrapped',
                        '__webdriver_script_function',
                        '$chrome_asyncScriptInfo',
                        '$cdc_asdjflasutopfhvcZLmcfl_',
                        'cdc_adoQpoasnfa76pfcZLmcfl_Array',
                        'cdc_adoQpoasnfa76pfcZLmcfl_Promise',
                        'cdc_adoQpoasnfa76pfcZLmcfl_Symbol',
                        '_WEBDRIVER_ELEM_CACHE'
                    ];

                    const objects = [window, document, navigator];
                    for (const object of objects) {
                        for (const prop of protectedProps) {
                            if (prop in object) {
                                delete object[prop];
                                Object.defineProperty(object, prop, {
                                    get: () => undefined,
                                    set: () => false,
                                    configurable: false,
                                    enumerable: false
                                });
                            }
                        }
                    }

                    // 清理 window 属性
                    for (const key in window) {
                        if (key.match(/driver|webdriver|selenium/gi)) {
                            delete window[key];
                            Object.defineProperty(window, key, {
                                get: () => undefined,
                                set: () => false,
                                configurable: false,
                                enumerable: false
                            });
                        }
                    }
                };

                cleanAutomationFlags();

                // 处理 chrome
                const chromeObj = {
                    app: {
                        isInstalled: false,
                        InstallState: {
                            DISABLED: 'disabled',
                            INSTALLED: 'installed',
                            NOT_INSTALLED: 'not_installed'
                        },
                        RunningState: {
                            CANNOT_RUN: 'cannot_run',
                            READY_TO_RUN: 'ready_to_run',
                            RUNNING: 'running'
                        },
                        getDetails: function() { return {}; },
                        getIsInstalled: function() { return false; },
                        installState: function() { return 'not_installed'; },
                        runningState: function() { return 'cannot_run'; }
                    },
                    runtime: {
                        PlatformOs: {
                            MAC: 'mac',
                            WIN: 'win',
                            ANDROID: 'android',
                            CROS: 'cros',
                            LINUX: 'linux',
                            OPENBSD: 'openbsd'
                        },
                        PlatformArch: {
                            ARM: 'arm',
                            X86_32: 'x86-32',
                            X86_64: 'x86-64'
                        },
                        RequestUpdateCheckStatus: {
                            THROTTLED: 'throttled',
                            NO_UPDATE: 'no_update',
                            UPDATE_AVAILABLE: 'update_available'
                        },
                        OnInstalledReason: {
                            INSTALL: 'install',
                            UPDATE: 'update',
                            CHROME_UPDATE: 'chrome_update',
                            SHARED_MODULE_UPDATE: 'shared_module_update'
                        },
                        OnRestartRequiredReason: {
                            APP_UPDATE: 'app_update',
                            OS_UPDATE: 'os_update',
                            PERIODIC: 'periodic'
                        },
                        connect: function() {
                            throw new Error('Extension context invalidated.');
                        },
                        sendMessage: function() {
                            return Promise.resolve();
                        }
                    },
                    csi: function() { return {}; },
                    loadTimes: function() { return {}; }
                };

                // 使用代理来模拟真实的 chrome 对象
                const chromeHandler = {
                    get(target, property) {
                        if (property in target) {
                            const value = target[property];
                            if (typeof value === 'object' && value !== null) {
                                return new Proxy(value, chromeHandler);
                            }
                            return value;
                        }
                        return undefined;
                    },
                    has(target, property) {
                        return property in target;
                    }
                };

                // 设置 chrome 对象
                Object.defineProperty(window, 'chrome', {
                    value: new Proxy(chromeObj, chromeHandler),
                    configurable: false,
                    writable: false,
                    enumerable: true
                });

                // 处理 plugins
                const plugins = [
                    {
                        0: {
                            type: 'application/x-google-chrome-pdf',
                            suffixes: 'pdf',
                            description: 'Portable Document Format',
                            enabledPlugin: true
                        },
                        name: 'Chrome PDF Plugin',
                        filename: 'internal-pdf-viewer',
                        description: 'Portable Document Format',
                        length: 1
                    },
                    {
                        0: {
                            type: 'application/pdf',
                            suffixes: 'pdf',
                            description: '',
                            enabledPlugin: true
                        },
                        name: 'Chrome PDF Viewer',
                        filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                        description: '',
                        length: 1
                    },
                    {
                        0: {
                            type: 'application/x-nacl',
                            suffixes: '',
                            description: 'Native Client Executable',
                            enabledPlugin: true
                        },
                        1: {
                            type: 'application/x-pnacl',
                            suffixes: '',
                            description: 'Portable Native Client Executable',
                            enabledPlugin: true
                        },
                        name: 'Native Client',
                        filename: 'internal-nacl-plugin',
                        description: '',
                        length: 2
                    }
                ];

                // 创建 PluginArray
                const createPluginArray = () => {
                    const pluginArray = [];
                    plugins.forEach((plugin, index) => {
                        pluginArray[index] = plugin;
                        pluginArray[plugin.name] = plugin;
                    });
                    Object.setPrototypeOf(pluginArray, PluginArray.prototype);
                    Object.defineProperty(pluginArray, 'length', {
                        value: plugins.length,
                        writable: false,
                        enumerable: true
                    });
                    return pluginArray;
                };

                // 设置 plugins
                Object.defineProperty(navigator, 'plugins', {
                    get: () => createPluginArray(),
                    enumerable: true,
                    configurable: false
                });

                // 处理 languages
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en'],
                    enumerable: true,
                    configurable: false
                });

                // 处理 permissions
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => 
                    parameters.name === 'notifications' 
                        ? Promise.resolve({ state: Notification.permission })
                        : originalQuery(parameters);

                // 修改 Error 堆栈
                const errorHandler = {
                    get(target, property) {
                        if (property === 'stack') {
                            return target[property].replace(/\n.*?(puppeteer|webdriver|selenium|driver).*$/gm, '');
                        }
                        return target[property];
                    }
                };

                window.Error = new Proxy(Error, {
                    construct(target, args) {
                        const error = new target(...args);
                        return new Proxy(error, errorHandler);
                    }
                });

                // 修改 WebGL
                if (window.WebGLRenderingContext) {
                    const getParameter = WebGLRenderingContext.prototype.getParameter;
                    WebGLRenderingContext.prototype.getParameter = function(parameter) {
                        if (parameter === 37445) return 'Intel Inc.';
                        if (parameter === 37446) return 'Intel Iris OpenGL Engine';
                        return getParameter.apply(this, arguments);
                    };
                }
            });

            // 使用CDP设置更多属性
            await this.#applyCDPOverrides(client, {
                userAgent: this.#generateRandomUserAgent(),
                languages: this.#getRandomItem(this.#languages),
                screen: this.#getRandomItem(this.#screenResolutions)
            });

            logger.info('浏览器指纹重置完成');
        } catch (error) {
            logger.error('重置浏览器指纹时出错:', error);
            throw error;
        }
    }

    /**
     * 使用CDP协议设置浏览器特征
     * @private
     */
    async #applyCDPOverrides(client, { userAgent, languages, screen }) {
        try {
            // 更细致的User-Agent设置
            await client.send('Network.setUserAgentOverride', {
                userAgent: userAgent,
                acceptLanguage: languages[0],
                platform: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Macintosh') ? 'MacOS' : 'Linux',
                userAgentMetadata: {
                    brands: [
                        { brand: 'Chromium', version: '110'},
                        { brand: 'Not(A:Brand', version: '8'},
                        { brand: 'Google Chrome', version: '110'}
                    ],
                    fullVersion: '110.0.5481.177',
                    platform: 'Windows',
                    platformVersion: '10.0.0',
                    architecture: 'x86',
                    model: '',
                    mobile: false
                }
            });

            // 语言和地区设置
            await client.send('Emulation.setLocaleOverride', {
                locale: languages[0]
            }).catch(() => {}); // 忽略可能的语言设置错误

            // 时区设置（使用动态时区）
            const timezones = ['Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'Europe/London'];
            await client.send('Emulation.setTimezoneOverride', {
                timezoneId: this.#getRandomItem(timezones)
            }).catch(() => {}); // 忽略可能的时区设置错误

            // 设备模拟（避免使用setWindowBounds）
            await client.send('Emulation.setDeviceMetricsOverride', {
                width: screen.width,
                height: screen.height,
                deviceScaleFactor: 1,
                mobile: false
            }).catch(() => {}); // 忽略可能的设备模拟错误

            // 使用CDP注入最早期的保护代码
            await client.send('Page.addScriptToEvaluateOnNewDocument', {
                source: `
                    (function() {
                        // 1. 最早期阻止检测
                        delete Object.getPrototypeOf(navigator).webdriver;
                        
                        // 2. 防止属性检测
                        const oldDefineProperty = Object.defineProperty;
                        Object.defineProperty = function(obj, prop, desc) {
                            if (prop === 'webdriver') {
                                return obj;
                            }
                            return oldDefineProperty(obj, prop, desc);
                        };
                        
                        // 3. 注入错误的检测结果
                        window.navigator.chrome = {
                            runtime: {
                                connect: function() { 
                                    throw new Error('Extension context invalidated.');
                                }
                            }
                        };
                        
                        // 4. 设置随机化的性能API
                        const originalGetEntries = window.performance.getEntries;
                        window.performance.getEntries = function() {
                            const entries = originalGetEntries.apply(this, arguments);
                            return entries.filter(entry => !entry.name.includes('automation'));
                        };
                        
                        // 5. 创建假的permissions API
                        const originalQuery = window.navigator.permissions.query;
                        window.navigator.permissions.query = function(parameters) {
                            return new Promise((resolve) => {
                                resolve({ state: "prompt" });
                            });
                        };
                    })();
                `
            });

            // 模拟真实的性能指标
            await client.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
            await client.send('Network.enable').catch(() => {});
            await client.send('Network.emulateNetworkConditions', {
                offline: false,
                latency: 20,  // 模拟20ms延迟
                downloadThroughput: 1024 * 1024 * 10,  // 10 Mbps
                uploadThroughput: 1024 * 1024 * 5      // 5 Mbps
            }).catch(() => {});

        } catch (error) {
            logger.error('CDP覆盖设置失败:', error.message);
            logger.debug('CDP错误详情:', error);
            // 不要立即抛出错误，让程序继续运行
            logger.warn('部分CDP配置失败，但将继续执行');
        } finally {
            // 确保重置某些CDP状态
            try {
                await client.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
                await client.send('Emulation.clearGeolocationOverride').catch(() => {});
            } catch (cleanupError) {
                logger.warn('CDP清理过程出错:', cleanupError.message);
            }
        }
    }

    /**
     * 模拟人类行为
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     * @param {Object} options 配置选项
     * @param {number} options.duration 模拟行为持续时间（毫秒），默认5000ms
     * @param {number} options.movements 鼠标移动次数，默认3-7次
     */
    async simulateHumanBehavior(page, options = {}) {
        const duration = options.duration || 5000;
        const movements = this.#getRandomInt(3, options.movements || 7);

        try {
            const dimensions = await page.evaluate(() => ({
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            }));

            logger.info(`开始模拟人类行为，计划移动 ${movements} 次`);

            for (let i = 0; i < movements; i++) {
                const point = this.#getRandomPoint(dimensions.width, dimensions.height);
                await page.mouse.move(point.x, point.y);
                logger.debug(`鼠标移动到位置: (${point.x}, ${point.y})`);

                const waitTime = this.#getRandomInt(this.minDelay, this.maxDelay);
                await delay(waitTime);

                if (Math.random() < 0.25) {
                    const scrollY = this.#getRandomInt(-300, 300);
                    await page.evaluate((y) => window.scrollBy(0, y), scrollY);
                    logger.debug(`页面滚动: ${scrollY}px`);
                }
            }

            await delay(this.#getRandomInt(this.minDelay, this.maxDelay));
            logger.info('人类行为模拟完成');
        } catch (error) {
            logger.error('模拟人类行为时出错:', error);
            throw error;
        }
    }

    /**
     * 模拟人类输入文本
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     * @param {string} selector 输入框选择器
     * @param {string} text 要输入的文本
     */
    async simulateHumanTyping(page, selector, text) {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
            await delay(this.#getRandomInt(300, 800));

            for (const char of text.split('')) {
                await page.type(selector, char, {
                    delay: this.#getRandomInt(this.typeMinDelay, this.typeMaxDelay)
                });

                if (Math.random() < 0.1) {
                    await delay(this.#getRandomInt(400, 1000));
                }
            }

            await delay(this.#getRandomInt(200, 500));
            logger.debug(`已模拟人工输入文本到 ${selector}`);
        } catch (error) {
            logger.error('模拟人类输入文本时出错:', error);
            throw error;
        }
    }
}

module.exports = HumanBehavior;
