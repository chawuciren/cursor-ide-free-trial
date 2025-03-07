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
            
            // 生成随机用户代理
            const userAgent = this.#generateRandomUserAgent();
            
            // 随机选择GPU信息
            const gpu = this.#getRandomItem(this.#gpuVendors);
            
            // 随机选择语言
            const languages = this.#getRandomItem(this.#languages);
            
            // 随机选择屏幕分辨率
            const screen = this.#getRandomItem(this.#screenResolutions);

            // CDP层：设置基础特征
            await this.#applyCDPOverrides(client, {
                userAgent,
                languages,
                screen
            });

            // 注入层：添加保护脚本
            await this.#injectProtections(page, {
                gpu,
                languages
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
        // 设置User-Agent
        await client.send('Network.setUserAgentOverride', {
            userAgent: userAgent,
            acceptLanguage: languages[0],
            platform: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Macintosh') ? 'MacOS' : 'Linux'
        });

        // 设置语言
        await client.send('Emulation.setLocaleOverride', {
            locale: languages[0]
        });

        // 设置时区
        await client.send('Emulation.setTimezoneOverride', {
            timezoneId: 'Asia/Shanghai'
        });

        // 设置设备参数
        await client.send('Emulation.setDeviceMetricsOverride', {
            width: screen.width,
            height: screen.height,
            deviceScaleFactor: 1,
            mobile: false
        });
    }

    /**
     * 注入保护脚本
     * @private
     */
    async #injectProtections(page, { gpu, languages }) {
        // 基础浏览器API保护
        await page.evaluateOnNewDocument(() => {
            // 基础navigator属性
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', {
                get: () => {
                    const fakePlugins = [
                        {
                            description: "Portable Document Format",
                            filename: "internal-pdf-viewer",
                            name: "Chrome PDF Plugin",
                            MimeTypes: [{ description: "Portable Document Format", enabledPlugin: true, suffixes: "pdf", type: "application/x-google-chrome-pdf" }]
                        },
                        {
                            description: "",
                            filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                            name: "Chrome PDF Viewer",
                            MimeTypes: [{ description: "", enabledPlugin: true, suffixes: "pdf", type: "application/pdf" }]
                        }
                    ];

                    return Object.setPrototypeOf({
                        ...Array.from(fakePlugins).reduce((acc, plugin, idx) => {
                            acc[idx] = plugin;
                            acc[plugin.name] = plugin;
                            return acc;
                        }, {}),
                        length: fakePlugins.length,
                    }, PluginArray.prototype);
                }
            });

            // 权限API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );

            // Chrome运行时
            window.chrome = {
                runtime: {
                    PlatformOs: {
                        MAC: 'mac', WIN: 'win', ANDROID: 'android',
                        CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd',
                    },
                    PlatformArch: {
                        ARM: 'arm',
                        X86_32: 'x86-32',
                        X86_64: 'x86-64',
                    },
                    PlatformNaclArch: {
                        ARM: 'arm',
                        X86_32: 'x86-32',
                        X86_64: 'x86-64',
                    },
                    RequestUpdateCheckStatus: {
                        THROTTLED: 'throttled',
                        NO_UPDATE: 'no_update',
                        UPDATE_AVAILABLE: 'update_available',
                    }
                }
            };
        });

        // 硬件和设备特征
        await page.evaluateOnNewDocument(() => {
            Object.defineProperties(navigator, {
                'deviceMemory': { get: () => 8 },
                'hardwareConcurrency': { get: () => 8 },
                'bluetooth': {
                    get: () => ({
                        getAvailability: async () => true,
                        requestDevice: async () => { throw new Error('User cancelled the request.'); }
                    })
                },
                'mediaCapabilities': {
                    get: () => ({
                        decodingInfo: async () => ({
                            supported: true,
                            smooth: true,
                            powerEfficient: true
                        })
                    })
                }
            });

            // 电池API
            navigator.getBattery = async () => ({
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 1,
                addEventListener: () => {},
                removeEventListener: () => {}
            });

            // 网络信息
            Object.defineProperty(navigator, 'connection', {
                get: () => ({
                    downlink: 10,
                    effectiveType: "4g",
                    onchange: null,
                    rtt: 50,
                    saveData: false
                })
            });
        });

        // WebGL保护
        await page.evaluateOnNewDocument((gpu) => {
            if (window.WebGLRenderingContext) {
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = new Proxy(getParameter, {
                    apply: function(target, ctx, args) {
                        const param = args[0];
                        const result = target.apply(ctx, args);

                        if (param === 37445) return gpu.vendor;
                        if (param === 37446) return gpu.renderer;
                        return result;
                    }
                });
            }
        }, gpu);

        // 语言和本地化设置
        await page.evaluateOnNewDocument((languages) => {
            Object.defineProperty(navigator, 'languages', { get: () => languages });
        }, languages);

        // WebRTC保护
        await page.evaluateOnNewDocument(() => {
            if (navigator.mediaDevices?.getUserMedia) {
                const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = async (constraints) => {
                    const stream = await originalGetUserMedia(constraints);
                    if (stream) {
                        stream.getTracks().forEach(track => {
                            Object.defineProperties(track, {
                                'label': { get: () => 'External Device' },
                                'enabled': { get: () => true }
                            });
                        });
                    }
                    return stream;
                };
            }
        });
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
