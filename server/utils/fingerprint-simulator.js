const logger = require('./logger');

class FingerprintSimulator {
    #versions = {
        chrome: ['114.0.0.0', '115.0.0.0'],
        firefox: ['108', '109', '110', '111', '112'],
        safari: ['14.1.2', '15.0', '15.1', '15.2', '15.3']
    };

    #osVersions = {
        win: ['10.0', '11.0'],
        mac: ['10_15_7', '11_0_0', '12_0_0', '13_0_0'],
        linux: ['x86_64', 'aarch64']
    };

    #cpuArchitectures = [
        { arch: 'x86_64', bits: '64', wow64: false },
        { arch: 'amd64', bits: '64', wow64: false },
        { arch: 'x86', bits: '32', wow64: true },
        { arch: 'arm64', bits: '64', wow64: false },
        { arch: 'aarch64', bits: '64', wow64: false }
    ];

    #gpuVendors = [
        {
            vendor: 'Google Inc. (NVIDIA)',
            renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce GTX 1070/PCIe/SSE2'
        },
        {
            vendor: 'Google Inc. (NVIDIA)',
            renderer: 'ANGLE (NVIDIA, NVIDIA RTX 3080 Direct3D11 vs_5_0 ps_5_0)',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA RTX 3080/PCIe/SSE2'
        },
        {
            vendor: 'Google Inc. (AMD)',
            renderer: 'ANGLE (AMD, AMD Radeon RX 6800 XT Direct3D11 vs_5_0 ps_5_0)',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 6800 XT'
        },
        {
            vendor: 'Intel Inc.',
            renderer: 'Intel Iris Xe Graphics',
            webglVendor: 'Intel',
            webglRenderer: 'Intel(R) Iris(R) Xe Graphics'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)',
            webglVendor: 'Apple',
            webglRenderer: 'Apple M1 Pro'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M2 Max, OpenGL 4.1)',
            webglVendor: 'Apple',
            webglRenderer: 'Apple M2 Max'
        }
    ];

    #webglExtensions = [
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_color_buffer_half_float',
        'EXT_disjoint_timer_query',
        'EXT_float_blend',
        'EXT_frag_depth',
        'EXT_shader_texture_lod',
        'EXT_texture_compression_bptc',
        'EXT_texture_compression_rgtc',
        'EXT_texture_filter_anisotropic',
        'EXT_sRGB',
        'KHR_parallel_shader_compile',
        'OES_element_index_uint',
        'OES_fbo_render_mipmap',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_float_linear',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_color_buffer_float',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
        'WEBGL_lose_context',
        'WEBGL_multi_draw'
    ];

    #webglParameters = {
        'MAX_TEXTURE_SIZE': [4096, 8192, 16384],
        'MAX_VIEWPORT_DIMS': [[4096, 4096], [8192, 8192], [16384, 16384]],
        'MAX_VERTEX_ATTRIBS': [16],
        'MAX_VERTEX_UNIFORM_VECTORS': [4096],
        'MAX_VARYING_VECTORS': [30],
        'MAX_COMBINED_TEXTURE_IMAGE_UNITS': [32],
        'MAX_VERTEX_TEXTURE_IMAGE_UNITS': [16],
        'MAX_TEXTURE_IMAGE_UNITS': [16],
        'MAX_FRAGMENT_UNIFORM_VECTORS': [1024],
        'MAX_CUBE_MAP_TEXTURE_SIZE': [4096, 8192, 16384],
        'MAX_RENDERBUFFER_SIZE': [4096, 8192, 16384],
        'MAX_TEXTURE_MAX_ANISOTROPY_EXT': [8, 16]
    };

    #hardwareConcurrency = [4, 6, 8, 10, 12, 16, 24, 32];
    #deviceMemory = [0.25, 0.5, 1, 2, 4, 8];

    #languages = [
        ['en-US', 'en'],
        ['en-GB', 'en'],
        ['en-CA', 'en-GB', 'en'],
        ['zh-CN', 'zh'],
        ['zh-TW', 'zh-CN', 'zh']
    ];

    #screenResolutions = [
        { width: 1920, height: 1080 },
        { width: 2560, height: 1440 },
        { width: 3440, height: 1440 },
        { width: 3840, height: 2160 },
        { width: 1366, height: 768 },
        { width: 1536, height: 864 },
        { width: 1440, height: 900 },
        { width: 1280, height: 720 }
    ];

    #timezones = [
        'America/New_York',
        'America/Los_Angeles',
        'America/Chicago',
        'Europe/London',
        'Europe/Paris',
        'Asia/Shanghai',
        'Asia/Tokyo',
        'Australia/Sydney'
    ];

    /**
     * 获取随机数组项
     * @private
     */
    #getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 生成指纹数据
     * @returns {Object} 指纹数据
     */
    generateFingerprint() {
        // 随机选择CPU架构
        const cpu = this.#getRandomItem(this.#cpuArchitectures);
        
        // 随机选择GPU和WebGL信息
        const gpu = this.#getRandomItem(this.#gpuVendors);
        
        // 随机选择硬件配置 - 修改为固定值
        const hardwareConcurrency = this.#getRandomItem(this.#hardwareConcurrency);
        const deviceMemory = this.#getRandomItem(this.#deviceMemory); // 从预定义数组中随机选择
        
        // 随机选择屏幕分辨率
        const screen = this.#getRandomItem(this.#screenResolutions);
        
        // 随机选择WebGL参数
        const webglParams = {};
        for (const [param, values] of Object.entries(this.#webglParameters)) {
            webglParams[param] = this.#getRandomItem(values);
        }
        
        // 随机选择WebGL扩展子集
        const webglExtensions = [...this.#webglExtensions]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 5) + 20); // 随机选择20-25个扩展

        // 基础版本信息
        const chromeVersion = this.#getRandomItem(this.#versions.chrome);
        const majorVersion = chromeVersion.split('.')[0];
        const brandVersion = '8';
        const languages = this.#getRandomItem(this.#languages);

        // 构建 accept-language
        const acceptLanguage = languages.join(',') + ';q=0.9';

        // 定义 userAgent
        const userAgent = `Mozilla/5.0 (Windows NT 10.0; ${cpu.wow64 ? 'WOW64' : 'Win64'}; ${cpu.arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;

        // 构建字体列表 - 使用更完整的Windows默认字体
        const fontList = [
            'Arial', 'Arial Black', 'Arial Narrow', 'Bahnschrift', 'Calibri', 'Cambria', 
            'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel',
            'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 
            'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text',
            'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic',
            'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue',
            'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft YaHei', 'MingLiU-ExtB',
            'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI',
            'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script',
            'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic'
        ].sort();

        // 构建媒体设备
        const mediaDevices = {
            audioInputs: [
                { deviceId: 'default', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            audioOutputs: [
                { deviceId: 'default', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            videoInputs: []
        };

        // 构建插件和MIME类型
        const mimeTypes = [
            {
                type: 'application/pdf',
                suffixes: 'pdf',
                description: 'Portable Document Format'
            },
            {
                type: 'application/x-google-chrome-pdf',
                suffixes: 'pdf',
                description: 'Portable Document Format'
            },
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
        ];

        const plugins = [
            {
                name: 'Chrome PDF Plugin',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                mimeTypes: [mimeTypes[0]]
            },
            {
                name: 'Chrome PDF Viewer',
                filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                description: 'Portable Document Format',
                mimeTypes: [mimeTypes[1]]
            },
            {
                name: 'Native Client',
                filename: 'internal-nacl-plugin',
                description: '',
                mimeTypes: [mimeTypes[2], mimeTypes[3]]
            }
        ];

        // 构建语音列表
        const voices = [
            {
                voiceURI: 'Microsoft David - English (United States)',
                name: 'Microsoft David - English (United States)',
                lang: 'en-US',
                localService: true,
                default: true
            },
            {
                voiceURI: 'Microsoft Zira - English (United States)',
                name: 'Microsoft Zira - English (United States)',
                lang: 'en-US',
                localService: true,
                default: false
            }
        ];

        // 更新 WebGL 参数
        const webGLParams = {
            contextName: 'webgl',
            version: 'WebGL 1.0',
            shadingLanguageVersion: 'WebGL GLSL ES 1.0',
            vendor: gpu.webglVendor,
            renderer: gpu.webglRenderer,
            unmaskedVendor: gpu.webglVendor,
            unmaskedRenderer: gpu.webglRenderer,
            antialias: Math.random() > 0.5,
            angle: gpu.renderer.includes('ANGLE') ? gpu.renderer.split('ANGLE ')[1].slice(1, -1) : '',
            majorPerformanceCaveat: false,
            params: {
                antialias: Math.random() > 0.5,
                alpha: true,
                depth: true,
                failIfMajorPerformanceCaveat: false,
                powerPreference: 'high-performance',
                premultipliedAlpha: true,
                preserveDrawingBuffer: false,
                stencil: true,
                desynchronized: false,
                xrCompatible: false
            },
            extensions: webglExtensions,
            parameters: webglParams
        };

        // 构建 Canvas 参数
        const canvasParams = {
            textBaseline: 'alphabetic',
            textAlign: 'start',
            font: '14px Arial',
            fillStyle: '#000000',
            strokeStyle: '#000000',
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            miterLimit: 10,
            shadowBlur: 0,
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            globalAlpha: 1,
            globalCompositeOperation: 'source-over',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
            filter: 'none',
            direction: 'ltr',
            letterSpacing: '0px',
            fontKerning: 'auto',
            fontStretch: 'normal',
            fontVariantCaps: 'normal',
            textRendering: 'auto',
            wordSpacing: '0px'
        };

        return {
            // 浏览器信息
            browser: {
                version: chromeVersion,
                majorVersion,
                userAgent,
                brands: [
                    { brand: 'Google Chrome', version: majorVersion },
                    { brand: 'Not=A?Brand', version: brandVersion },
                    { brand: 'Chromium', version: majorVersion }
                ],
                acceptLanguage,
                languages,
                platform: 'Win32',
                platformVersion: '10.0.0',
                architecture: cpu.arch,
                bitness: cpu.bits,
                wow64: cpu.wow64,
                mobile: false,
                model: '',
                oscpu: 'Windows NT 10.0; Win64; x64',
                connectionRtt: 50,
                deviceMemory,
                hardwareConcurrency,
                maxTouchPoints: 0,
                pdfViewerEnabled: true
            },

            // 设备信息
            device: {
                screen: {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.width,
                    availHeight: screen.height - 40,
                    availTop: 0,
                    availLeft: 0,
                    colorDepth: 24,
                    pixelDepth: 24,
                    devicePixelRatio: 1,
                    orientation: {
                        type: 'landscape-primary',
                        angle: 0
                    },
                    isExtended: false
                },
                gpu: {
                    vendor: gpu.webglVendor,
                    renderer: gpu.webglRenderer
                },
                mediaDevices,
                plugins,
                mimeTypes,
                fonts: fontList,
                voices,
                webgl: webGLParams,
                canvas: canvasParams
            },

            // 网络信息
            network: {
                type: '4g',
                effectiveType: '4g',
                downlink: 10,
                downlinkMax: 10,
                rtt: 50,
                saveData: false,
                onchange: null
            },

            // 时区信息
            timezone: {
                id: this.#getRandomItem(this.#timezones),
                offset: -480
            },

            // 电池信息
            battery: {
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 1
            },

            // 位置信息
            location: {
                lng: 116.3883,  // 使用固定经度（北京）
                lat: 39.9289    // 使用固定纬度（北京）
            },

            // HTTP 头信息
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': acceptLanguage,
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'origin': 'https://abrahamjuliot.github.io',
                'pragma': 'no-cache',
                'referer': 'https://abrahamjuliot.github.io/',
                'sec-ch-ua': `"Google Chrome";v="${majorVersion}", "Not=A?Brand";v="${brandVersion}", "Chromium";v="${majorVersion}"`,
                'sec-ch-ua-arch': `"${cpu.arch}"`,
                'sec-ch-ua-bitness': `"${cpu.bits}"`,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-ch-ua-platform-version': '"10.0.0"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': userAgent
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
                        value: fp.browser.deviceMemory,
                        configurable: true,
                        enumerable: true
                    },
                    hardwareConcurrency: {
                        value: fp.browser.hardwareConcurrency,
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

        // 增强 Canvas 保护
        await page.evaluateOnNewDocument(() => {
            const modifyPixel = (data) => {
                // 使用确定性的像素修改方法
                const noise = Math.sin(data.length) * 2 + 1;
                for (let i = 0; i < data.length; i += 4) {
                    // 对所有通道添加微小的确定性噪声
                    data[i] = Math.max(0, Math.min(255, data[i] + (noise % 1))); // R
                    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (noise % 1))); // G
                    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (noise % 1))); // B
                    data[i + 3] = Math.max(0, Math.min(255, data[i + 3])); // 保持 Alpha 不变
                }
            };

            // 重写 getImageData
            const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function(x, y, width, height) {
                const imageData = originalGetImageData.call(this, x, y, width, height);
                modifyPixel(imageData.data);
                return imageData;
            };

            // 重写 toDataURL
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
                const context = this.getContext('2d');
                if (context) {
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    modifyPixel(imageData.data);
                    context.putImageData(imageData, 0, 0);
                }
                return originalToDataURL.call(this, type, quality);
            };

            // 重写 toBlob
            const originalToBlob = HTMLCanvasElement.prototype.toBlob;
            HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
                const context = this.getContext('2d');
                if (context) {
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    modifyPixel(imageData.data);
                    context.putImageData(imageData, 0, 0);
                }
                originalToBlob.call(this, callback, type, quality);
            };

            // 添加Canvas上下文获取保护
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                const context = originalGetContext.call(this, contextType, contextAttributes);
                if (context && contextType === '2d') {
                    // 确保Canvas上下文的属性设置正确
                    Object.defineProperties(context, {
                        imageSmoothingQuality: {
                            get: () => 'high',
                            set: () => {}
                        },
                        filter: {
                            get: () => 'none',
                            set: () => {}
                        },
                        direction: {
                            get: () => 'ltr',
                            set: () => {}
                        }
                    });
                }
                return context;
            };
        });

        // 注入 deviceMemory 保护
        await page.evaluateOnNewDocument((memory) => {
            try {
                Object.defineProperty(navigator, 'deviceMemory', {
                    value: memory,
                    configurable: false,
                    enumerable: true,
                    writable: false
                });
            } catch (e) {
                // 忽略错误
            }
        }, fingerprint.browser.deviceMemory);

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

        // 注入 Web Audio API 保护
        await page.evaluateOnNewDocument(() => {
            if (window.AudioContext || window.webkitAudioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
                const originalCreateBuffer = AudioContext.prototype.createBuffer;

                // 保护 AnalyserNode
                const AnalyserHandler = {
                    construct(target, args) {
                        const analyser = new target(...args);
                        return new Proxy(analyser, {
                            get(target, prop) {
                                const value = target[prop];
                                if (typeof value === 'function') {
                                    return function(...args) {
                                        // 处理特定方法
                                        switch(prop) {
                                            case 'getByteFrequencyData':
                                            case 'getFloatFrequencyData':
                                            case 'getByteTimeDomainData':
                                            case 'getFloatTimeDomainData':
                                                const result = value.apply(target, args);
                                                // 确保返回的是正确类型的数组
                                                if (args[0] instanceof Uint8Array || args[0] instanceof Float32Array) {
                                                    // 填充一些合理的数据
                                                    for (let i = 0; i < args[0].length; i++) {
                                                        args[0][i] = prop.includes('Frequency') ? 
                                                            Math.sin(i / 10) * 128 + 128 : // 频率数据
                                                            Math.sin(i / 10) * 127 + 127;  // 时域数据
                                                    }
                                                }
                                                return result;
                                        }
                                        return value.apply(target, args);
                                    };
                                }
                                // 处理特定属性
                                switch(prop) {
                                    case 'fftSize':
                                        return 2048;
                                    case 'frequencyBinCount':
                                        return 1024;
                                    case 'minDecibels':
                                        return -100;
                                    case 'maxDecibels':
                                        return -30;
                                    case 'smoothingTimeConstant':
                                        return 0.8;
                                    default:
                                        return value;
                                }
                            },
                            getOwnPropertyDescriptor(target, prop) {
                                const descriptor = Object.getOwnPropertyDescriptor(target, prop);
                                if (descriptor) {
                                    descriptor.configurable = true;
                                }
                                return descriptor;
                            }
                        });
                    }
                };

                // 保护 AudioBuffer
                const AudioBufferHandler = {
                    construct(target, args) {
                        const buffer = new target(...args);
                        return new Proxy(buffer, {
                            get(target, prop) {
                                const value = target[prop];
                                if (typeof value === 'function') {
                                    return function(...args) {
                                        switch(prop) {
                                            case 'getChannelData':
                                                const channelData = value.apply(target, args);
                                                // 返回一个代理的 Float32Array
                                                return new Proxy(channelData, {
                                                    get(target, prop) {
                                                        if (prop === 'length') return target.length;
                                                        if (!isNaN(prop)) {
                                                            // 为每个采样点生成一个确定性的值
                                                            return Math.sin(Number(prop) / 100) * 0.5;
                                                        }
                                                        return target[prop];
                                                    }
                                                });
                                            case 'copyFromChannel':
                                            case 'copyToChannel':
                                                return value.apply(target, args);
                                            default:
                                                return value.apply(target, args);
                                        }
                                    };
                                }
                                return value;
                            }
                        });
                    }
                };

                // 替换 createAnalyser
                AudioContext.prototype.createAnalyser = function() {
                    const analyser = originalCreateAnalyser.apply(this);
                    return new Proxy(analyser, AnalyserHandler);
                };

                // 替换 createBuffer
                AudioContext.prototype.createBuffer = function(...args) {
                    const buffer = originalCreateBuffer.apply(this, args);
                    return new Proxy(buffer, AudioBufferHandler);
                };

                // 修复 toString
                const audioProtos = [
                    window.AnalyserNode,
                    window.AudioBuffer,
                    window.AudioContext || window.webkitAudioContext
                ];

                audioProtos.forEach(proto => {
                    if (proto) {
                        for (const prop of Object.getOwnPropertyNames(proto.prototype)) {
                            const descriptor = Object.getOwnPropertyDescriptor(proto.prototype, prop);
                            if (descriptor && typeof descriptor.value === 'function') {
                                const original = descriptor.value;
                                descriptor.value = function(...args) {
                                    try {
                                        return original.apply(this, args);
                                    } catch (e) {
                                        // 返回一个合理的默认值
                                        return undefined;
                                    }
                                };
                                descriptor.value.toString = function() {
                                    return original.toString();
                                };
                                Object.defineProperty(proto.prototype, prop, descriptor);
                            }
                        }
                    }
                });
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
            timezoneId: fingerprint.timezone.id
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
}

module.exports = FingerprintSimulator; 