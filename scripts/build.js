const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Configuration for obfuscation
const obfuscationOptions = {
    // 是否压缩代码，true 会移除所有空格和换行符，使代码更紧凑
    compact: true,

    // 是否启用控制流扁平化，false 表示不改变代码的执行流程
    // 启用会使代码更难理解但会影响性能，所以这里关闭
    controlFlowFlattening: false,

    // 是否注入死代码，false 表示不添加永远不会执行的代码
    // 关闭可以保持代码简洁，避免增加不必要的复杂性
    deadCodeInjection: false,

    // 是否启用调试保护，false 表示允许使用调试器
    // 这对开发和故障排查很重要，所以保持关闭
    debugProtection: false,

    // 是否禁用 console.log 等控制台输出，false 表示保留所有控制台输出
    // 这对调试很重要，所以保持开启
    disableConsoleOutput: false,

    // 变量名生成器的类型，'mangled' 表示使用简短但仍可读的变量名
    // 比 'hexadecimal' 更温和，可以保持一定的可读性
    identifierNamesGenerator: 'mangled',

    // 是否记录混淆过程，false 表示不输出混淆日志
    log: false,

    // 是否将数字转换为表达式，false 表示保持数字原样
    // 关闭可以保持代码的可读性和性能
    numbersToExpressions: false,

    // 是否重命名全局变量，false 表示保持全局变量名不变
    // 这很重要，因为可能会影响与其他模块的交互
    renameGlobals: false,

    // 是否轮转字符串数组，false 表示不对字符串进行额外处理
    rotateStringArray: false,

    // 是否启用自我保护，false 表示不添加防止代码被篡改的保护
    selfDefending: false,

    // 是否分割字符串，false 表示保持字符串完整
    // 这可以保持代码的可读性和性能
    splitStrings: true,

    // 是否将字符串转移到一个数组中，false 表示保持字符串在原位置
    stringArray: true,

    // 字符串数组的编码方式，空数组表示不进行编码
    stringArrayEncoding: [],

    // 字符串数组的阈值，0 表示不将任何字符串移动到数组中
    stringArrayThreshold: 0,

    // 是否转换对象的键名，false 表示保持对象键名不变
    transformObjectKeys: false,

    // 是否使用 Unicode 转义序列，false 表示保持字符串可读
    unicodeEscapeSequence: false
};

// Platform mapping
const PLATFORM_MAP = {
    'win32': 'win32',
    'darwin': 'mac',
    'linux': 'linux'
};

// Get current platform
const currentPlatform = PLATFORM_MAP[process.platform];
if (!currentPlatform) {
    console.error(`Unsupported platform: ${process.platform}`);
    process.exit(1);
}

// Get build type from command line arguments
const buildType = process.argv[2] === '--dir' ? 'dir' : 'dist';

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyNodeExecutable(platform, targetDir) {
    const nodeSourceDir = path.join(process.cwd(), `node_${platform}`);
    const nodeTargetDir = path.join(targetDir, 'node');

    if (fs.existsSync(nodeSourceDir)) {
        // Clean target node directory if it exists
        if (fs.existsSync(nodeTargetDir)) {
            fs.rmSync(nodeTargetDir, { recursive: true, force: true });
        }
        
        // Copy entire node directory
        fs.cpSync(nodeSourceDir, nodeTargetDir, { recursive: true });
        
        // Set executable permissions on Unix-like systems
        if (platform !== 'win32') {
            const nodeBin = path.join(nodeTargetDir, 'node');
            if (fs.existsSync(nodeBin)) {
                fs.chmodSync(nodeBin, '755');
            }
        }
        console.log(`Copied Node environment to: ${nodeTargetDir}`);
    } else {
        console.warn(`Node directory not found: ${nodeSourceDir}`);
        console.log('Continuing build process without embedded Node.js runtime...');
        // 不再退出进程，只是发出警告
    }
}

