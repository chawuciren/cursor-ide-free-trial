const logger = require('./logger');

class FingerprintSimulator {
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
            vendor: 'Google Inc. (NVIDIA)',
            renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)'
        },
        {
            vendor: 'Intel Inc.',
            renderer: 'Intel Iris OpenGL Engine'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)'
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

    #timezones = ['Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'Europe/London'];

    /**
     * 重置页面的浏览器指纹
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     */
    async resetFingerprint(page) {
        try {
            logger.info('开始重置浏览器指纹...');
            
            const client = await page.target().createCDPSession();
            await this.#injectFingerprintProtection(page);
            await this.#applyCDPOverrides(client);

            logger.info('浏览器指纹重置完成');
        } catch (error) {
            logger.error('重置浏览器指纹时出错:', error);
            throw error;
        }
    }

    /**
     * 注入指纹保护脚本
     * @private
     */
    async #injectFingerprintProtection(page) {
        // 注入 Notification API
        await page.evaluateOnNewDocument(() => {
            if (typeof Notification === 'undefined') {
                window.Notification = class Notification {
                    static get permission() { return 'granted'; }
                    static requestPermission() { return Promise.resolve('granted'); }
                    constructor() {}
                };
            }
        });

        // 注入 WebDriver 保护
        await page.evaluateOnNewDocument(() => {
            // 删除 webdriver 属性
            if ('webdriver' in navigator) {
                Object.defineProperty(Navigator.prototype, 'webdriver', {
                    get: () => undefined,
                    configurable: true,
                    enumerable: true
                });
            }

            // 清理自动化标记
            const protectedProps = [
                'webdriver', '_selenium', 'callSelenium', '_Selenium_IDE_Recorder',
                '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn',
                '__webdriver_script_func', '__webdriver_script_function', '__webdriver',
                '__webdriver_unwrapped', '__webdriver_script_function', '$chrome_asyncScriptInfo',
                '$cdc_asdjflasutopfhvcZLmcfl_', 'cdc_adoQpoasnfa76pfcZLmcfl_Array',
                'cdc_adoQpoasnfa76pfcZLmcfl_Promise', 'cdc_adoQpoasnfa76pfcZLmcfl_Symbol',
                '_WEBDRIVER_ELEM_CACHE'
            ];

            const objects = [window, document];
            for (const object of objects) {
                for (const prop of protectedProps) {
                    if (prop in object) {
                        delete object[prop];
                        Object.defineProperty(object, prop, {
                            get: () => undefined,
                            set: () => false,
                            configurable: true,
                            enumerable: false
                        });
                    }
                }
            }

            for (const key in window) {
                if (key.match(/driver|webdriver|selenium/gi)) {
                    delete window[key];
                    Object.defineProperty(window, key, {
                        get: () => undefined,
                        set: () => false,
                        configurable: true,
                        enumerable: false
                    });
                }
            }
        });

        // 注入 Chrome 保护
        await page.evaluateOnNewDocument(() => {
            try {
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
                        getDetails: () => ({}),
                        getIsInstalled: () => false,
                        installState: () => 'not_installed',
                        runningState: () => 'cannot_run'
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
                        connect: () => { throw new Error('Extension context invalidated.'); },
                        sendMessage: () => Promise.resolve()
                    },
                    csi: () => ({}),
                    loadTimes: () => ({})
                };

                const chromeHandler = {
                    get: (target, property) => {
                        if (property in target) {
                            const value = target[property];
                            return typeof value === 'object' && value !== null ?
                                new Proxy(value, chromeHandler) : value;
                        }
                        return undefined;
                    },
                    has: (target, property) => property in target
                };

                // 只在chrome未定义时才创建
                if (!window.chrome) {
                    Object.defineProperty(window, 'chrome', {
                        value: new Proxy(chromeObj, chromeHandler),
                        enumerable: true,
                        writable: true,
                        configurable: true
                    });
                }
            } catch (e) {
                // 忽略错误，继续执行
            }
        });

        // 注入 Permissions 保护
        await page.evaluateOnNewDocument(() => {
            try {
                const permissionsHandler = {
                    query: async (parameters) => {
                        const permissionStatus = {
                            state: 'granted',
                            onchange: null,
                            addEventListener: function(type, listener) {
                                if (type !== 'change') return;
                                this._listeners = this._listeners || [];
                                this._listeners.push(listener);
                            },
                            removeEventListener: function(type, listener) {
                                if (type !== 'change') return;
                                const index = this._listeners?.indexOf(listener);
                                if (index > -1) this._listeners.splice(index, 1);
                            },
                            dispatchEvent: function(event) {
                                if (this._listeners) {
                                    this._listeners.forEach(listener => listener(event));
                                }
                                return true;
                            }
                        };
                        return Promise.resolve(permissionStatus);
                    }
                };

                // 检查permissions是否可配置
                const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'permissions');
                if (!descriptor || descriptor.configurable) {
                    Object.defineProperty(Navigator.prototype, 'permissions', {
                        value: permissionsHandler,
                        enumerable: true,
                        writable: true,
                        configurable: true
                    });
                }
            } catch (e) {
                // 忽略错误，继续执行
            }
        });

        // 注入 Plugins 保护
        await page.evaluateOnNewDocument(() => {
            try {
                const plugins = [
                    {
                        0: {
                            type: 'application/x-google-chrome-pdf',
                            suffixes: 'pdf',
                            description: 'Portable Document Format',
                            enabledPlugin: true,
                            __proto__: Plugin.prototype
                        },
                        name: 'Chrome PDF Plugin',
                        filename: 'internal-pdf-viewer',
                        description: 'Portable Document Format',
                        length: 1,
                        __proto__: Plugin.prototype
                    },
                    {
                        0: {
                            type: 'application/pdf',
                            suffixes: 'pdf',
                            description: '',
                            enabledPlugin: true,
                            __proto__: Plugin.prototype
                        },
                        name: 'Chrome PDF Viewer',
                        filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                        description: '',
                        length: 1,
                        __proto__: Plugin.prototype
                    }
                ];

                const pluginArray = Object.create(PluginArray.prototype);
                
                plugins.forEach((plugin, index) => {
                    Object.defineProperty(pluginArray, index, {
                        value: plugin,
                        enumerable: true,
                        writable: true,
                        configurable: true
                    });
                    Object.defineProperty(pluginArray, plugin.name, {
                        value: plugin,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    });
                });

                Object.defineProperty(pluginArray, 'length', {
                    value: plugins.length,
                    enumerable: true,
                    writable: true,
                    configurable: true
                });

                pluginArray.item = function(index) { return this[index]; };
                pluginArray.namedItem = function(name) { return this[name]; };
                pluginArray.refresh = function() {};

                // 检查plugins是否可配置
                const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'plugins');
                if (!descriptor || descriptor.configurable) {
                    Object.defineProperty(Navigator.prototype, 'plugins', {
                        get: () => pluginArray,
                        enumerable: true,
                        configurable: true
                    });
                }
            } catch (e) {
                // 忽略错误，继续执行
            }
        });

        // 注入 Languages 保护
        await page.evaluateOnNewDocument(() => {
            try {
                const languageList = ['en-US', 'en', 'en-GB'];
                
                // 检查languages是否可配置
                const languagesDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'languages');
                if (!languagesDescriptor || languagesDescriptor.configurable) {
                    Object.defineProperty(Navigator.prototype, 'languages', {
                        get: () => Object.freeze([...languageList]),
                        enumerable: true,
                        configurable: true
                    });
                }

                // 检查language是否可配置
                const languageDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language');
                if (!languageDescriptor || languageDescriptor.configurable) {
                    Object.defineProperty(Navigator.prototype, 'language', {
                        get: () => languageList[0],
                        enumerable: true,
                        configurable: true
                    });
                }
            } catch (e) {
                // 忽略错误，继续执行
            }
        });

        // 注入 WebGL 保护
        await page.evaluateOnNewDocument(() => {
            if (!window.WebGLRenderingContext) return;

            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                const gl = originalGetContext.call(this, contextType, {
                    ...contextAttributes,
                    preserveDrawingBuffer: true
                });

                if (gl && (contextType === 'webgl' || contextType === 'experimental-webgl')) {
                    const getParameter = gl.getParameter.bind(gl);
                    gl.getParameter = function(parameter) {
                        const vendorInfo = {
                            [37445]: 'Google Inc. (NVIDIA)',
                            [37446]: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)',
                            [7936]: 'WebKit',
                            [7937]: 'WebKit WebGL',
                            [7938]: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                            [35724]: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                            [3379]: 16384,
                            [3386]: 32,
                            [3410]: 8,
                            [3411]: 8,
                            [3412]: 8,
                            [3413]: 8,
                            [3414]: 8,
                            [3415]: 24,
                            [3416]: 8
                        };

                        return parameter in vendorInfo ? 
                            vendorInfo[parameter] : 
                            getParameter(parameter);
                    };

                    const debugInfo = {
                        UNMASKED_VENDOR_WEBGL: 37445,
                        UNMASKED_RENDERER_WEBGL: 37446
                    };
                    
                    const originalGetExtension = gl.getExtension.bind(gl);
                    gl.getExtension = function(name) {
                        return name === 'WEBGL_debug_renderer_info' ?
                            debugInfo : originalGetExtension(name);
                    };
                }
                return gl;
            };
        });

        // 注入 Image 保护
        await page.evaluateOnNewDocument(() => {
            const originalImage = window.Image;
            window.Image = function(width, height) {
                const image = new originalImage(width, height);
                if (width === 16 && height === 16) {
                    Object.defineProperty(image, 'width', {
                        get: () => 16,
                        set: () => {},
                        configurable: false
                    });
                    Object.defineProperty(image, 'height', {
                        get: () => 16,
                        set: () => {},
                        configurable: false
                    });
                }
                return image;
            };
            window.Image.prototype = originalImage.prototype;
            window.Image.prototype.constructor = window.Image;
        });

        // 注入 Error 保护
        await page.evaluateOnNewDocument(() => {
            const errorHandler = {
                get(target, property) {
                    if (property === 'stack') {
                        return target[property].replace(
                            /\n.*?(puppeteer|webdriver|selenium|driver).*$/gm,
                            ''
                        );
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
        });

        // 注入 Navigator API 保护
        await page.evaluateOnNewDocument(() => {
            const originalSendBeacon = navigator.sendBeacon;
            const originalGetUserMedia = navigator.mediaDevices?.getUserMedia;
            const originalGetBattery = navigator.getBattery;

            if (originalSendBeacon) {
                navigator.sendBeacon = function(url, data) {
                    if (arguments.length === 0) {
                        throw new TypeError('Failed to execute sendBeacon on Navigator: 1 argument required, but only 0 present.');
                    }
                    return originalSendBeacon.apply(navigator, arguments);
                };
            }

            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia = function(constraints) {
                    if (arguments.length === 0) {
                        throw new TypeError('Failed to execute getUserMedia on MediaDevices: 1 argument required, but only 0 present.');
                    }
                    return originalGetUserMedia ? originalGetUserMedia.apply(navigator.mediaDevices, arguments) 
                        : Promise.reject(new Error('getUserMedia is not supported'));
                };
            }

            if (originalGetBattery) {
                navigator.getBattery = function() {
                    return originalGetBattery.apply(navigator);
                };
            }
        });
    }

    /**
     * 使用CDP协议设置浏览器特征
     * @private
     */
    async #applyCDPOverrides(client) {
        try {
            const userAgent = this.#generateRandomUserAgent();
            const languages = this.#getRandomItem(this.#languages);
            const screen = this.#getRandomItem(this.#screenResolutions);

            await this.#setUserAgent(client, userAgent, languages[0]);
            await this.#setLocale(client, languages[0]);
            await this.#setTimezone(client);
            await this.#setDeviceMetrics(client, screen);
            await this.#setPerformanceMetrics(client);

        } catch (error) {
            logger.error('CDP覆盖设置失败:', error.message);
            logger.debug('CDP错误详情:', error);
            logger.warn('部分CDP配置失败，但将继续执行');
        }
    }

    /**
     * 设置用户代理
     * @private
     */
    async #setUserAgent(client, userAgent, language) {
        await client.send('Network.setUserAgentOverride', {
            userAgent,
            acceptLanguage: language,
            platform: userAgent.includes('Windows') ? 'Windows' : 
                     userAgent.includes('Macintosh') ? 'MacOS' : 'Linux',
            userAgentMetadata: {
                brands: [
                    { brand: 'Chromium', version: '110' },
                    { brand: 'Not(A:Brand', version: '8' },
                    { brand: 'Google Chrome', version: '110' }
                ],
                fullVersion: '110.0.5481.177',
                platform: 'Windows',
                platformVersion: '10.0.0',
                architecture: 'x86',
                model: '',
                mobile: false
            }
        });
    }

    /**
     * 设置地区
     * @private
     */
    async #setLocale(client, locale) {
        await client.send('Emulation.setLocaleOverride', { locale })
            .catch(() => {});
    }

    /**
     * 设置时区
     * @private
     */
    async #setTimezone(client) {
        await client.send('Emulation.setTimezoneOverride', {
            timezoneId: this.#getRandomItem(this.#timezones)
        }).catch(() => {});
    }

    /**
     * 设置设备度量
     * @private
     */
    async #setDeviceMetrics(client, screen) {
        await client.send('Emulation.setDeviceMetricsOverride', {
            width: screen.width,
            height: screen.height,
            deviceScaleFactor: 1,
            mobile: false
        }).catch(() => {});
    }

    /**
     * 设置性能指标
     * @private
     */
    async #setPerformanceMetrics(client) {
        await client.send('Emulation.setCPUThrottlingRate', { rate: 1 })
            .catch(() => {});
        await client.send('Network.enable').catch(() => {});
        await client.send('Network.emulateNetworkConditions', {
            offline: false,
            latency: 20,
            downloadThroughput: 1024 * 1024 * 10,
            uploadThroughput: 1024 * 1024 * 5
        }).catch(() => {});
    }

    /**
     * 生成随机用户代理字符串
     * @private
     */
    #generateRandomUserAgent() {
        const platforms = this.#getPlatformConfigs();
        const platformKey = this.#getRandomItem(['win', 'mac', 'linux']);
        const platform = platforms[platformKey];

        const browserConfigs = this.#getBrowserConfigs(platform, platformKey);
        const selectedBrowser = this.#selectBrowser(browserConfigs);

        return browserConfigs[selectedBrowser].generator();
    }

    /**
     * 获取平台配置
     * @private
     */
    #getPlatformConfigs() {
        return {
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
    }

    /**
     * 获取浏览器配置
     * @private
     */
    #getBrowserConfigs(platform, platformKey) {
        return {
            chrome: {
                weight: 70,
                generator: () => 
                    `Mozilla/5.0 (${platform.os}) AppleWebKit/${platform.webkit} ` +
                    `(KHTML, like Gecko) Chrome/${platform.chrome}.0.0.0 Safari/${platform.webkit}`
            },
            firefox: {
                weight: 20,
                generator: () => 
                    `Mozilla/5.0 (${platform.os}; rv:${platform.firefox}.0) ` +
                    `Gecko/20100101 Firefox/${platform.firefox}.0`
            },
            safari: {
                weight: 10,
                generator: () => platformKey === 'mac' ? 
                    `Mozilla/5.0 (${platform.os}) AppleWebKit/605.1.15 ` +
                    `(KHTML, like Gecko) Version/${platform.safari} Safari/605.1.15` : 
                    this.#generateRandomUserAgent()
            }
        };
    }

    /**
     * 选择浏览器
     * @private
     */
    #selectBrowser(browserConfigs) {
        const totalWeight = Object.values(browserConfigs)
            .reduce((sum, config) => sum + config.weight, 0);
        let random = Math.random() * totalWeight;

        for (const [browser, config] of Object.entries(browserConfigs)) {
            random -= config.weight;
            if (random <= 0) return browser;
        }
    }

    /**
     * 获取随机数组项
     * @private
     */
    #getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = FingerprintSimulator; 