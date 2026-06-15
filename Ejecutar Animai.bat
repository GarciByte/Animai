cd /d "%~dp0"

start "" cmd /c "pnpm dev"
timeout /t 5 > nul
start "" http://localhost:3000
start "" http://localhost:3001/api/