function copyAndObfuscateFile(sourcePath, targetPath) {
    try {
        const code = fs.readFileSync(sourcePath, 'utf8');
        if (sourcePath.endsWith('.js') && !sourcePath.endsWith('package.json')) {
            const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
            fs.writeFileSync(targetPath, obfuscationResult.getObfuscatedCode());
            console.log(`Successfully obfuscated: ${targetPath}`);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Successfully copied: ${targetPath}`);
        }
    } catch (error) {
        console.error(`Error processing ${sourcePath}:`, error);
    }
}

function processDirectory(sourceDir, targetDir, subDir = '') {
    const currentSourceDir = path.join(sourceDir, subDir);
    const currentTargetDir = path.join(targetDir, subDir);

    ensureDirectoryExists(currentTargetDir);

    const entries = fs.readdirSync(currentSourceDir);
    
    entries.forEach(entry => {
        const sourcePath = path.join(currentSourceDir, entry);
        const targetPath = path.join(currentTargetDir, entry);
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
            processDirectory(sourceDir, targetDir, path.join(subDir, entry));
        } else {
            copyAndObfuscateFile(sourcePath, targetPath);
        }
    });
}

function buildPublic() {
    console.log('Building public code...');

    const sourceDir = path.join(process.cwd(), 'public');
    const distPublicDir = path.join(process.cwd(), 'dist_public');

    // Clean dist_public directory if it exists
    if (fs.existsSync(distPublicDir)) {
        fs.rmSync(distPublicDir, { recursive: true, force: true });
    }
    ensureDirectoryExists(distPublicDir);

    // Process all files in public directory
    processDirectory(sourceDir, distPublicDir);
}

function buildServer() {
    console.log('Building server code...');

    const sourceDir = path.join(process.cwd(), 'server');
    const distServerDir = path.join(process.cwd(), 'dist_server');

    // Clean dist_server directory if it exists
    if (fs.existsSync(distServerDir)) {
        fs.rmSync(distServerDir, { recursive: true, force: true });
    }
    ensureDirectoryExists(distServerDir);

    // Process server directory
    const dirsToProcess = ['api', 'flows', 'utils'];
    dirsToProcess.forEach(dir => {
        const sourceDirPath = path.join(sourceDir, dir);
        if (fs.existsSync(sourceDirPath)) {
            processDirectory(sourceDir, distServerDir, dir);
        }
    });

    // Copy main server files
    const filesToCopy = ['server.js', 'package.json'];
    filesToCopy.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(distServerDir, file);
        if (fs.existsSync(sourcePath)) {
            copyAndObfuscateFile(sourcePath, targetPath);
        }
    });

    // Copy Node.js environment
    copyNodeExecutable(currentPlatform, distServerDir);

    // Copy node_modules
    const nodeModulesPath = path.join(sourceDir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        fs.cpSync(nodeModulesPath, path.join(distServerDir, 'node_modules'), { recursive: true });
    }
}

function buildElectronApp() {
    console.log(`Building Electron app (${buildType === 'dir' ? 'unpacked' : 'portable'})...`);
    
    // Get the electron-builder command based on platform and build type
    const builderCmd = `electron-builder ${buildType === 'dir' ? '--dir' : ''} --${currentPlatform === 'win32' ? 'win' : currentPlatform === 'darwin' ? 'mac' : 'linux'}`;
    
    try {
        execSync(builderCmd, { 
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('Error building Electron app:', error);
        process.exit(1);
    }
}

function generateDistPackage() {
    console.log('Generating dist_package.json...');
    
    // Read the root package.json
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Extract required fields
    const distPackage = {
        name: packageJson.name,
        version: packageJson.version,
        keywords: packageJson.keywords || [],
        author: packageJson.author,
        license: packageJson.license,
        description: packageJson.description
    };
    
    // Write to dist_package.json
    const distPackagePath = path.join(process.cwd(), 'dist_package.json');
    fs.writeFileSync(distPackagePath, JSON.stringify(distPackage, null, 2));
    console.log('Generated dist_package.json successfully');
}

function cleanupBuildDirs() {
    console.log('Cleaning up build directories...');
    const dirsToClean = ['dist_public', 'dist_server', 'dist_package.json'];
    
    dirsToClean.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`Removed ${dir}`);
        }
    });
}

// Main build process
console.log(`Starting build process for ${currentPlatform}...`);

// Step 1: Generate dist_package.json
generateDistPackage();

// Step 2: Build public
buildPublic();

// Step 3: Build server
buildServer();

// Step 4: Build Electron app
buildElectronApp();

// Step 5: Cleanup build directories
cleanupBuildDirs();

console.log('Build completed successfully!'); 