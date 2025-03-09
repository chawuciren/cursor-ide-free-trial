const logger = require('./logger');
const FingerprintGenerator = require('./fingerprint-generator');

class FingerprintSimulator {
    constructor() {
        this.fingerprintGenerator = new FingerprintGenerator();
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
            await this.#applyCDPOverrides(client, fingerprint);
            await this.#applyEvaluateOverrides(page, fingerprint);

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
    async #applyCDPOverrides(client, fingerprint) {
        try {
            // 启用所有之前注释的配置
            await this.#cdpHideAutomationMark(client, fingerprint);
            await this.#cdpSetUserAgent(client, fingerprint);
            await this.#cdpSetLocale(client, fingerprint);
            await this.#cdpSetTimezone(client, fingerprint);
            await this.#cdpSetDeviceMetrics(client, fingerprint);
            await this.#cdpSetPerformanceMetrics(client, fingerprint);

        } catch (error) {
            logger.error('CDP覆盖设置失败:', error.message);
            logger.debug('CDP错误详情:', error);
            logger.warn('部分CDP配置失败，但将继续执行');
        }
    }

    /**
     * 使用evaluate设置指纹保护
     */
    async #applyEvaluateOverrides(page, fingerprint) {
        try {
            await this.#evaluateCleanWebDriverBypass(page);
            await this.#evaluateSetDeviceInfo(page, fingerprint);
            await this.#evaluateSetPluginInfo(page);
            await this.#evaluateInjectWebGLProtection(page);
            await this.#evaluateInjectCanvasProtection(page);
            await this.#evaluateInjectWebAudioProtection(page);
        } catch (error) {
            logger.error('evaluate设置指纹保护失败:', error.message);
            logger.debug('evaluate错误详情:', error);
            logger.warn('部分evaluate设置失败，但将继续执行');
        }
    }

    /**
     * 清理WebDriver绕过
     */
    async #evaluateCleanWebDriverBypass(page) {
        // 注入 WebDriver 保护
        await page.evaluateOnNewDocument(() => {

            // 清理自动化标记
            const protectedProps = [
                'webdriver', '_selenium', 'callSelenium', '_Selenium_IDE_Recorder',
                '__webdriver_evaluate', '__selenium_evaluate', '__webdriver_script_fn',
                '__webdriver_script_func', '__webdriver_script_function', '__webdriver',
                '__webdriver_unwrapped', '__webdriver_script_function', '$chrome_asyncScriptInfo',
                '$cdc_asdjflasutopfhvcZLmcfl_', 'cdc_adoQpoasnfa76pfcZLmcfl_Array',
                'cdc_adoQpoasnfa76pfcZLmcfl_Promise', 'cdc_adoQpoasnfa76pfcZLmcfl_Symbol',
                'cdc_adoQpoasnfa76pfcZLmcfl_', 'cdc_adoQpoasnfa76pfcZLmcfl_Object',
                'cdc_adoQpoasnfa76pfcZLmcfl_Proxy',
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
    }

    /**
     * 设置设备信息
     */
    async #evaluateSetDeviceInfo(page, fingerprint) {
        // 注入其他设备信息
        await page.evaluateOnNewDocument((fp) => {
            try {
                // 保护 performance.memory
                if (window.performance) {
                    // 创建一个只读的内存信息对象
                    const memoryInfo = {
                        jsHeapSizeLimit: 1024 * 1024 * 1024, // 1GB
                        totalJSHeapSize: Math.floor(1024 * 1024 * 1024 * 0.7), // ~700MB
                        usedJSHeapSize: Math.floor(1024 * 1024 * 1024 * 0.5), // ~500MB
                    };

                    // 保护 performance.memory
                    Object.defineProperty(window.performance, 'memory', {
                        get: () => memoryInfo,
                        configurable: false,
                        enumerable: true
                    });

                    // 保护内存信息不被修改
                    Object.freeze(memoryInfo);
                }

                // 保护 chrome.system.memory API (如果存在)
                if (window.chrome && window.chrome.system && window.chrome.system.memory) {
                    const originalGetInfo = window.chrome.system.memory.getInfo;
                    window.chrome.system.memory.getInfo = function(callback) {
                        callback({
                            availableCapacity: 1024 * 1024 * 1024, // 1GB
                            capacity: 1024 * 1024 * 1024 // 1GB
                        });
                    };
                }

                // 保护 process.getSystemMemoryInfo() (如果存在)
                if (window.process && typeof window.process.getSystemMemoryInfo === 'function') {
                    window.process.getSystemMemoryInfo = function() {
                        return {
                            total: 1024 * 1024 * 1024, // 1GB
                            free: Math.floor(1024 * 1024 * 1024 * 0.3), // ~300MB free
                            swapTotal: 0,
                            swapFree: 0
                        };
                    };
                }

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
    }

    /**
     * 设置插件信息
     */
    async #evaluateSetPluginInfo(page) {
        await page.evaluateOnNewDocument(() => {
            try {
                // 创建MimeType代理
                const createMimeTypeProxy = (mimeTypeData) => {
                    const mimeTypeProto = Object.getPrototypeOf(navigator.mimeTypes[0]);
                    
                    return new Proxy({
                        ...mimeTypeData,
                        __proto__: mimeTypeProto
                    }, {
                        get(target, prop) {
                            if (prop === 'enabledPlugin') {
                                return target.plugin;
                            }
                            return Reflect.get(target, prop);
                        },
                        getOwnPropertyDescriptor(target, prop) {
                            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
                            if (descriptor) {
                                descriptor.configurable = true;
                            }
                            return descriptor;
                        }
                    });
                };

                // 创建Plugin代理
                const createPluginProxy = (pluginData) => {
                    const pluginProto = Object.getPrototypeOf(navigator.plugins[0]);
                    
                    const plugin = {
                        ...pluginData,
                        __proto__: pluginProto
                    };

                    // 设置MimeType数组
                    pluginData.mimeTypes.forEach((mimeType, index) => {
                        const mimeTypeProxy = createMimeTypeProxy({
                            type: mimeType.type,
                            suffixes: mimeType.suffixes,
                            description: mimeType.description,
                            plugin: plugin
                        });

                        Object.defineProperty(plugin, index, {
                            value: mimeTypeProxy,
                            writable: false,
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(plugin, mimeType.type, {
                            value: mimeTypeProxy,
                            writable: false,
                            enumerable: false,
                            configurable: true
                        });
                    });

                    Object.defineProperty(plugin, 'length', {
                        value: pluginData.mimeTypes.length,
                        writable: false,
                        enumerable: true,
                        configurable: true
                    });

                    return new Proxy(plugin, {
                        get(target, prop) {
                            if (prop === 'namedItem') {
                                return function(name) {
                                    return target[name];
                                };
                            }
                            if (prop === 'item') {
                                return function(index) {
                                    return target[index];
                                };
                            }
                            return Reflect.get(target, prop);
                        },
                        getOwnPropertyDescriptor(target, prop) {
                            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
                            if (descriptor) {
                                descriptor.configurable = true;
                            }
                            return descriptor;
                        }
                    });
                };

                // 创建PluginArray代理
                const createPluginArrayProxy = () => {
                    const pluginArrayProto = Object.getPrototypeOf(navigator.plugins);
                    const plugins = [
                        {
                            name: 'Chrome PDF Plugin',
                            filename: 'internal-pdf-viewer',
                            description: 'Portable Document Format',
                            mimeTypes: [{
                                type: 'application/x-google-chrome-pdf',
                                suffixes: 'pdf',
                                description: 'Portable Document Format'
                            }]
                        },
                        {
                            name: 'Chrome PDF Viewer',
                            filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                            description: '',
                            mimeTypes: [{
                                type: 'application/pdf',
                                suffixes: 'pdf',
                                description: ''
                            }]
                        },
                        {
                            name: 'Native Client',
                            filename: 'internal-nacl-plugin',
                            description: '',
                            mimeTypes: [
                                {
                                    type: 'application/x-nacl',
                                    suffixes: '',
                                    description: 'Native Client Executable'
                                },
                                {
                                    type: 'application/x-pnacl',
                                    suffixes: '',
                                    description: 'Portable Native Client Executable'
                                }
                            ]
                        }
                    ];

                    const pluginArray = {
                        __proto__: pluginArrayProto
                    };

                    // 设置插件数组
                    plugins.forEach((pluginData, index) => {
                        const pluginProxy = createPluginProxy(pluginData);

                        Object.defineProperty(pluginArray, index, {
                            value: pluginProxy,
                            writable: false,
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(pluginArray, pluginData.name, {
                            value: pluginProxy,
                            writable: false,
                            enumerable: false,
                            configurable: true
                        });
                    });

                    Object.defineProperty(pluginArray, 'length', {
                        value: plugins.length,
                        writable: false,
                        enumerable: true,
                        configurable: true
                    });

                    return new Proxy(pluginArray, {
                        get(target, prop) {
                            if (prop === 'namedItem') {
                                return function(name) {
                                    return target[name];
                                };
                            }
                            if (prop === 'item') {
                                return function(index) {
                                    return target[index];
                                };
                            }
                            if (prop === 'refresh') {
                                return function() {};
                            }
                            return Reflect.get(target, prop);
                        },
                        getOwnPropertyDescriptor(target, prop) {
                            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
                            if (descriptor) {
                                descriptor.configurable = true;
                            }
                            return descriptor;
                        }
                    });
                };

                // 创建MimeTypeArray代理
                const createMimeTypeArrayProxy = (plugins) => {
                    const mimeTypeArrayProto = Object.getPrototypeOf(navigator.mimeTypes);
                    const mimeTypeArray = {
                        __proto__: mimeTypeArrayProto
                    };

                    let mimeTypes = [];
                    plugins.forEach(plugin => {
                        plugin.mimeTypes.forEach(mt => {
                            mimeTypes.push({
                                type: mt.type,
                                suffixes: mt.suffixes,
                                description: mt.description,
                                plugin: plugin
                            });
                        });
                    });

                    mimeTypes.forEach((mimeType, index) => {
                        const mimeTypeProxy = createMimeTypeProxy(mimeType);

                        Object.defineProperty(mimeTypeArray, index, {
                            value: mimeTypeProxy,
                            writable: false,
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(mimeTypeArray, mimeType.type, {
                            value: mimeTypeProxy,
                            writable: false,
                            enumerable: false,
                            configurable: true
                        });
                    });

                    Object.defineProperty(mimeTypeArray, 'length', {
                        value: mimeTypes.length,
                        writable: false,
                        enumerable: true,
                        configurable: true
                    });

                    return new Proxy(mimeTypeArray, {
                        get(target, prop) {
                            if (prop === 'namedItem') {
                                return function(name) {
                                    return target[name];
                                };
                            }
                            if (prop === 'item') {
                                return function(index) {
                                    return target[index];
                                };
                            }
                            return Reflect.get(target, prop);
                        },
                        getOwnPropertyDescriptor(target, prop) {
                            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
                            if (descriptor) {
                                descriptor.configurable = true;
                            }
                            return descriptor;
                        }
                    });
                };

                // 设置navigator.plugins和navigator.mimeTypes
                const pluginArrayProxy = createPluginArrayProxy();
                const mimeTypeArrayProxy = createMimeTypeArrayProxy(pluginArrayProxy);

                Object.defineProperty(Navigator.prototype, 'plugins', {
                    get: () => pluginArrayProxy,
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Navigator.prototype, 'mimeTypes', {
                    get: () => mimeTypeArrayProxy,
                    enumerable: true,
                    configurable: true
                });

            } catch (e) {
                // 忽略错误，继续执行
            }
        });
    }
    
    /**
     * 注入 WebGL
     */
    async #evaluateInjectWebGLProtection(page) {
        await page.evaluateOnNewDocument(() => {
            if (!window.WebGLRenderingContext) return;

            // 创建WebGL上下文代理
            const createWebGLProxy = (gl) => {
                const vendorInfo = {
                    [37445]: 'Google Inc. (NVIDIA)', // UNMASKED_VENDOR_WEBGL
                    [37446]: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)', // UNMASKED_RENDERER_WEBGL
                    [7936]: 'WebKit', // VENDOR
                    [7937]: 'WebKit WebGL', // RENDERER
                    [7938]: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)', // VERSION
                    [35724]: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)', // SHADING_LANGUAGE_VERSION
                    [3379]: 16384, // MAX_TEXTURE_SIZE
                    [3386]: 32, // MAX_VERTEX_ATTRIBS
                    [3410]: 8, // SUBPIXEL_BITS
                    [3411]: 8, // RED_BITS
                    [3412]: 8, // GREEN_BITS
                    [3413]: 8, // BLUE_BITS
                    [3414]: 8, // ALPHA_BITS
                    [3415]: 24, // DEPTH_BITS
                    [3416]: 8 // STENCIL_BITS
                };

                const debugInfo = {
                    UNMASKED_VENDOR_WEBGL: 37445,
                    UNMASKED_RENDERER_WEBGL: 37446
                };

                return new Proxy(gl, {
                    get(target, prop) {
                        if (prop === 'getParameter') {
                            return new Proxy(target.getParameter, {
                                apply(target, thisArg, args) {
                                    const param = args[0];
                                    if (param in vendorInfo) {
                                        return vendorInfo[param];
                                    }
                                    return Reflect.apply(target, thisArg, args);
                                }
                            });
                        }

                        if (prop === 'getExtension') {
                            return new Proxy(target.getExtension, {
                                apply(target, thisArg, args) {
                                    const name = args[0];
                                    if (name === 'WEBGL_debug_renderer_info') {
                                        return debugInfo;
                                    }
                                    return Reflect.apply(target, thisArg, args);
                                }
                            });
                        }

                        return Reflect.get(target, prop);
                    }
                });
            };

            // 创建Canvas元素代理
            const CanvasProxy = new Proxy(HTMLCanvasElement.prototype, {
                get(target, prop) {
                    if (prop === 'getContext') {
                        return new Proxy(target.getContext, {
                            apply(target, thisArg, args) {
                                const context = Reflect.apply(target, thisArg, args);
                                const contextType = args[0];
                                
                                if (context && (contextType === 'webgl' || contextType === 'experimental-webgl')) {
                                    return createWebGLProxy(context);
                                }
                                return context;
                            }
                        });
                    }
                    return Reflect.get(target, prop);
                }
            });

            // 保持原始原型引用
            const originalProto = HTMLCanvasElement.prototype;

            // 使用Object.defineProperty来设置代理
            Object.defineProperty(HTMLCanvasElement, 'prototype', {
                value: CanvasProxy,
                writable: false,
                enumerable: false,
                configurable: false
            });

            // 保持toString的一致性
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = new Proxy(originalToString, {
                apply(target, thisArg, args) {
                    if (thisArg === CanvasProxy.getContext) {
                        return Reflect.apply(target, originalProto.getContext, args);
                    }
                    return Reflect.apply(target, thisArg, args);
                }
            });

            // 保护WebGLRenderingContext原型
            const WebGLProto = WebGLRenderingContext.prototype;
            const WebGLProxyHandler = {
                get(target, prop) {
                    const value = Reflect.get(target, prop);
                    if (typeof value === 'function') {
                        return new Proxy(value, {
                            apply(target, thisArg, args) {
                                return Reflect.apply(target, thisArg, args);
                            }
                        });
                    }
                    return value;
                }
            };

            Object.defineProperty(WebGLRenderingContext, 'prototype', {
                value: new Proxy(WebGLProto, WebGLProxyHandler),
                writable: false,
                enumerable: false,
                configurable: false
            });
        });
    }

    /**
     * 注入 Canvas
     */
    async #evaluateInjectCanvasProtection(page) {
        await page.evaluateOnNewDocument(() => {
            const modifyPixel = (data) => {
                // 使用确定性的像素修改方法
                const noise = Math.sin(data.length) * 2 + 1;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.max(0, Math.min(255, data[i] + (noise % 1)));
                    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (noise % 1)));
                    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (noise % 1)));
                }
            };

            // 创建Context2D代理
            const createContext2DProxy = (context) => {
                return new Proxy(context, {
                    get(target, prop) {
                        if (prop === 'getImageData') {
                            return new Proxy(target.getImageData, {
                                apply(target, thisArg, args) {
                                    const imageData = Reflect.apply(target, thisArg, args);
                                    modifyPixel(imageData.data);
                                    return imageData;
                                }
                            });
                        }
                        return Reflect.get(target, prop);
                    }
                });
            };

            // 创建Canvas元素代理
            const CanvasProxy = new Proxy(HTMLCanvasElement.prototype, {
                get(target, prop) {
                    if (prop === 'getContext') {
                        return new Proxy(target.getContext, {
                            apply(target, thisArg, args) {
                                const context = Reflect.apply(target, thisArg, args);
                                if (context && args[0] === '2d') {
                                    return createContext2DProxy(context);
                                }
                                return context;
                            }
                        });
                    }
                    
                    if (prop === 'toDataURL') {
                        return new Proxy(target.toDataURL, {
                            apply(target, thisArg, args) {
                                const context = thisArg.getContext('2d');
                                if (context) {
                                    const imageData = context.getImageData(0, 0, thisArg.width, thisArg.height);
                                    modifyPixel(imageData.data);
                                    context.putImageData(imageData, 0, 0);
                                }
                                return Reflect.apply(target, thisArg, args);
                            }
                        });
                    }

                    if (prop === 'toBlob') {
                        return new Proxy(target.toBlob, {
                            apply(target, thisArg, args) {
                                const [callback, ...otherArgs] = args;
                                const context = thisArg.getContext('2d');
                                if (context) {
                                    const imageData = context.getImageData(0, 0, thisArg.width, thisArg.height);
                                    modifyPixel(imageData.data);
                                    context.putImageData(imageData, 0, 0);
                                }
                                return Reflect.apply(target, thisArg, [callback, ...otherArgs]);
                            }
                        });
                    }

                    return Reflect.get(target, prop);
                }
            });

            // 保持原始原型引用
            const originalProto = HTMLCanvasElement.prototype;

            // 使用Object.defineProperty来设置代理
            Object.defineProperty(HTMLCanvasElement, 'prototype', {
                value: CanvasProxy,
                writable: false,
                enumerable: false,
                configurable: false
            });

            // 保持toString的一致性
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = new Proxy(originalToString, {
                apply(target, thisArg, args) {
                    if (thisArg === CanvasProxy.getContext ||
                        thisArg === CanvasProxy.toDataURL ||
                        thisArg === CanvasProxy.toBlob) {
                        return Reflect.apply(target, originalProto[thisArg.name], args);
                    }
                    return Reflect.apply(target, thisArg, args);
                }
            });
        });
    }

    /**
     * 注入 Web Audio
     */
    async #evaluateInjectWebAudioProtection(page) {
        // 注入 Web Audio API 保护
        await page.evaluateOnNewDocument(() => {
            if (window.AudioContext || window.webkitAudioContext) {
                const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
                const AudioContextProxy = new Proxy(OriginalAudioContext, {
                    construct(target, args) {
                        const instance = Reflect.construct(target, args);
                        return createProxy(instance, 'AudioContext');
                    }
                });

                // 替换全局 AudioContext
                if (window.AudioContext) {
                    window.AudioContext = AudioContextProxy;
                }
                if (window.webkitAudioContext) {
                    window.webkitAudioContext = AudioContextProxy;
                }
            }
        });
    }

    /**
     * 设置隐藏一些自动化标记
     */
    async #cdpHideAutomationMark(client, fingerprint) {
        // 添加额外的 CDP 配置
        await client.send('Page.setBypassCSP', { enabled: true });
        await client.send('Network.setBypassServiceWorker', { bypass: true });
        await client.send('Emulation.setAutomationOverride', { enabled: false });
        await client.send('Performance.enable');

        // 禁用自动化标记
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: './downloads'
        });
    }

    /**
     * 设置用户代理
     * @private
     */
    async #cdpSetUserAgent(client, fingerprint) {
        const userAgentInfo = {
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
        };
        // 设置浏览器级别的 userAgent
        await client.send('Emulation.setUserAgentOverride', userAgentInfo);
        await client.send('Network.setUserAgentOverride', userAgentInfo);
    }

    /**
     * 设置地区
     * @private
     */
    async #cdpSetLocale(client, fingerprint) {
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
    async #cdpSetTimezone(client, fingerprint) {
        await client.send('Emulation.setTimezoneOverride', {
            timezoneId: fingerprint.timezone.id
        }).catch(() => {});
    }

    /**
     * 设置设备度量
     * @private
     */
    async #cdpSetDeviceMetrics(client, fingerprint) {
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
    async #cdpSetPerformanceMetrics(client, fingerprint) {
        // 设置CPU性能
        await client.send('Emulation.setCPUThrottlingRate', { 
            rate: 1 
        }).catch(() => {});

        // 启用网络
        await client.send('Network.enable').catch(() => {});

        // 设置网络条件
        await client.send('Network.emulateNetworkConditions', {
            offline: false,
            latency: fingerprint.network.rtt || 50,
            // 将 Mbps 转换为 bytes/s (1 Mbps = 131072 bytes/s)
            downloadThroughput: (fingerprint.network.downlink || 10) * 131072,
            uploadThroughput: ((fingerprint.network.downlink || 10) / 2) * 131072
        }).catch(() => {});
    }
}

module.exports = FingerprintSimulator; 