Write-Host ""
Write-Host "=== MODULAS FIX ALL ===" -ForegroundColor Cyan

$ROOT_DIR    = "C:\Users\Admin\Modulas E-commerce"
$BACKEND_DIR = "C:\Users\Admin\Modulas E-commerce\backend"
$BACKEND_URL = "https://modulas-ecommerce-production.up.railway.app"
$SETUP_TOKEN = "modulas-setup-2026"
$ADMIN_PASS  = 'Modulas@2026!'

# Build bootstrap JSON safely
$bootstrapObj = [ordered]@{
    setupToken = $SETUP_TOKEN
    email      = "admin@modulas.in"
    password   = $ADMIN_PASS
    fullName   = "Modulas Admin"
}
$bootstrapBody = $bootstrapObj | ConvertTo-Json -Compress

# ---- Step 1: Show Railway vars ----------------------------------------------
Write-Host ""
Write-Host "[1/4] Current Railway variables:" -ForegroundColor Yellow
Push-Location $BACKEND_DIR
& railway variables 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
Pop-Location

# ---- Step 2: Remove proxy.ts + push to git ----------------------------------
Write-Host ""
Write-Host "[2/4] Removing proxy.ts and pushing to git..." -ForegroundColor Yellow
Push-Location $ROOT_DIR

if (Test-Path "frontend\src\proxy.ts") {
    & git rm -f "frontend/src/proxy.ts"
    Write-Host "  Removed proxy.ts" -ForegroundColor Green
} else {
    Write-Host "  proxy.ts not found - already removed" -ForegroundColor DarkGray
}

& git add -A
& git commit -m "fix: remove duplicate proxy.ts middleware conflict"
& git push origin master
Write-Host "  Pushed - Vercel will rebuild automatically" -ForegroundColor Green
Pop-Location

# ---- Step 3: Bootstrap master admin -----------------------------------------
Write-Host ""
Write-Host "[3/4] Bootstrapping master admin..." -ForegroundColor Yellow

function Try-Bootstrap {
    try {
        Invoke-RestMethod -Method POST `
            -Uri "$BACKEND_URL/api/v1/auth/bootstrap" `
            -ContentType "application/json" `
            -Body $bootstrapBody | Out-Null
        return "created"
    } catch {
        $msg = ""
        try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).message } catch {}
        return $msg
    }
}

$result = Try-Bootstrap
if ($result -eq "created" -or $result -match "already|exists") {
    Write-Host "  Master admin ready!" -ForegroundColor Green
} elseif ($result -match "Invalid setup token") {
    Write-Host "  Env vars not yet live - triggering Railway redeploy..." -ForegroundColor Yellow
    Push-Location $BACKEND_DIR
    & railway redeploy --yes 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
    Pop-Location

    $done = $false
    for ($i = 1; $i -le 48; $i++) {
        Start-Sleep -Seconds 5
        $r = Try-Bootstrap
        if ($r -eq "created" -or $r -match "already|exists") {
            Write-Host "  [$($i*5)s] Master admin ready!" -ForegroundColor Green
            $done = $true
            break
        }
        Write-Host "  [$($i*5)s] $r" -ForegroundColor DarkGray
    }
    if (-not $done) { Write-Host "  Timed out. Check Railway dashboard." -ForegroundColor Red }
} else {
    Write-Host "  Unexpected error: $result" -ForegroundColor Red
}

# ---- Step 4: Done -----------------------------------------------------------
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  DONE" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Vercel building now (~2 min). After it completes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Admin portal:  https://modulas-ecommerce.vercel.app/workspace" -ForegroundColor Cyan
Write-Host "  Access code:   modulas-x" -ForegroundColor Cyan
Write-Host "  Email:         admin@modulas.in" -ForegroundColor Cyan
$pw = 'Modulas@2026!'
Write-Host "  Password:      $pw" -ForegroundColor Cyan
Write-Host ""
