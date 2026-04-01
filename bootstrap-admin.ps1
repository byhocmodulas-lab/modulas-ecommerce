$BACKEND_URL = "https://modulas-ecommerce-production.up.railway.app"
$SETUP_TOKEN = "modulas-setup-2026"
$ADMIN_PASS  = 'Modulas@2026!'
$body = "{`"setupToken`":`"$SETUP_TOKEN`",`"email`":`"admin@modulas.in`",`"password`":`"$ADMIN_PASS`",`"fullName`":`"Modulas Admin`"}"

Write-Host "Waiting for Railway redeploy to finish with new env vars..." -ForegroundColor Yellow
Write-Host "(Will retry every 15s for up to 5 minutes)" -ForegroundColor DarkGray
Write-Host ""

for ($i = 1; $i -le 20; $i++) {
    Write-Host "Attempt $i..." -NoNewline
    try {
        $result = Invoke-RestMethod -Method POST -Uri "$BACKEND_URL/api/v1/auth/bootstrap" -ContentType "application/json" -Body $body
        Write-Host " SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Master admin created!" -ForegroundColor Green
        Write-Host "Email:    admin@modulas.in" -ForegroundColor Cyan
        Write-Host "Password: Modulas@2026!" -ForegroundColor Cyan
        Write-Host "URL:      https://modulas-ecommerce.vercel.app/workspace" -ForegroundColor Cyan
        Write-Host "Code:     modulas-x" -ForegroundColor Cyan
        exit 0
    } catch {
        $msg = ""
        try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).message } catch {}
        if ($msg -match "already|exists") {
            Write-Host " Already exists - OK!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Master admin account is ready." -ForegroundColor Green
            Write-Host "Email:    admin@modulas.in" -ForegroundColor Cyan
            Write-Host "Password: Modulas@2026!" -ForegroundColor Cyan
            Write-Host "URL:      https://modulas-ecommerce.vercel.app/workspace" -ForegroundColor Cyan
            Write-Host "Code:     modulas-x" -ForegroundColor Cyan
            exit 0
        }
        Write-Host " $msg" -ForegroundColor Red
        Start-Sleep -Seconds 15
    }
}

Write-Host ""
Write-Host "Could not bootstrap after 20 attempts." -ForegroundColor Red
Write-Host "Check Railway logs: https://railway.app" -ForegroundColor Yellow
