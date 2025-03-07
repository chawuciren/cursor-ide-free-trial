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
     * 生成指纹数据
     * @returns {Object} 指纹数据
     */
    generateFingerprint() {
        // 基础版本信息
        const chromeVersion = '136.0.0.0';
        const majorVersion = chromeVersion.split('.')[0];
        const screen = this.#getRandomItem(this.#screenResolutions);
        const languages = this.#getRandomItem(this.#languages);
        const gpu = this.#getRandomItem(this.#gpuVendors);

        // 构建 accept-language
        const acceptLanguage = `${languages[0]},${languages[1]};q=0.9`;

        return {
            // 浏览器信息
            browser: {
                version: chromeVersion,
                majorVersion,
                userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`,
                brands: [
                    { brand: 'Not.A/Brand', version: '99' },
                    { brand: 'Chromium', version: majorVersion }
                ],
                acceptLanguage,
                languages: languages,
                platform: 'Windows',
                platformVersion: '10.0.0',
                architecture: 'x86_64',
                bitness: '64',
                wow64: false,
                mobile: false,
                model: ''
            },

            // 设备信息
            device: {
                screen: {
                    width: screen.width,
                    height: screen.height,
                    deviceScaleFactor: 1,
                    colorDepth: 24,
                    pixelDepth: 24
                },
                gpu: {
                    vendor: gpu.vendor,
                    renderer: gpu.renderer
                },
                memory: 8,
                cores: 8,
                touchPoints: 0
            },

            // 网络信息
            network: {
                type: '4g',
                downlink: 10,
                rtt: 50,
                saveData: false
            },

            // 时区信息
            timezone: this.#getRandomItem(this.#timezones),

            // 电池信息
            battery: {
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 1
            },

            // HTTP 头信息
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': acceptLanguage,
                'origin': 'https://abrahamjuliot.github.io',
                'referer': 'https://abrahamjuliot.github.io/',
                'sec-ch-ua': `"Not.A/Brand";v="99", "Chromium";v="${majorVersion}"`,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site'
            }
        };
    }

    /**
     * 重置页面的浏览器指纹
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     * @param {Object} fingerprint 指纹数据
     */
    async resetFingerprint(page, fingerprint = this.generateFingerprint()) {
        try {
            logger.info('开始重置浏览器指纹...');
            
            const client = await page.target().createCDPSession();
            await this.#injectFingerprintProtection(page, fingerprint);
            await this.#applyCDPOverrides(client, fingerprint);

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
    async #injectFingerprintProtection(page, fingerprint) {
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

        // 注入设备信息
        await page.evaluateOnNewDocument((fp) => {
            try {
                // 添加浏览器特征
                Object.defineProperties(navigator, {
                    deviceMemory: {
                        value: fp.device.memory,
                        configurable: true,
                        enumerable: true
                    },
                    hardwareConcurrency: {
                        value: fp.device.cores,
                        configurable: true,
                        enumerable: true
                    },
                    vendor: {
                        value: 'Google Inc.',
                        configurable: true,
                        enumerable: true
                    },
                    platform: {
                        value: 'Win32',
                        configurable: true,
                        enumerable: true
                    },
                    maxTouchPoints: {
                        value: fp.device.touchPoints,
                        configurable: true,
                        enumerable: true
                    }
                });

                // 添加连接信息模拟
                if (!navigator.connection) {
                    Object.defineProperty(navigator, 'connection', {
                        value: {
                            effectiveType: fp.network.type,
                            rtt: fp.network.rtt,
                            downlink: fp.network.downlink,
                            saveData: fp.network.saveData
                        },
                        configurable: true,
                        enumerable: true
                    });
                }

                // 添加电池 API 模拟
                if (!navigator.getBattery) {
                    navigator.getBattery = function() {
                        return Promise.resolve(fp.battery);
                    };
                }
            } catch (e) {
                // 忽略错误，继续执行
            }
        }, fingerprint);

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

        // 注入 Headers 保护
        await page.evaluateOnNewDocument((fp) => {
            try {
                // 保护 Headers
                const originalHeaders = window.Headers;
                window.Headers = class extends originalHeaders {
                    constructor(init) {
                        super(init);
                        if (init && typeof init === 'object') {
                            // 确保所有请求头与 fingerprint 一致
                            const headers = {
                                'accept': fp.headers.accept,
                                'accept-language': fp.headers['accept-language'],
                                'origin': fp.headers.origin,
                                'referer': fp.headers.referer,
                                'sec-ch-ua': fp.headers['sec-ch-ua'],
                                'sec-ch-ua-mobile': fp.headers['sec-ch-ua-mobile'],
                                'sec-ch-ua-platform': fp.headers['sec-ch-ua-platform'],
                                'sec-fetch-dest': fp.headers['sec-fetch-dest'],
                                'sec-fetch-mode': fp.headers['sec-fetch-mode'],
                                'sec-fetch-site': fp.headers['sec-fetch-site'],
                                'user-agent': fp.browser.userAgent
                            };

                            // 应用默认请求头
                            for (const [key, value] of Object.entries(headers)) {
                                if (value) {
                                    super.set(key, value);
                                }
                            }

                            // 应用自定义请求头
                            for (const [key, value] of Object.entries(init)) {
                                if (!headers[key.toLowerCase()] && typeof value === 'string') {
                                    super.set(key, value);
                                }
                            }
                        }
                    }

                    append(name, value) {
                        const lowerName = name.toLowerCase();
                        // 保护关键请求头
                        if (lowerName === 'user-agent') {
                            super.append(name, fp.browser.userAgent);
                            return;
                        }
                        if (lowerName === 'accept-language') {
                            super.append(name, fp.browser.acceptLanguage);
                            return;
                        }
                        if (fp.headers[lowerName]) {
                            super.append(name, fp.headers[lowerName]);
                            return;
                        }
                        super.append(name, value);
                    }

                    set(name, value) {
                        const lowerName = name.toLowerCase();
                        // 保护关键请求头
                        if (lowerName === 'user-agent') {
                            super.set(name, fp.browser.userAgent);
                            return;
                        }
                        if (lowerName === 'accept-language') {
                            super.set(name, fp.browser.acceptLanguage);
                            return;
                        }
                        if (fp.headers[lowerName]) {
                            super.set(name, fp.headers[lowerName]);
                            return;
                        }
                        super.set(name, value);
                    }
                };

                // 保护 fetch
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    if (args[1] && args[1].headers) {
                        const headers = new Headers(args[1].headers);
                        args[1].headers = headers;
                    } else if (args[1]) {
                        // 如果没有设置 headers，添加默认 headers
                        args[1].headers = new Headers({});
                    } else {
                        // 如果没有设置 options，添加默认 options 和 headers
                        args[1] = { headers: new Headers({}) };
                    }
                    return originalFetch.apply(this, args);
                };

                // 保护 XMLHttpRequest
                const originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = class extends originalXHR {
                    constructor() {
                        super();
                        this._headers = new Headers({});
                    }

                    setRequestHeader(header, value) {
                        this._headers.set(header, value);
                        const lowerHeader = header.toLowerCase();
                        // 保护关键请求头
                        if (lowerHeader === 'user-agent') {
                            super.setRequestHeader(header, fp.browser.userAgent);
                            return;
                        }
                        if (lowerHeader === 'accept-language') {
                            super.setRequestHeader(header, fp.browser.acceptLanguage);
                            return;
                        }
                        if (fp.headers[lowerHeader]) {
                            super.setRequestHeader(header, fp.headers[lowerHeader]);
                            return;
                        }
                        super.setRequestHeader(header, value);
                    }

                    send(data) {
                        // 确保设置了所有必要的请求头
                        for (const [key, value] of Object.entries(fp.headers)) {
                            if (!this._headers.has(key)) {
                                super.setRequestHeader(key, value);
                            }
                        }
                        super.send(data);
                    }
                };

                // 修改 performance.now() 的精度
                const originalNow = window.performance.now;
                window.performance.now = function() {
                    return Math.floor(originalNow.call(performance) * 100) / 100;
                };
            } catch (e) {
                // 忽略错误，继续执行
            }
        }, fingerprint);

        // 注入 Storage 保护
        await page.evaluateOnNewDocument(() => {
            try {
                const storage = {
                    length: 0,
                    clear: function() {},
                    getItem: function() { return null; },
                    key: function() { return null; },
                    removeItem: function() {},
                    setItem: function() {}
                };

                Object.defineProperty(window, 'localStorage', {
                    value: storage,
                    configurable: true,
                    enumerable: true,
                    writable: true
                });

                Object.defineProperty(window, 'sessionStorage', {
                    value: storage,
                    configurable: true,
                    enumerable: true,
                    writable: true
                });
            } catch (e) {
                // 忽略错误，继续执行
            }
        });
    }

    /**
     * 使用CDP协议设置浏览器特征
     * @private
     */
    async #applyCDPOverrides(client, fingerprint) {
        try {
            await this.#setUserAgent(client, fingerprint);
            await this.#setLocale(client, fingerprint);
            await this.#setTimezone(client, fingerprint);
            await this.#setDeviceMetrics(client, fingerprint);
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
    async #setUserAgent(client, fingerprint) {
        await client.send('Network.setUserAgentOverride', {
            userAgent: fingerprint.browser.userAgent,
            acceptLanguage: fingerprint.browser.acceptLanguage,
            platform: fingerprint.browser.platform,
            userAgentMetadata: {
                brands: fingerprint.browser.brands,
                fullVersion: fingerprint.browser.version,
                platform: fingerprint.browser.platform,
                platformVersion: fingerprint.browser.platformVersion,
                architecture: fingerprint.browser.architecture,
                model: fingerprint.browser.model,
                mobile: fingerprint.browser.mobile,
                bitness: fingerprint.browser.bitness,
                wow64: fingerprint.browser.wow64
            }
        });

        // 设置一致的请求头
        await client.send('Network.setExtraHTTPHeaders', {
            headers: fingerprint.headers
        });
    }

    /**
     * 设置地区
     * @private
     */
    async #setLocale(client, fingerprint) {
        const [language, region] = fingerprint.browser.acceptLanguage.split('-');
        
        await client.send('Emulation.setLocaleOverride', {
            locale: fingerprint.browser.acceptLanguage
        }).catch(() => {});

        await client.send('Emulation.setLanguageEnvironment', {
            language,
            region
        }).catch(() => {});
    }

    /**
     * 设置时区
     * @private
     */
    async #setTimezone(client, fingerprint) {
        await client.send('Emulation.setTimezoneOverride', {
            timezoneId: fingerprint.timezone
        }).catch(() => {});
    }

    /**
     * 设置设备度量
     * @private
     */
    async #setDeviceMetrics(client, fingerprint) {
        await client.send('Emulation.setDeviceMetricsOverride', {
            width: fingerprint.device.screen.width,
            height: fingerprint.device.screen.height,
            deviceScaleFactor: fingerprint.device.screen.deviceScaleFactor,
            mobile: fingerprint.browser.mobile
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
     * 获取随机数组项
     * @private
     */
    #getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = FingerprintSimulator; 