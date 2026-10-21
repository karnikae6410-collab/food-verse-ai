@echo off
title Food Verse AI - 1-Click Launcher
echo ========================================================
echo        FOOD VERSE AI - 1-CLICK APPLICATION LAUNCHER
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "Food Verse AI - Backend" cmd /k "backend\venv\Scripts\python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Next.js Frontend on http://localhost:3000 ...
start "Food Verse AI - Frontend" cmd /k "cd frontend && npm start"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Food Verse AI in your default browser ...
start http://localhost:3000

echo.
echo ========================================================
echo  Application is running!
echo  - Frontend: http://localhost:3000
echo  - Backend API: http://localhost:8000/docs
echo  - Demo Video: http://localhost:8000/demo-video
echo ========================================================
echo.
pause
