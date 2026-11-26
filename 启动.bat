@echo off
chcp 65001 >nul
title 垚陶 - 启动
cd /d "%~dp0"

echo ==================================
echo   1/2  启动垚垚后端 (端口 8000)
echo ==================================
start "yao-agent" cmd /k "cd /d %~dp0agent && set PYTHONUTF8=1 && .venv\Scripts\python.exe -m uvicorn src.server:app --host 127.0.0.1 --port 8000"

timeout /t 3 >nul

echo ==================================
echo   2/2  启动网站前端 (端口 5173)
echo ==================================
start "yao-web" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 >nul
start "" http://127.0.0.1:5173/

echo.
echo 两个窗口都别关。要停止服务就关掉那两个黑窗口。
