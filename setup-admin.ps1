$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host "=== MODULAS AUTOMATED SETUP ===" -ForegroundColor Cyan

$RAILWAY_TOKEN   = "tgdJMhAHevctH6FJx41R5Bqb6oPQoZDNAQ8A2OcYNj5"
$RAILWAY_PROJECT = "d5d617af-d2f7-4209-9612-dd16c0462463"
$RAILWAY_ENV     = "97fa258e-a365-4021-a0a5-0ad62efdf34c"
$RAILWAY_SERVICE = "42b8d4b5-6bd7-49b6-a844-c2c49c944bdf"
$VERCEL_TOKEN    = "vca_1Bg25oHHpQiCtcA7wa3E9VV2I07sIXNeymWoYzMX1tUedzpi891fAklj"
$VERCEL_PROJECT  = "prj_xMIKz9Us4sxNTMJKQlFE4uwhMQCh"
$VERCEL_TEAM     = "team_Y36d8D7fLiA07ZnA4ik4nsjh"
$BACKEND_URL     = "https://modulas-ecommerce-production.up.railway.app"
$SETUP_TOKEN     = "modulas-setup-2026"
$ADMIN_PASS      = 'Modulas@2026!'

$railwayHeaders = @{
    "Authorization" = "Bearer $RAILWAY_TOKEN"
    "Content-Type"  = "application/json"
}
$vercelHeaders = @{
    "Authorization" = "Bearer $VERCEL_TOKEN"
    "Content-Type"  = "application/json"
}

# --- Step 1: Verify Railway token ---
Write-Host ""
Write-Host "[0/5] Verifying Railway token..." -ForegroundColor Yellow

$meBody = '{"query":"query { me { id email } }"}'
try {
    $me = Invoke-RestMethod -Method POST -Uri "https://backboard.railway.app/graphql/v2" -Headers $railwayHeaders -Body $meBody
    if ($me.errors) {
        Write-Host "  Railway token error: $($me.errors[0].message)" -ForegroundColor Red
        Write-Host "  Run: railway login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  Authenticated as: $($me.data.me.email)" -ForegroundColor Green
} catch {
    Write-Host "  Railway auth failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# --- Step 2: Set Railway variables ---
Write-Host ""
Write-Host "[1/5] Setting Railway environment variables..." -ForegroundColor Yellow

$upsertBody = @"
{"query":"mutation { variableCollectionUpsert(input: { projectId: \"$RAILWAY_PROJECT\" environmentId: \"$RAILWAY_ENV\" serviceId: \"$RAILWAY_SERVICE\" variables: { ADMIN_SETUP_TOKEN: \"$SETUP_TOKEN\" JWT_SECRET: \"modulas-jwt-secret-2026-ultraXYZ\" JWT_REFRESH_SECRET: \"modulas-refresh-secret-2026-ultraABC\" } }) }"}
"@

$upsertResult = Invoke-RestMethod -Method POST -Uri "https://backboard.railway.app/graphql/v2" -Headers $railwayHeaders -Body $upsertBody
if ($upsertResult.errors) {
    Write-Host "  Warning: $($upsertResult.errors[0].message)" -ForegroundColor Yellow
} else {
    Write-Host "  Variables set OK" -ForegroundColor Green
}

# --- Step 3: Redeploy Railway ---
Write-Host ""
Write-Host "[2/5] Triggering Railway redeploy..." -ForegroundColor Yellow

$redeployBody = @"
{"query":"mutation { serviceInstanceRedeploy(environmentId: \"$RAILWAY_ENV\" serviceId: \"$RAILWAY_SERVICE\") }"}
"@

$redeployResult = Invoke-RestMethod -Method POST -Uri "https://backboard.railway.app/graphql/v2" -Headers $railwayHeaders -Body $redeployBody
if ($redeployResult.errors) {
    Write-Host "  Warning: $($redeployResult.errors[0].message)" -ForegroundColor Yellow
} else {
    Write-Host "  Redeploy triggered OK" -ForegroundColor Green
}

# --- Step 4: Wait for backend with new env vars ---
Write-Host ""
Write-Host "[3/5] Waiting for Railway redeploy (up to 3 min)..." -ForegroundColor Yellow
Write-Host "  (Old container serves until new one is ready)" -ForegroundColor DarkGray

Start-Sleep -Seconds 20

$bootstrapDone = $false
for ($i = 1; $i -le 30; $i++) {
    $elapsed = 20 + ($i * 10)
    Write-Host "  [$elapsed s] Attempting bootstrap..." -NoNewline
    try {
        $bootstrapBody = "{`"setupToken`":`"$SETUP_TOKEN`",`"email`":`"admin@modulas.in`",`"password`":`"$ADMIN_PASS`",`"fullName`":`"Modulas Admin`"}"
        Invoke-RestMethod -Method POST -Uri "$BACKEND_URL/api/v1/auth/bootstrap" -ContentType "application/json" -Body $bootstrapBody | Out-Null
        Write-Host " Created!" -ForegroundColor Green
        $bootstrapDone = $true
        break
    } catch {
        $msg = ""
        try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).message } catch {}
        if ($msg -match "already|exists") {
            Write-Host " Already exists - OK!" -ForegroundColor Green
            $bootstrapDone = $true
            break
        }
        Write-Host " $msg" -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
    }
}

