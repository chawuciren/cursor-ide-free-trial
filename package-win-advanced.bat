@echo off
setlocal enabledelayedexpansion

:: 设置UTF-8编码
chcp 65001>nul

echo =============================================
echo     Cursor IDE 免费试用工具 - 高级打包脚本
echo =============================================
echo.

:: 检查Node.js环境
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js环境，请安装Node.js后再运行此脚本。
    pause
    exit /b 1
)

:: 设置菜单选项
:menu
cls
echo 请选择打包选项:
echo.
echo  [1] 标准打包 (生成可执行文件)
echo  [2] 开发打包 (生成未压缩目录)
echo  [3] 清理并重新打包
echo  [4] 退出
echo.
set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" (
    set BUILD_TYPE=standard
    goto start_build
) else if "%choice%"=="2" (
    set BUILD_TYPE=dev
    goto start_build
) else if "%choice%"=="3" (
    set BUILD_TYPE=clean
    goto start_build
) else if "%choice%"=="4" (
    exit /b 0
) else (
    echo 无效选项，请重新选择。
    timeout /t 2 >nul
    goto menu
)

:start_build
echo.
echo [1/5] 设置环境变量...
set NODE_ENV=production

echo [2/5] 检查并安装依赖...
if not exist node_modules (
    echo 首次运行，安装依赖...
    call npm install
    if !errorlevel! neq 0 (
        echo [错误] 安装依赖失败，请检查网络连接。
        pause
        exit /b 1
    )
) else (
    echo 已存在node_modules目录，跳过安装依赖。
    echo 如需重新安装依赖，请选择"清理并重新打包"选项。
)

if "%BUILD_TYPE%"=="clean" (
    echo [3/5] 清理项目...
    if exist node_modules (
        echo 删除node_modules...
        rmdir /s /q node_modules
    )
    if exist release (
        echo 删除release目录...
        rmdir /s /q release
    )
    if exist dist_public (
        echo 删除dist_public目录...
        rmdir /s /q dist_public
    )
    if exist dist_server (
        echo 删除dist_server目录...
        rmdir /s /q dist_server
    )
    if exist dist_package.json (
        echo 删除dist_package.json...
        del /f /q dist_package.json
    )
    
    echo 重新安装依赖...
    call npm install
    if !errorlevel! neq 0 (
        echo [错误] 重新安装依赖失败。
        pause
        exit /b 1
    )
)

echo [4/5] 开始打包应用程序...
if "%BUILD_TYPE%"=="dev" (
    echo 正在生成未压缩目录...
    call npm run build:dir
) else (
    echo 正在生成可执行文件...
    call npm run build
)

if %errorlevel% neq 0 (
    echo [错误] 打包失败，请检查控制台输出的错误信息。
    pause
    exit /b 1
)

echo [5/5] 打包完成！

echo.
if "%BUILD_TYPE%"=="dev" (
    echo 应用程序已成功打包到 release\win-unpacked 目录。
) else (
    echo 应用程序已成功打包到 release 目录。
    echo 可执行文件: release\CursorIDEFreeTrial.exe
)
echo.

:: 打包完成后询问是否打开输出目录
set /p open_dir=是否打开输出目录？(Y/N): 
if /i "%open_dir%"=="Y" (
    if "%BUILD_TYPE%"=="dev" (
        start explorer "release\win-unpacked"
    ) else (
        start explorer "release"
    )
)

echo.
echo 感谢使用打包脚本！
pause
exit /b 0 