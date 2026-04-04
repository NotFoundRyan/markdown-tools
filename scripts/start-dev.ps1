$port = 3000

Write-Host "Checking port $port..." -ForegroundColor Yellow

$connections = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"

if ($connections) {
    foreach ($conn in $connections) {
        $parts = $conn -split '\s+'
        $processId = $parts[-1]
        if ($processId -match '^\d+$' -and $processId -ne '0') {
            Write-Host "Found process $processId using port $port, killing it..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Process $processId terminated." -ForegroundColor Green
            } catch {
                $errorMsg = $_.ToString()
                Write-Host "Failed to kill process $processId : $errorMsg" -ForegroundColor Red
            }
        }
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "Starting development server on port $port..." -ForegroundColor Green
npx vite
