@echo off
setlocal

cd /d "%~dp0"

echo ===================================
echo   Conflict Resolution Institute
echo ===================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Install from https://nodejs.org/ then try again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available. Please reinstall Node.js.
  pause
  exit /b 1
)

REM Navigate into the app directory
cd app

if not exist "node_modules\" (
  echo Installing dependencies...
  if exist "package-lock.json" (
    call npm ci
  ) else (
    call npm install
  )
  if errorlevel 1 (
    echo ERROR: Dependency install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting development server...
echo.
echo   - App will open at: http://localhost:4000
echo   - Press Ctrl+C to stop the server
echo.

call npm run dev

endlocal