if (-not $bootstrapDone) {
    Write-Host "  Bootstrap timed out." -ForegroundColor Red
}

# --- Step 5: Set Vercel env vars ---
Write-Host ""
Write-Host "[4/5] Setting Vercel environment variables..." -ForegroundColor Yellow

$vercelEnvUrl = "https://api.vercel.com/v10/projects/$VERCEL_PROJECT/env?teamId=$VERCEL_TEAM"

function Set-VercelEnv {
    param($key, $value)
    $body = "{`"key`":`"$key`",`"value`":`"$value`",`"type`":`"plain`",`"target`":[`"production`",`"preview`",`"development`"]}"
    try {
        Invoke-RestMethod -Method POST -Uri $vercelEnvUrl -Headers $vercelHeaders -Body $body | Out-Null
        Write-Host "  Set ${key} OK" -ForegroundColor Green
    } catch {
        $code = ""
        try { $code = ($_.ErrorDetails.Message | ConvertFrom-Json).error.code } catch {}
        if ($code -eq "ENV_ALREADY_EXISTS") {
            try {
                $all = Invoke-RestMethod -Method GET -Uri $vercelEnvUrl -Headers $vercelHeaders
                $existing = $all.envs | Where-Object { $_.key -eq $key } | Select-Object -First 1
                if ($existing) {
                    $patchUrl = "https://api.vercel.com/v10/projects/$VERCEL_PROJECT/env/$($existing.id)?teamId=$VERCEL_TEAM"
                    $patchBody = "{`"value`":`"$value`",`"target`":[`"production`",`"preview`",`"development`"]}"
                    Invoke-RestMethod -Method PATCH -Uri $patchUrl -Headers $vercelHeaders -Body $patchBody | Out-Null
                    Write-Host "  Updated ${key} OK" -ForegroundColor Green
                }
            } catch {
                Write-Host "  Could not update ${key}: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  Warning ${key}: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Set-VercelEnv "NEXT_PUBLIC_API_URL" "$BACKEND_URL/api/v1"
Set-VercelEnv "NEXT_PUBLIC_ADMIN_ACCESS_CODE" "modulas-x"

# --- Step 6: Trigger Vercel redeploy via CLI ---
Write-Host ""
Write-Host "[5/5] Triggering Vercel redeploy..." -ForegroundColor Yellow

try {
    $deployList = Invoke-RestMethod -Method GET `
        -Uri "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT&teamId=$VERCEL_TEAM&limit=1&target=production" `
        -Headers $vercelHeaders

    $latest = $deployList.deployments[0]
    Write-Host "  Latest deployment: $($latest.uid)" -ForegroundColor DarkGray

    $redeployPayload = @{
        deploymentId = $latest.uid
    } | ConvertTo-Json

    $newDeploy = Invoke-RestMethod -Method POST `
        -Uri "https://api.vercel.com/v13/deployments?forceNew=1&teamId=$VERCEL_TEAM" `
        -Headers $vercelHeaders `
        -Body $redeployPayload

    Write-Host "  Vercel redeploy queued: $($newDeploy.url)" -ForegroundColor Green
} catch {
    Write-Host "  Auto-redeploy failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "  -> Manually: vercel.com -> Deployments -> Redeploy" -ForegroundColor Cyan
}

# --- Done ---
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ALL DONE" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Master Admin Portal" -ForegroundColor White
Write-Host "  URL:      https://modulas-ecommerce.vercel.app/workspace" -ForegroundColor Cyan
Write-Host "  Code:     modulas-x" -ForegroundColor Cyan
Write-Host "  Email:    admin@modulas.in" -ForegroundColor Cyan
Write-Host "  Password: Modulas@2026!" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Vercel will rebuild in ~2 min." -ForegroundColor Yellow
Write-Host "  After that, prices + cart will work on the live site." -ForegroundColor Yellow
Write-Host ""
