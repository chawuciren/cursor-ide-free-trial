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
            await this.#cdpSetWebGLAndGPU(client, fingerprint);
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
            await this.#evaluateInjectWebAudioProtection(page, fingerprint);
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
     * 注入增强的WebGL保护
     */
    async #evaluateInjectWebGLProtection(page, fingerprint) {
        const gpu = fingerprint.device.gpu;
        await page.evaluateOnNewDocument((gpu) => {
            try {
                // 保存原始的createElement方法
                const originalCreateElement = document.createElement.bind(document);
                
                // 重写createElement以在创建时注入我们的修改
                document.createElement = function(tagName) {
                    const element = originalCreateElement(tagName);
                    
                    if (tagName.toLowerCase() === 'canvas') {
                        const getContextProxy = function(contextType, contextAttributes) {
                            // 应用WebGL上下文属性
                            if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
                                contextAttributes = Object.assign({}, gpu.webgl.contextAttributes, contextAttributes || {});
                            }
                            
                            const ctx = element.getContext.call(this, contextType, contextAttributes);
                            if (!ctx) return null;
                            
                            if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
                                // 保存原始WebGL方法
                                const originalGetParameter = ctx.getParameter.bind(ctx);
                                const originalGetExtension = ctx.getExtension.bind(ctx);
                                const originalGetSupportedExtensions = ctx.getSupportedExtensions.bind(ctx);
                                
                                // 重写getParameter方法
                                ctx.getParameter = function(parameter) {
                                    // 使用从指纹生成器传入的参数
                                    if (parameter in gpu.webgl.parameters) {
                                        return gpu.webgl.parameters[parameter];
                                    }

                                    const result = originalGetParameter(parameter);
                                    return result;
                                };
                                
                                // 重写getExtension方法
                                ctx.getExtension = function(name) {
                                    if (name === 'WEBGL_debug_renderer_info') {
                                        const extension = originalGetExtension(name);
                                        if (!extension) return null;
                                        
                                        extension.UNMASKED_VENDOR_WEBGL = 37445;
                                        extension.UNMASKED_RENDERER_WEBGL = 37446;
                                        return extension;
                                    }
                                    return originalGetExtension(name);
                                };
                                
                                // 重写getSupportedExtensions方法
                                ctx.getSupportedExtensions = function() {
                                    // 使用从指纹生成器传入的扩展列表
                                    return gpu.webgl.extensions;
                                };
                            }
                            return ctx;
                        };

                        // 保持原始的函数属性
                        Object.defineProperties(getContextProxy, {
                            name: { value: 'getContext' },
                            length: { value: 2 }
                        });
                        
                        element.getContext = getContextProxy;
                    }
                    
                    return element;
                };

                // 保持原始createElement的属性
                Object.defineProperties(document.createElement, {
                    name: { value: 'createElement' },
                    length: { value: 1 }
                });

            } catch (error) {
                console.warn('WebGL protection initialization failed', error);
            }
        }, gpu);
    }

    /**
     * 注入增强的Canvas保护
     */
    async #evaluateInjectCanvasProtection(page, fingerprint) {
        await page.evaluateOnNewDocument(() => {
            // 保存原始方法
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            const originalToBlob = HTMLCanvasElement.prototype.toBlob;

            // 硬件特征模拟参数
            const hardwareCharacteristics = {
                antialiasing: Math.random() > 0.5,
                subpixelAccuracy: Math.random() * 0.3 + 0.7, // 0.7-1.0
                colorDepth: 8,
                renderingQuality: Math.random() * 0.2 + 0.8 // 0.8-1.0
            };

            // 模拟字体渲染差异
            const fontCharacteristics = {
                kerning: Math.random() * 0.2 - 0.1,        // -0.1 to 0.1
                letterSpacing: Math.random() * 0.1,        // 0 to 0.1
                baselineShift: Math.random() * 0.2 - 0.1   // -0.1 to 0.1
            };

            // 像素处理函数
            const processPixels = (imageData, renderingContext) => {
                const { data } = imageData;
                const noise = new Float32Array(3);
                
                // 生成基于画布内容的噪声
                const hash = Array.from(data).reduce((h, b) => (h * 31 + b) & 0xFFFFFFFF, 0);
                const seededRandom = () => {
                    const x = Math.sin(hash++ * 31.1234) * 10000;
                    return x - Math.floor(x);
                };

                // 应用硬件特征模拟
                for (let i = 0; i < data.length; i += 4) {
                    // 子像素渲染模拟
                    const subpixelOffset = seededRandom() * hardwareCharacteristics.subpixelAccuracy;
                    
                    // 应用抗锯齿效果
                    if (hardwareCharacteristics.antialiasing) {
                        const neighborInfluence = 0.1;
                        if (i > 0 && i < data.length - 4) {
                            data[i] = Math.round((data[i] * (1 - neighborInfluence) + 
                                            (data[i-4] + data[i+4]) * neighborInfluence / 2));
                            data[i+1] = Math.round((data[i+1] * (1 - neighborInfluence) + 
                                                (data[i-3] + data[i+5]) * neighborInfluence / 2));
                            data[i+2] = Math.round((data[i+2] * (1 - neighborInfluence) + 
                                                (data[i-2] + data[i+6]) * neighborInfluence / 2));
                        }
                    }

                    // 应用渲染质量特征
                    const qualityFactor = hardwareCharacteristics.renderingQuality + 
                                        (seededRandom() - 0.5) * 0.1;
                    
                    data[i] = Math.max(0, Math.min(255, Math.round(data[i] * qualityFactor + subpixelOffset)));
                    data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * qualityFactor)));
                    data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * qualityFactor - subpixelOffset)));
                    // Alpha通道保持不变
                }

                return imageData;
            };

            // 创建2D上下文代理
            const create2DContextProxy = (context) => {
                return new Proxy(context, {
                    get(target, prop) {
                        const value = target[prop];
                        
                        if (typeof value === 'function') {
                            return function(...args) {
                                // 处理文本渲染
                                if (prop === 'fillText' || prop === 'strokeText') {
                                    const [text, x, y, ...rest] = args;
                                    // 应用字体渲染特征
                                    const baselineOffset = y + fontCharacteristics.baselineShift;
                                    const letterSpacingValue = parseFloat(target.letterSpacing || 0) + 
                                                            fontCharacteristics.letterSpacing;
                                    
                                    target.letterSpacing = `${letterSpacingValue}px`;
                                    return value.call(target, text, x, baselineOffset, ...rest);
                                }
                                
                                // 处理图像数据操作
                                if (prop === 'getImageData') {
                                    const imageData = value.apply(target, args);
                                    return processPixels(imageData, target);
                                }
                                
                                return value.apply(target, args);
                            };
                        }
                        
                        return value;
                    }
                });
            };

            // 重写getContext方法
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                const ctx = originalGetContext.call(this, contextType, contextAttributes);
                if (!ctx) return null;

                if (contextType === '2d') {
                    return create2DContextProxy(ctx);
                }
                
                return ctx;
            };

            // 重写toDataURL方法
            HTMLCanvasElement.prototype.toDataURL = function(...args) {
                const context = this.getContext('2d');
                if (context) {
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    processPixels(imageData, context);
                    context.putImageData(imageData, 0, 0);
                }
                return originalToDataURL.apply(this, args);
            };

            // 重写toBlob方法
            HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
                const context = this.getContext('2d');
                if (context) {
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    processPixels(imageData, context);
                    context.putImageData(imageData, 0, 0);
                }
                return originalToBlob.call(this, callback, ...args);
            };
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
     * 设置 WebGL 和 GPU 相关配置
     * @private
     */
    async #cdpSetWebGLAndGPU(client, fingerprint) {
        const gpu = fingerprint.device.gpu;
        try {
            // 1. 设置 WebGL 参数
            await client.send('Browser.setWebGLOverride', {
                vendor: gpu.webgl.vendor,
                renderer: gpu.webgl.renderer,
                version: gpu.webgl.version,
                shadingLanguageVersion: gpu.webgl.shadingLanguageVersion,
                extensions: gpu.webgl.extensions,
                parameters: gpu.webgl.parameters
            }).catch(() => {});

            // 2. 设置 GPU 信息
            await client.send('Browser.setGPUInfo', {
                vendorId: this.#getGPUVendorId(gpu.webgl.vendor),
                deviceId: this.#getGPUDeviceId(gpu.webgl.renderer),
                vendorString: gpu.vendor,
                deviceString: gpu.renderer,
                driverVersion: this.#getGPUDriverVersion(gpu.webgl.renderer),
                driverDate: "",
                vulkanVersion: "1.3.0",
                machineModelName: "",
                machineModelVersion: "",
                glVersion: gpu.webgl.version,
                glslVersion: gpu.webgl.shadingLanguageVersion,
                capabilities: {
                    hasDualSourceBlending: true,
                    hasETC2TextureCompression: true,
                    hasS3TCTextureCompression: true,
                    hasASTCTextureCompression: true,
                    hasChromiumImageDecode: true,
                    hasChromiumImageResize: true,
                    maxTextureSize: gpu.webgl.parameters.MAX_TEXTURE_SIZE || 16384,
                    maxRenderBufferSize: gpu.webgl.parameters.MAX_RENDERBUFFER_SIZE || 16384,
                    max3DTextureSize: gpu.webgl.parameters.MAX_3D_TEXTURE_SIZE || 2048,
                    maxArrayTextureLayers: gpu.webgl.parameters.MAX_ARRAY_TEXTURE_LAYERS || 2048,
                    maxTextureFilterAnisotropy: gpu.webgl.parameters.MAX_TEXTURE_MAX_ANISOTROPY_EXT || 16,
                    vertexShaderBits: 32,
                    fragmentShaderBits: 32,
                    maxVaryingVectors: gpu.webgl.parameters.MAX_VARYING_VECTORS || 32,
                    maxVertexAttribs: gpu.webgl.parameters.MAX_VERTEX_ATTRIBS || 16,
                    maxVertexUniformVectors: gpu.webgl.parameters.MAX_VERTEX_UNIFORM_VECTORS || 4096,
                    maxFragmentUniformVectors: gpu.webgl.parameters.MAX_FRAGMENT_UNIFORM_VECTORS || 1024
                }
            }).catch(() => {});

            // 3. 设置 ANGLE 图形后端
            await client.send('Browser.setANGLEGraphicsBackend', {
                backendType: 'direct3d11',  // 或 'opengl', 'vulkan' 等
                enableFeatures: [
                    'depth_texture',
                    'draw_buffers',
                    'texture_float',
                    'texture_half_float',
                    'vertex_array_object'
                ]
            }).catch(() => {});

            // 4. 注入 WebGL 参数
            await client.send('Runtime.evaluate', {
                expression: `
                    (() => {
                        // 设置 WEBGL_debug_renderer_info 扩展的值
                        const originalGetExtension = WebGLRenderingContext.prototype.getExtension;
                        WebGLRenderingContext.prototype.getExtension = function(name) {
                            if (name === 'WEBGL_debug_renderer_info') {
                                return {
                                    UNMASKED_VENDOR_WEBGL: 37445,
                                    UNMASKED_RENDERER_WEBGL: 37446,
                                    get unmaskedVendor() { return '${gpu.webgl.vendor}' },
                                    get unmaskedRenderer() { return '${gpu.webgl.renderer}' }
                                };
                            }
                            return originalGetExtension.call(this, name);
                        };

                        // 设置 getParameter 的返回值
                        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
                        WebGLRenderingContext.prototype.getParameter = function(parameter) {
                            if (parameter === 37445) return '${gpu.vendor}';
                            if (parameter === 37446) return '${gpu.renderer}';
                            if (parameter === 7936) return '${gpu.webgl.vendor}';
                            if (parameter === 7937) return '${gpu.webgl.renderer}';
                            if (parameter === 7938) return '${gpu.webgl.version}';
                            if (parameter === 35724) return '${gpu.webgl.shadingLanguageVersion}';
                            return originalGetParameter.call(this, parameter);
                        };
                    })();
                `,
                returnByValue: true
            }).catch(() => {});

            // 5. 设置 WebGL 上下文属性
            await client.send('Runtime.evaluate', {
                expression: `
                    (() => {
                        const contextAttributes = {
                            alpha: true,
                            antialias: true,
                            depth: true,
                            desynchronized: false,
                            failIfMajorPerformanceCaveat: false,
                            powerPreference: 'high-performance',
                            premultipliedAlpha: true,
                            preserveDrawingBuffer: false,
                            stencil: true,
                            xrCompatible: false
                        };

                        // 设置默认的 WebGL 上下文属性
                        if (HTMLCanvasElement.prototype.getContext) {
                            const originalGetContext = HTMLCanvasElement.prototype.getContext;
                            HTMLCanvasElement.prototype.getContext = function(contextType, attrs) {
                                if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
                                    attrs = Object.assign({}, contextAttributes, attrs || {});
                                }
                                return originalGetContext.call(this, contextType, attrs);
                            };
                        }
                    })();
                `,
                returnByValue: true
            }).catch(() => {});

        } catch (error) {
            logger.error('设置 WebGL 和 GPU 配置时出错:', error);
            // 继续执行，不中断流程
        }
    }

    /**
     * 设置性能指标
     * @private
     */
    async #cdpSetPerformanceMetrics(client, fingerprint) {
        try {

            // 设置CPU性能配置
            await client.send('Emulation.setCPUThrottlingRate', { 
                rate: 1
            }).catch(() => {});

            // 设置CPU性能特征
            await client.send('Emulation.setPerformanceConfigurationOverride', {
                timeoutScale: 1,
                maxCPUSpeedRate: this.#calculateCPUSpeed(fingerprint.device.cpu),
                hardwareProperties: {
                    'cpu.cores': fingerprint.device.cpu.cores,
                    'cpu.threads': fingerprint.device.cpu.threads,
                    'cpu.architecture': fingerprint.device.cpu.architecture,
                    'cpu.vendor': fingerprint.device.cpu.vendor,
                    'cpu.model': fingerprint.device.cpu.model,
                    'cpu.speed': fingerprint.device.cpu.speed
                }
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

            // 设置性能指标收集
            await client.send('Performance.enable').catch(() => {});

            // 设置CPU配置文件
            await client.send('Emulation.setPerformanceProfile', {
                profile: this.#getCPUProfile(fingerprint.device.cpu)
            }).catch(() => {});

        } catch (error) {
            logger.error('设置性能和硬件指标时出错:', error);
            // 继续执行，不中断流程
        }
    }

    /**
     * 计算CPU速度比例
     * @private
     */
    #calculateCPUSpeed(cpu) {
        // 基于CPU型号和架构计算性能比例
        const baseSpeed = cpu.speed / 3000; // 标准化到3GHz
        const architectureMultiplier = cpu.architecture.includes('arm') ? 0.8 : 1.0;
        return baseSpeed * architectureMultiplier;
    }

    /**
     * 获取CPU性能配置文件
     * @private
     */
    #getCPUProfile(cpu) {
        if (cpu.cores >= 16) {
            return 'high-end-desktop';
        } else if (cpu.cores >= 8) {
            return 'desktop';
        } else if (cpu.cores >= 4) {
            return 'mobile';
        } else {
            return 'low-end-mobile';
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
            // 1. 启用性能域
            await client.send('Performance.enable');

            // 2. 设置存储性能特征
            await client.send('Emulation.setPerformanceConfigurationOverride', {
                timeoutScale: this.#calculateTimeoutScale(storage),
                maxCPUSpeedRate: this.#calculateCPUSpeed(fingerprint.device.cpu),
                hardwareProperties: {
                    'storage.type': storage.type,
                    'storage.quota': storage.quota,
                    'storage.speed': this.#calculateThroughput(storage),
                    'storage.latency': storage.ioTiming.readLatencyMs,
                    'storage.usage': storage.usage,
                    'storage.available': storage.estimatedAvailableSpace,
                    'storage.persistent': storage.persistent,
                    'storage.temporary': storage.temporary
                }
            }).catch(() => {});

            // 4. 设置性能配置文件
            await client.send('Emulation.setPerformanceProfile', {
                profile: this.#getStorageProfile(storage)
            }).catch(() => {});

            // 5. 注入存储API模拟
            await client.send('Runtime.evaluate', {
                expression: `
                    (() => {
                        if (navigator.storage) {
                            // 模拟 navigator.storage API
                            Object.defineProperty(navigator.storage, 'estimate', {
                                value: async () => ({
                                    quota: ${storage.quota},
                                    usage: ${storage.usage},
                                    usageDetails: {
                                        persistent: ${storage.persistent},
                                        temporary: ${storage.temporary}
                                    }
                                }),
                                configurable: true
                            });

                            // 模拟存储持久化
                            Object.defineProperty(navigator.storage, 'persist', {
                                value: async () => ${storage.persistent},
                                configurable: true
                            });

                            Object.defineProperty(navigator.storage, 'persisted', {
                                value: async () => ${storage.persistent},
                                configurable: true
                            });
                        }

                        // 模拟存储性能特征
                        if (window.performance) {
                            const originalNow = performance.now;
                            performance.now = function() {
                                const baseTime = originalNow.call(performance);
                                const storageLatency = ${storage.ioTiming.readLatencyMs} + 
                                                     ${storage.ioTiming.writeLatencyMs};
                                return baseTime + (Math.random() * storageLatency);
                            };
                        }

                        // 模拟 File System API 配额
                        if (window.webkitRequestFileSystem) {
                            const originalRequestFS = window.webkitRequestFileSystem;
                            window.webkitRequestFileSystem = function(type, size, ...args) {
                                const delay = ${storage.ioTiming.seekLatencyMs} + 
                                            ${storage.ioTiming.readLatencyMs};
                                setTimeout(() => {
                                    if (size > ${storage.quota}) {
                                        args[1](new Error('Quota exceeded'));
                                        return;
                                    }
                                    originalRequestFS.call(this, type, size, ...args);
                                }, delay);
                            };
                        }
                    })();
                `,
                returnByValue: true
            }).catch(() => {});

            // 6. 设置设备内存和性能指标
            await client.send('Emulation.setDeviceMetricsOverride', {
                width: 0,
                height: 0,
                deviceScaleFactor: 0,
                mobile: false,
                storage: {
                    type: storage.type,
                    quota: storage.quota,
                    usage: storage.usage,
                    available: storage.estimatedAvailableSpace,
                    persistent: storage.persistent,
                    temporary: storage.temporary
                }
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

    /**
     * 获取GPU供应商ID
     * @private
     */
    #getGPUVendorId(vendor) {
        const vendorIds = {
            'NVIDIA': '0x10DE',
            'AMD': '0x1002',
            'Intel': '0x8086',
            'Apple': '0x106B'
        };
        
        for (const [key, id] of Object.entries(vendorIds)) {
            if (vendor.includes(key)) {
                return id;
            }
        }
        return '0x0000';
    }

    /**
     * 获取GPU设备ID
     * @private
     */
    #getGPUDeviceId(renderer) {
        // 为不同的GPU型号分配特定的设备ID
        const deviceIds = {
            'RTX 4090': '0x2684',
            'RTX 3080': '0x2206',
            'RX 7900': '0x744C',
            'RX 6800': '0x73BF',
            'Iris Xe': '0x9A49',
            'M2 Max': '0x0010',
            'M1 Pro': '0x0008'
        };

        for (const [key, id] of Object.entries(deviceIds)) {
            if (renderer.includes(key)) {
                return id;
            }
        }
        return '0x0000';
    }

    /**
     * 获取GPU驱动版本
     * @private
     */
    #getGPUDriverVersion(renderer) {
        // 为不同的GPU生成合适的驱动版本
        if (renderer.includes('NVIDIA')) {
            return '546.33';  // NVIDIA最新驱动版本
        } else if (renderer.includes('AMD')) {
            return '23.12.1'; // AMD最新驱动版本
        } else if (renderer.includes('Intel')) {
            return '31.0.101.4575'; // Intel最新驱动版本
        } else if (renderer.includes('Apple')) {
            return '14.2.1';  // Apple系统版本
        }
        return '0.0.0';
    }
}

module.exports = FingerprintSimulator; 