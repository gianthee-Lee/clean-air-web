@echo off
chcp 949 >nul
title CleanAir Server

echo ========================================
echo   CleanAir Server Starting...
echo ========================================
echo.
echo  [INFO] Do not close this window.
echo  [INFO] Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo  Installing packages...
    call npm.cmd install
    echo.
)

echo  Starting server...
echo.

start /b cmd /c "ping -n 5 127.0.0.1 >nul && start http://localhost:3000"

call npm.cmd run dev -- -p 3000

echo.
echo  Server stopped.
pause
