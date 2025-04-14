@echo off
:: 设置UTF-8编码
chcp 65001>nul

echo ===================================
echo     Cursor IDE 免费试用工具打包脚本
echo ===================================
echo.

echo [1/4] 设置环境变量...
set NODE_ENV=production

echo [2/4] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 安装依赖失败，请检查网络连接和 Node.js 环境。
    pause
    exit /b 1
)

echo [3/4] 开始打包应用程序...
call npm run build
if %errorlevel% neq 0 (
    echo 打包失败，请检查控制台输出的错误信息。
    pause
    exit /b 1
)

echo [4/4] 打包完成！

echo.
echo 应用程序已成功打包到 release 目录。
echo 可执行文件: release\CursorIDEFreeTrial.exe
echo.

pause 