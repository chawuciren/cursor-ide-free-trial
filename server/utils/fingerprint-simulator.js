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
            await this.#cdpSetMemoryMetrics(client, fingerprint);
            await this.#cdpSetStorageMetrics(client, fingerprint);

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
            await this.#evaluateInjectWebGLProtection(page, fingerprint);
            await this.#evaluateInjectCanvasProtection(page, fingerprint);
            await this.#evaluateInjectWebAudioProtection(page, fingerprint);
            // 移除 JS 注入的存储保护，改用 CDP
            // await this.#evaluateInjectStorageProtection(page, fingerprint);
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
     * 注入 WebGL
     */
    async #evaluateInjectWebGLProtection(page, fingerprint) {
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
    async #evaluateInjectCanvasProtection(page, fingerprint) {
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
    async #evaluateInjectWebAudioProtection(page, fingerprint) {
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
     * 注入存储性能模拟
     * @private
     */
    async #evaluateInjectStorageProtection(page, fingerprint) {
        const storage = fingerprint.device.storage;
        
        // 1. 设置存储配额
        await page.evaluate((storageInfo) => {
            // 模拟 navigator.storage API
            if (navigator.storage) {
                const originalEstimate = navigator.storage.estimate;
                navigator.storage.estimate = async () => ({
                    quota: storageInfo.quota,
                    usage: storageInfo.usage,
                    persistent: storageInfo.persistent,
                    temporary: storageInfo.temporary
                });

                const originalPersist = navigator.storage.persist;
                navigator.storage.persist = async () => storageInfo.persistent;

                const originalPersisted = navigator.storage.persisted;
                navigator.storage.persisted = async () => storageInfo.persistent;
            }

            // 模拟 webkitRequestFileSystem API
            if (window.webkitRequestFileSystem) {
                const originalRequestFS = window.webkitRequestFileSystem;
                window.webkitRequestFileSystem = (type, size, successCallback, errorCallback) => {
                    // 模拟 I/O 延迟
                    setTimeout(() => {
                        if (size > storageInfo.quota) {
                            errorCallback(new Error('Quota exceeded'));
                            return;
                        }
                        originalRequestFS(type, size, successCallback, errorCallback);
                    }, storageInfo.ioTiming.seekLatencyMs + storageInfo.ioTiming.readLatencyMs);
                };
            }

            // 模拟 IndexedDB 性能
            if (window.indexedDB) {
                const originalIndexedDB = window.indexedDB;
                window.indexedDB = new Proxy(originalIndexedDB, {
                    get: (target, prop) => {
                        const original = target[prop];
                        if (typeof original === 'function') {
                            return new Proxy(original, {
                                apply: (target, thisArg, args) => {
                                    // 模拟 I/O 延迟
                                    return new Promise((resolve) => {
                                        setTimeout(() => {
                                            resolve(Reflect.apply(target, thisArg, args));
                                        }, storageInfo.ioTiming.readLatencyMs);
                                    });
                                }
                            });
                        }
                        return original;
                    }
                });
            }

            // 模拟 localStorage 和 sessionStorage 性能
            const createStorageProxy = (storage) => {
                return new Proxy(storage, {
                    get: (target, prop) => {
                        const original = target[prop];
                        if (typeof original === 'function') {
                            return new Proxy(original, {
                                apply: (target, thisArg, args) => {
                                    // 模拟 I/O 延迟
                                    const delay = prop === 'getItem' ? 
                                        storageInfo.ioTiming.readLatencyMs : 
                                        storageInfo.ioTiming.writeLatencyMs;
                                    
                                    return new Promise((resolve) => {
                                        setTimeout(() => {
                                            resolve(Reflect.apply(target, thisArg, args));
                                        }, delay);
                                    });
                                }
                            });
                        }
                        return original;
                    }
                });
            };

            if (window.localStorage) {
                window.localStorage = createStorageProxy(window.localStorage);
            }
            if (window.sessionStorage) {
                window.sessionStorage = createStorageProxy(window.sessionStorage);
            }

            // 模拟 File API 性能
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                const originalFileReader = window.FileReader;
                window.FileReader = class extends originalFileReader {
                    constructor() {
                        super();
                        const methods = ['readAsArrayBuffer', 'readAsBinaryString', 'readAsDataURL', 'readAsText'];
                        methods.forEach(method => {
                            const original = this[method];
                            this[method] = function(...args) {
                                setTimeout(() => {
                                    original.apply(this, args);
                                }, storageInfo.ioTiming.readLatencyMs);
                            };
                        });
                    }
                };
            }
        }, storage);

        // 2. 设置存储性能特征
        await page.evaluate((storageInfo) => {
            // 注入性能特征检测结果
            if (window.performance && window.performance.memory) {
                const originalNow = performance.now;
                performance.now = function() {
                    const baseTime = originalNow.call(performance);
                    // 根据存储类型添加特征性延迟
                    const storageLatency = storageInfo.ioTiming.readLatencyMs + 
                                         storageInfo.ioTiming.writeLatencyMs;
                    return baseTime + (Math.random() * storageLatency);
                };
            }
        }, storage);
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
        try {
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

        } catch (error) {
            logger.error('设置性能和硬件指标时出错:', error);
            // 继续执行，不中断流程
        }
    }

    /**
     * 设置内存相关指标
     * @private
     */
    async #cdpSetMemoryMetrics(client, fingerprint) {
        try {
            // 1. 设置设备内存
            await client.send('Emulation.setDeviceMemoryOverride', {
                deviceMemory: fingerprint.browser.deviceMemory
            }).catch(() => {});

            // 2. 注入性能内存对象
            await client.send('Runtime.evaluate', {
                expression: `
                    (() => {
                        // 保存原始的performance.memory
                        const originalMemory = performance.memory;
                        
                        // 创建新的memory对象
                        const memoryDescriptor = {
                            value: {
                                jsHeapSizeLimit: ${fingerprint.device.memory.jsHeapSizeLimit},
                                totalJSHeapSize: ${fingerprint.device.memory.totalJSHeapSize},
                                usedJSHeapSize: ${fingerprint.device.memory.usedJSHeapSize}
                            },
                            configurable: true,
                            enumerable: true,
                            writable: false
                        };

                        // 替换performance.memory
                        Object.defineProperty(performance, 'memory', memoryDescriptor);

                        // 保护memory对象不被修改
                        Object.freeze(performance.memory);
                    })();
                `,
                returnByValue: true
            }).catch(() => {});

            // 3. 设置WebAssembly内存限制
            await client.send('Runtime.evaluate', {
                expression: `
                    (() => {
                        const originalWebAssembly = WebAssembly;
                        const memoryLimit = ${fingerprint.browser.deviceMemory * 1024}; // 转换为MB

                        // 代理WebAssembly.Memory构造函数
                        const MemoryProxy = new Proxy(WebAssembly.Memory, {
                            construct(target, args) {
                                const [{ initial, maximum }] = args;
                                
                                // 确保内存限制合理
                                if (maximum && maximum > memoryLimit) {
                                    args[0].maximum = memoryLimit;
                                }
                                
                                return Reflect.construct(target, args);
                            }
                        });

                        // 替换WebAssembly.Memory
                        Object.defineProperty(WebAssembly, 'Memory', {
                            value: MemoryProxy,
                            writable: false,
                            configurable: false,
                            enumerable: true
                        });

                        // 保护WebAssembly对象
                        Object.freeze(WebAssembly);
                    })();
                `,
                returnByValue: true
            }).catch(() => {});

            // 4. 模拟内存压力（根据设备内存大小调整）
            if (fingerprint.browser.deviceMemory <= 4) {
                await client.send('Emulation.setAutomationOverride', { enabled: false });
                await client.send('Runtime.evaluate', {
                    expression: `
                        (() => {
                            // 模拟内存压力的函数
                            const simulateMemoryPressure = () => {
                                if (performance.memory) {
                                    // 随机波动已使用的堆内存
                                    const variation = Math.random() * 0.1; // 10%的随机波动
                                    performance.memory.usedJSHeapSize *= (1 + variation);
                                }
                            };

                            // 定期模拟内存压力
                            setInterval(simulateMemoryPressure, 5000);
                        })();
                    `,
                    returnByValue: true
                }).catch(() => {});
            }

        } catch (error) {
            logger.error('设置内存指标时出错:', error);
            // 继续执行，不中断流程
        }
    }

    /**
     * 设置存储相关指标
     * @private
     */
    async #cdpSetStorageMetrics(client, fingerprint) {
        const storage = fingerprint.device.storage;
        
        try {
            // 1. 启用存储域和性能域
            await client.send('Storage.enable');
            await client.send('Performance.enable');

            // 2. 设置存储模拟
            await client.send('Emulation.setHardwareConcurrencyOverride', {
                hardwareConcurrency: fingerprint.browser.hardwareConcurrency
            }).catch(() => {});

            // 3. 设置存储性能特征
            await client.send('Emulation.setPerformanceConfigurationOverride', {
                timeoutScale: this.#calculateTimeoutScale(storage),
                maxCPUSpeedRate: this.#calculateCPUSpeed(storage),
                hardwareProperties: {
                    'storage.type': storage.type,
                    'storage.quota': storage.quota,
                    'storage.speed': this.#calculateThroughput(storage),
                    'storage.latency': storage.ioTiming.readLatencyMs
                }
            }).catch(() => {});

            // 4. 设置配额和使用情况追踪
            await client.send('Storage.setQuotaOverride', {
                quotaSize: storage.quota
            }).catch(() => {});

            // 5. 设置存储估算
            await client.send('Storage.overrideEstimate', {
                quota: storage.quota,
                usage: storage.usage
            }).catch(() => {});

            // 6. 设置存储压力模拟
            await client.send('Storage.setPressureNotificationOverride', {
                pressure: storage.type === 'hdd' ? 'moderate' : 'none'
            }).catch(() => {});

            // 7. 设置文件系统API配额
            await client.send('Storage.overrideFileSystemQuota', {
                origin: '*',
                quota: storage.storageQuota,
                persistent: storage.persistent,
                temporary: storage.temporary
            }).catch(() => {});

            // 6. 设置 I/O 延迟模拟
            await client.send('Network.emulateNetworkConditions', {
                offline: false,
                latency: storage.ioTiming.seekLatencyMs,
                downloadThroughput: this.#calculateThroughput(storage),
                uploadThroughput: this.#calculateThroughput(storage) * 0.8  // 上传速度通常略低于下载速度
            }).catch(() => {});

            // 9. 设置存储性能配置文件
            await client.send('Emulation.setPerformanceProfile', {
                profile: this.#getStorageProfile(storage)
            }).catch(() => {});

            // 10. 设置虚拟时间环境（影响存储操作的时间戳）
            await client.send('Emulation.setVirtualTimePolicy', {
                policy: 'advance',
                budget: storage.ioTiming.readLatencyMs
            }).catch(() => {});

            // 9. 设置服务工作线程存储
            await client.send('Storage.setServiceWorkerOverride', {
                size: Math.floor(storage.quota * 0.05)  // Service Worker通常使用5%的配额
            }).catch(() => {});

            // 10. 设置清理策略
            await client.send('Storage.setClearDataOverride', {
                quotaOverride: storage.quota,
                usageOverride: storage.usage
            }).catch(() => {});

            logger.info('存储指标设置完成');

        } catch (error) {
            logger.error('设置存储指标时出错:', error);
            // 继续执行，不中断流程
        }
    }

    /**
     * 计算存储类型对应的超时比例
     * @private
     */
    #calculateTimeoutScale(storage) {
        switch (storage.type) {
            case 'nvme':
                return 0.8;  // NVMe更快，减少超时时间
            case 'ssd':
                return 1.0;  // SSD标准超时时间
            case 'hdd':
                return 1.5;  // HDD较慢，增加超时时间
            default:
                return 1.0;
        }
    }

    /**
     * 计算存储类型对应的CPU速度比例
     * @private
     */
    #calculateCPUSpeed(storage) {
        switch (storage.type) {
            case 'nvme':
                return 1.2;  // NVMe系统通常配置更高
            case 'ssd':
                return 1.0;  // SSD标准配置
            case 'hdd':
                return 0.8;  // HDD系统通常配置较低
            default:
                return 1.0;
        }
    }

    /**
     * 获取存储性能配置文件
     * @private
     */
    #getStorageProfile(storage) {
        switch (storage.type) {
            case 'nvme':
                return 'high-end-desktop';
            case 'ssd':
                return 'desktop';
            case 'hdd':
                return 'mobile';
            default:
                return 'desktop';
        }
    }

    /**
     * 根据存储类型计算吞吐量
     * @private
     */
    #calculateThroughput(storage) {
        // 根据存储类型返回典型的吞吐量 (bytes/s)
        const MB = 1024 * 1024;
        switch (storage.type) {
            case 'nvme':
                return 3500 * MB;  // ~3.5 GB/s
            case 'ssd':
                return 550 * MB;   // ~550 MB/s
            case 'hdd':
                return 120 * MB;   // ~120 MB/s
            default:
                return 250 * MB;   // 默认值
        }
    }
}

module.exports = FingerprintSimulator; 