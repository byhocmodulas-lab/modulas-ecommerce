$BACKEND_DIR = "C:\Users\Admin\Modulas E-commerce\backend"
Push-Location $BACKEND_DIR
Write-Host "Current Railway variables:" -ForegroundColor Yellow
& railway variables 2>&1
Pop-Location
