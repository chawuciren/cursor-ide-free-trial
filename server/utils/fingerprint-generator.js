const logger = require('./logger');

/**
 * 浏览器指纹生成器
 * 负责生成随机但真实的浏览器指纹数据
 */
class FingerprintGenerator {
    static #instance;

    /**
     * 获取单例实例
     * @returns {FingerprintGenerator}
     */
    static getInstance() {
        if (!FingerprintGenerator.#instance) {
            FingerprintGenerator.#instance = new FingerprintGenerator();
        }
        return FingerprintGenerator.#instance;
    }

    /**
     * 私有构造函数，确保单例模式
     */
    constructor() {
        if (FingerprintGenerator.#instance) {
            return FingerprintGenerator.#instance;
        }
        FingerprintGenerator.#instance = this;
    }

    // 浏览器版本信息
    #versions = {
        chrome: ['114.0.0.0', '115.0.0.0', '116.0.0.0', '117.0.0.0', '118.0.0.0', '119.0.0.0'],
        firefox: ['108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119'],
        safari: ['14.1.2', '15.0', '15.1', '15.2', '15.3', '15.4', '16.0', '16.1', '16.2', '17.0']
    };

    // 操作系统版本信息
    #osVersions = {
        win: ['10.0', '11.0'],
        mac: ['10_15_7', '11_0_0', '12_0_0', '13_0_0', '14_0_0'],
        linux: ['x86_64', 'aarch64']
    };

    // CPU架构信息
    #cpuArchitectures = [
        {
            arch: 'x86_64',
            bits: '64',
            wow64: false,
            oscpu: 'Windows NT 10.0; Win64; x64',
            platform: 'Win32',
            platformVersion: '10.0.0',
            uaArchitecture: 'x64',
            cores: [4, 6, 8],
            threads: [8, 12, 16]
        },
        {
            arch: 'amd64',
            bits: '64',
            wow64: false,
            oscpu: 'Windows NT 10.0; Win64; AMD64',
            platform: 'Win32',
            platformVersion: '10.0.0',
            uaArchitecture: 'amd64',
            cores: [8, 12, 16],
            threads: [16, 24, 32]
        },
        {
            arch: 'x86',
            bits: '32',
            wow64: true,
            oscpu: 'Windows NT 10.0; WOW64',
            platform: 'Win32',
            platformVersion: '10.0.0',
            uaArchitecture: 'x86',
            cores: [2, 4],
            threads: [4, 8]
        },
        {
            arch: 'arm64',
            bits: '64',
            wow64: false,
            oscpu: 'Windows NT 10.0; Win64; ARM64',
            platform: 'Win32',
            platformVersion: '10.0.0',
            uaArchitecture: 'arm64',
            cores: [8, 10],
            threads: [8, 10]
        },
        {
            arch: 'aarch64',
            bits: '64',
            wow64: false,
            oscpu: 'Linux aarch64',
            platform: 'Linux aarch64',
            platformVersion: '5.15.0',
            uaArchitecture: 'aarch64',
            cores: [8, 12],
            threads: [8, 12]
        }
    ];

    // GPU供应商信息
    #gpuVendors = [
        {
            vendor: 'Google Inc. (NVIDIA)',
            renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D12 vs_5_0 ps_5_0)',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce RTX 4090/PCIe/SSE2',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Google Inc. (NVIDIA)',
            renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D12 vs_5_0 ps_5_0)',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce RTX 3080/PCIe/SSE2',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Google Inc. (AMD)',
            renderer: 'ANGLE (AMD, AMD Radeon RX 7900 XTX Direct3D12 vs_5_0 ps_5_0)',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 7900 XTX',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Google Inc. (AMD)',
            renderer: 'ANGLE (AMD, AMD Radeon RX 6800 XT Direct3D12 vs_5_0 ps_5_0)',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 6800 XT',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Intel Inc.',
            renderer: 'Intel Iris Xe Graphics',
            webglVendor: 'Intel',
            webglRenderer: 'Intel(R) Iris(R) Xe Graphics',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M2 Max, OpenGL 4.1)',
            webglVendor: 'Apple',
            webglRenderer: 'Apple M2 Max',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        },
        {
            vendor: 'Google Inc. (Apple)',
            renderer: 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)',
            webglVendor: 'Apple',
            webglRenderer: 'Apple M1 Pro',
            webglVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
            webglShadingLanguageVersion: 'WebGL GLSL ES 3.00'
        }
    ];

    // WebGL扩展列表
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

    // WebGL参数配置
    #webglParameters = {
        37445: null, // UNMASKED_VENDOR_WEBGL
        37446: null, // UNMASKED_RENDERER_WEBGL
        7936: null,  // VERSION
        7937: null,  // VENDOR
        7938: null,  // RENDERER
        35724: null, // SHADING_LANGUAGE_VERSION
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: [32, 48, 64],
        MAX_CUBE_MAP_TEXTURE_SIZE: [4096, 8192, 16384, 32768],
        MAX_FRAGMENT_UNIFORM_VECTORS: [512, 1024, 2048],
        MAX_RENDERBUFFER_SIZE: [4096, 8192, 16384, 32768],
        MAX_TEXTURE_IMAGE_UNITS: [16, 24, 32],
        MAX_TEXTURE_SIZE: [4096, 8192, 16384, 32768],
        MAX_VARYING_VECTORS: [30, 32],
        MAX_VERTEX_ATTRIBS: [16, 32],
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: [16, 24, 32],
        MAX_VERTEX_UNIFORM_VECTORS: [2048, 4096, 8192],
        MAX_VIEWPORT_DIMS: [[4096, 4096], [8192, 8192], [16384, 16384], [32768, 32768]],
        ALIASED_LINE_WIDTH_RANGE: [[1, 1]],
        ALIASED_POINT_SIZE_RANGE: [[1, 512], [1, 1024], [1, 2048]],
        RED_BITS: [8],
        GREEN_BITS: [8],
        BLUE_BITS: [8],
        ALPHA_BITS: [8],
        DEPTH_BITS: [24],
        STENCIL_BITS: [8],
        MAX_3D_TEXTURE_SIZE: [2048, 4096, 8192],
        MAX_ELEMENTS_VERTICES: [1048576],
        MAX_ELEMENTS_INDICES: [1048576],
        MAX_TEXTURE_MAX_ANISOTROPY_EXT: [8, 16],
        MAX_DRAW_BUFFERS_WEBGL: [8, 16],
        MAX_COLOR_ATTACHMENTS_WEBGL: [8, 16],
        MAX_ARRAY_TEXTURE_LAYERS: [2048, 4096]
    };

    // WebGL上下文属性配置
    #webglContextAttributes = {
        alpha: [true],
        antialias: [true, false],
        depth: [true],
        desynchronized: [false],
        failIfMajorPerformanceCaveat: [false],
        powerPreference: ['high-performance', 'default', 'low-power'],
        premultipliedAlpha: [true],
        preserveDrawingBuffer: [false],
        stencil: [true],
        xrCompatible: [false]
    };

    // 硬件配置信息
    #hardwareConcurrency = [4, 6, 8, 10, 12, 16, 24, 32, 48, 64];
    #deviceMemory = [0.25, 0.5, 1, 2, 4, 8];  // Chrome允许的标准值
    #memoryInfo = {
        '0.25': [
            { jsHeapSizeLimit: 543162368, totalJSHeapSize: 203162368, usedJSHeapSize: 180266368 }
        ],
        '0.5': [
            { jsHeapSizeLimit: 1086324736, totalJSHeapSize: 486324736, usedJSHeapSize: 380532736 }
        ],
        '1': [
            { jsHeapSizeLimit: 2172649472, totalJSHeapSize: 872649472, usedJSHeapSize: 650266368 }
        ],
        '2': [
            { jsHeapSizeLimit: 2172649472, totalJSHeapSize: 1172649472, usedJSHeapSize: 950266368 },
            { jsHeapSizeLimit: 2172649472, totalJSHeapSize: 1372649472, usedJSHeapSize: 1150266368 }
        ],
        '4': [
            { jsHeapSizeLimit: 4294705152, totalJSHeapSize: 2172649472, usedJSHeapSize: 1750266368 },
            { jsHeapSizeLimit: 4294705152, totalJSHeapSize: 2572649472, usedJSHeapSize: 2050266368 }
        ],
        '8': [
            { jsHeapSizeLimit: 8589410304, totalJSHeapSize: 4345298944, usedJSHeapSize: 3500532736 },
            { jsHeapSizeLimit: 8589410304, totalJSHeapSize: 5345298944, usedJSHeapSize: 4500532736 }
        ]
    };

    // 存储配置信息
    #storageInfo = [
        // HDD配置
        {
            type: 'hdd',
            quota: 1024 * 1024 * 1024 * 500, // 500GB
            usage: 1024 * 1024 * 1024 * 350,  // 350GB
            persistent: true,
            temporary: false,
            syncable: true,
            estimatedAvailableSpace: 1024 * 1024 * 1024 * 150, // 150GB
            storageQuota: 1024 * 1024 * 1024 * 1024, // 1TB
            ioTiming: {
                readLatencyMs: 8,      // HDD典型读取延迟
                writeLatencyMs: 10,    // HDD典型写入延迟
                seekLatencyMs: 15      // HDD典型寻道延迟
            }
        },
        // SSD配置
        {
            type: 'ssd',
            quota: 1024 * 1024 * 1024 * 1000, // 1TB
            usage: 1024 * 1024 * 1024 * 600,  // 600GB
            persistent: true,
            temporary: false,
            syncable: true,
            estimatedAvailableSpace: 1024 * 1024 * 1024 * 400, // 400GB
            storageQuota: 1024 * 1024 * 1024 * 2048, // 2TB
            ioTiming: {
                readLatencyMs: 0.1,    // SSD典型读取延迟
                writeLatencyMs: 0.2,   // SSD典型写入延迟
                seekLatencyMs: 0.1     // SSD无寻道延迟
            }
        },
        // NVMe配置
        {
            type: 'nvme',
            quota: 1024 * 1024 * 1024 * 2000, // 2TB
            usage: 1024 * 1024 * 1024 * 1200, // 1.2TB
            persistent: true,
            temporary: false,
            syncable: true,
            estimatedAvailableSpace: 1024 * 1024 * 1024 * 800, // 800GB
            storageQuota: 1024 * 1024 * 1024 * 4096, // 4TB
            ioTiming: {
                readLatencyMs: 0.02,   // NVMe典型读取延迟
                writeLatencyMs: 0.04,  // NVMe典型写入延迟
                seekLatencyMs: 0.01    // NVMe无寻道延迟
            }
        }
    ];

    // 语言配置
    #languages = [
        ['en-US', 'en'],
        ['en-GB', 'en'],
        ['en-CA', 'en-GB', 'en'],
        ['zh-CN', 'zh'],
        ['zh-TW', 'zh-CN', 'zh'],
        ['ja-JP', 'ja'],
        ['ko-KR', 'ko'],
        ['fr-FR', 'fr'],
        ['de-DE', 'de'],
        ['es-ES', 'es'],
        ['it-IT', 'it'],
        ['ru-RU', 'ru']
    ];

    // 屏幕分辨率配置
    #screenResolutions = [
        { width: 1920, height: 1080 },
        { width: 2560, height: 1440 },
        { width: 3440, height: 1440 },
        { width: 3840, height: 2160 },
        { width: 1366, height: 768 },
        { width: 1536, height: 864 },
        { width: 1440, height: 900 },
        { width: 1280, height: 720 },
        { width: 3840, height: 1600 },
        { width: 5120, height: 1440 },
        { width: 7680, height: 4320 }
    ];

    // 时区配置
    #timezones = [
        'America/New_York',
        'America/Los_Angeles',
        'America/Chicago',
        'Europe/London',
        'Europe/Paris',
        'Asia/Shanghai',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Europe/Berlin',
        'Asia/Singapore',
        'America/Toronto',
        'Europe/Moscow'
    ];

    // 网络配置信息
    #networkConfigs = [
        {
            type: '4g',
            effectiveType: '4g',
            downlink: [20, 25, 30, 35, 40],
            downlinkMax: [100, 150, 200],
            rtt: [35, 40, 45, 50],
            saveData: false
        },
        {
            type: '5g',
            effectiveType: '4g',
            downlink: [50, 100, 150, 200],
            downlinkMax: [500, 1000, 2000],
            rtt: [10, 15, 20, 25],
            saveData: false
        },
        {
            type: 'wifi',
            effectiveType: '4g',
            downlink: [15, 20, 25, 30],
            downlinkMax: [50, 100, 150],
            rtt: [20, 25, 30, 35],
            saveData: false
        },
        {
            type: 'ethernet',
            effectiveType: '4g',
            downlink: [80, 100, 150, 200],
            downlinkMax: [1000, 2000, 10000],
            rtt: [1, 2, 3, 5],
            saveData: false
        }
    ];

    // 媒体设备配置
    #mediaDeviceConfigs = {
        basic: {
            audioInputs: [
                { deviceId: 'default', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            audioOutputs: [
                { deviceId: 'default', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            videoInputs: []
        },
        gaming: {
            audioInputs: [
                { deviceId: 'default', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'microphone', kind: 'audioinput', label: 'Gaming Headset Microphone', groupId: 'a9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            audioOutputs: [
                { deviceId: 'default', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'speakers', kind: 'audiooutput', label: 'Gaming Headset', groupId: 'a9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            videoInputs: []
        },
        office: {
            audioInputs: [
                { deviceId: 'default', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'microphone', kind: 'audioinput', label: 'Conference Microphone', groupId: 'b9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            audioOutputs: [
                { deviceId: 'default', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'speakers', kind: 'audiooutput', label: 'Conference Speakers', groupId: 'b9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            videoInputs: [
                { deviceId: 'webcam', kind: 'videoinput', label: 'Conference Camera', groupId: 'b9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ]
        },
        streaming: {
            audioInputs: [
                { deviceId: 'default', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audioinput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'microphone1', kind: 'audioinput', label: 'Streaming Microphone', groupId: 'c9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'microphone2', kind: 'audioinput', label: 'Secondary Microphone', groupId: 'd9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            audioOutputs: [
                { deviceId: 'default', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'communications', kind: 'audiooutput', label: '', groupId: '89738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'speakers1', kind: 'audiooutput', label: 'Studio Monitors', groupId: 'c9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'speakers2', kind: 'audiooutput', label: 'Stream Output', groupId: 'd9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ],
            videoInputs: [
                { deviceId: 'camera1', kind: 'videoinput', label: 'Streaming Camera', groupId: 'c9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' },
                { deviceId: 'camera2', kind: 'videoinput', label: 'Secondary Camera', groupId: 'd9738d45bb1ea4d3bf8c6644d9f8c45a6a37c666c5a40e48d189c06be4c32a48' }
            ]
        }
    };

    // 语音配置
    #voices = [
        {
            default: true,
            lang: "en-US",
            localService: true,
            name: "Microsoft David - English (United States)",
            voiceURI: "Microsoft David - English (United States)"
        },
        {
            default: false,
            lang: "en-US",
            localService: true,
            name: "Microsoft Zira - English (United States)",
            voiceURI: "Microsoft Zira - English (United States)"
        },
        {
            default: false,
            lang: "en-GB",
            localService: true,
            name: "Microsoft Hazel - English (United Kingdom)",
            voiceURI: "Microsoft Hazel - English (United Kingdom)"
        }
    ];

    // 字体列表
    #fontList = [
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
    ];

    // Canvas参数配置
    #canvasParams = {
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

    // 音频上下文参数配置
    #audioContextParams = {
        sampleRate: [44100, 48000],
        channelCount: [2, 4, 6, 8],
        latencyHint: ['interactive', 'playback', 'balanced'],
        state: ['suspended', 'running', 'closed'],
        baseLatency: [0.0029, 0.0058, 0.0116],
        outputLatency: [0.04, 0.08, 0.16],
        maxChannelCount: [2, 4, 6, 8],
        numberOfInputs: [1],
        numberOfOutputs: [1],
        channelCountMode: ['max', 'clamped-max', 'explicit'],
        channelInterpretation: ['speakers', 'discrete']
    };

    /**
     * 获取随机数组项
     * @private
     * @param {Array} array 数组
     * @returns {*} 随机项
     */
    #getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 生成指纹数据
     * @returns {Object} 指纹数据
     */
    generateFingerprint() {
        try {
            logger.info('开始生成浏览器指纹...');

            // 随机选择CPU架构和核心数
            const cpu = this.#getRandomItem(this.#cpuArchitectures);
            const cpuCores = this.#getRandomItem(cpu.cores);
            const cpuThreads = this.#getRandomItem(cpu.threads);
            
            // 随机选择GPU和WebGL信息
            const gpu = this.#getRandomItem(this.#gpuVendors);
            
            // 随机选择硬件配置
            const hardwareConcurrency = cpuThreads;
            const deviceMemory = this.#getRandomItem(this.#deviceMemory);
            const memoryInfo = this.#getRandomItem(this.#memoryInfo[deviceMemory.toString()]);
            
            // 随机选择屏幕分辨率
            const screen = this.#getRandomItem(this.#screenResolutions);
            
            // 随机选择WebGL参数
            const webglParams = {};
            for (const [param, values] of Object.entries(this.#webglParameters)) {
                // 处理特殊参数
                if (param === '37445') webglParams[param] = gpu.vendor;
                else if (param === '37446') webglParams[param] = gpu.renderer;
                else if (param === '7936') webglParams[param] = gpu.webglVersion;
                else if (param === '7937') webglParams[param] = gpu.webglVendor;
                else if (param === '7938') webglParams[param] = gpu.webglRenderer;
                else if (param === '35724') webglParams[param] = gpu.webglShadingLanguageVersion;
                else webglParams[param] = this.#getRandomItem(values);
            }

            // 随机选择WebGL上下文属性
            const contextAttributes = {};
            for (const [attr, values] of Object.entries(this.#webglContextAttributes)) {
                contextAttributes[attr] = this.#getRandomItem(values);
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

            // 确定设备类型和型号
            const deviceTypes = {
                desktop: {
                    models: ['Windows PC', 'iMac', 'Mac Pro', 'Linux Desktop'],
                    mobile: false
                },
                laptop: {
                    models: ['MacBook Pro', 'MacBook Air', 'ThinkPad X1', 'Dell XPS', 'HP Spectre'],
                    mobile: false
                },
                tablet: {
                    models: ['iPad Pro', 'Surface Pro', 'Galaxy Tab S8'],
                    mobile: true
                },
                phone: {
                    models: ['iPhone', 'Pixel', 'Galaxy S23'],
                    mobile: true
                }
            };

            // 根据CPU架构和性能选择设备类型
            let deviceType;
            if (cpu.arch.includes('arm')) {
                deviceType = cpu.cores >= 8 ? 'tablet' : 'phone';
            } else {
                deviceType = cpu.cores >= 8 ? 'desktop' : 'laptop';
            }

            const device = deviceTypes[deviceType];
            const model = this.#getRandomItem(device.models);
            const isMobile = device.mobile;

            // 定义 userAgent
            const userAgent = `Mozilla/5.0 (Windows NT 10.0; ${cpu.wow64 ? 'WOW64' : 'Win64'}; ${cpu.arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;

            // 随机选择时区
            const timezone = this.#getRandomItem(this.#timezones);

            // 随机生成位置信息
            const location = {
                lng: 116.3883 + (Math.random() - 0.5) * 0.1,  // 在北京周围随机
                lat: 39.9289 + (Math.random() - 0.5) * 0.1    // 在北京周围随机
            };

            // 随机生成电池信息
            const battery = {
                charging: Math.random() > 0.3,
                chargingTime: Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 3600),
                dischargingTime: Math.random() > 0.3 ? Infinity : Math.floor(Math.random() * 7200),
                level: Math.random()
            };

            // 随机选择音频上下文参数
            const audioContext = {
                sampleRate: this.#getRandomItem(this.#audioContextParams.sampleRate),
                channelCount: this.#getRandomItem(this.#audioContextParams.channelCount),
                latencyHint: this.#getRandomItem(this.#audioContextParams.latencyHint),
                state: this.#getRandomItem(this.#audioContextParams.state),
                baseLatency: this.#getRandomItem(this.#audioContextParams.baseLatency),
                outputLatency: this.#getRandomItem(this.#audioContextParams.outputLatency),
                maxChannelCount: this.#getRandomItem(this.#audioContextParams.maxChannelCount),
                numberOfInputs: this.#getRandomItem(this.#audioContextParams.numberOfInputs),
                numberOfOutputs: this.#getRandomItem(this.#audioContextParams.numberOfOutputs),
                channelCountMode: this.#getRandomItem(this.#audioContextParams.channelCountMode),
                channelInterpretation: this.#getRandomItem(this.#audioContextParams.channelInterpretation)
            };
            
            // 随机选择存储配置
            const storage = this.#getRandomItem(this.#storageInfo);

            // 随机选择网络配置
            const networkConfig = this.#getRandomItem(this.#networkConfigs);
            const network = {
                type: networkConfig.type,
                effectiveType: networkConfig.effectiveType,
                downlink: this.#getRandomItem(networkConfig.downlink),
                downlinkMax: this.#getRandomItem(networkConfig.downlinkMax),
                rtt: this.#getRandomItem(networkConfig.rtt),
                saveData: networkConfig.saveData
            };

            // 随机选择媒体设备配置
            const mediaDevices = this.#getRandomItem(Object.values(this.#mediaDeviceConfigs));

            const fingerprint = {
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
                    platform: cpu.platform,
                    platformVersion: cpu.platformVersion,
                    architecture: cpu.arch,
                    bitness: cpu.bits,
                    wow64: cpu.wow64,
                    oscpu: cpu.oscpu,
                    connectionRtt: 50,
                    deviceMemory,
                    hardwareConcurrency,
                    maxTouchPoints: isMobile ? 5 : 0,
                    pdfViewerEnabled: true,
                    vendor: 'Google Inc.',
                    vendorSub: '',
                    productSub: '20030107',
                    cookieEnabled: true,
                    doNotTrack: null,
                    webdriver: false,
                    mobile: isMobile,
                    model: model
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
                        vendor: gpu.vendor,
                        renderer: gpu.renderer,
                        webgl: {
                            vendor: gpu.webglVendor,
                            renderer: gpu.webglRenderer,
                            version: gpu.webglVersion,
                            shadingLanguageVersion: gpu.webglShadingLanguageVersion,
                            extensions: webglExtensions,
                            parameters: webglParams,
                            contextAttributes: contextAttributes
                        }
                    },
                    mediaDevices: mediaDevices,
                    fonts: this.#fontList,
                    voices: this.#voices,
                    canvas: this.#canvasParams,
                    audio: audioContext,
                    memory: memoryInfo,
                    storage: {
                        type: storage.type,
                        quota: storage.quota,
                        usage: storage.usage,
                        persistent: storage.persistent,
                        temporary: storage.temporary,
                        syncable: storage.syncable,
                        estimatedAvailableSpace: storage.estimatedAvailableSpace,
                        storageQuota: storage.storageQuota,
                        ioTiming: storage.ioTiming
                    },
                    cpu: {
                        architecture: cpu.arch,
                        cores: cpuCores,
                        threads: cpuThreads,
                        vendor: cpu.arch.includes('arm') ? 'ARM' : 'GenuineIntel',
                        model: cpu.arch.includes('arm') ? 'ARMv8' : 'Intel(R) Core(TM) i7-10700K',
                        speed: cpu.arch.includes('arm') ? 2400 : 3800
                    }
                },

                // 网络信息
                network,

                // 时区信息
                timezone: {
                    id: timezone,
                    offset: -480
                },

                // 电池信息
                battery,

                // 位置信息
                location
            };

            logger.info('浏览器指纹生成完成');
            return fingerprint;

        } catch (error) {
            logger.error('生成浏览器指纹时出错:', error);
            throw error;
        }
    }
}

module.exports = FingerprintGenerator; 