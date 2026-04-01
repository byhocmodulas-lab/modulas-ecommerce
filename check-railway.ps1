$RAILWAY_TOKEN   = "guTcb3qVPkWRNb_mBCZ-hu-Umr8VrDFXEjCih5yLHKq"
$RAILWAY_PROJECT = "d5d617af-d2f7-4209-9612-dd16c0462463"
$RAILWAY_ENV     = "97fa258e-a365-4021-a0a5-0ad62efdf34c"
$RAILWAY_SERVICE = "42b8d4b5-6bd7-49b6-a844-c2c49c944bdf"

$headers = @{
    "Authorization" = "Bearer $RAILWAY_TOKEN"
    "Content-Type"  = "application/json"
}

# Query current variables
Write-Host "Checking variables set on Railway service..." -ForegroundColor Yellow

$queryBody = @"
{"query":"query { variables(projectId: \"$RAILWAY_PROJECT\" environmentId: \"$RAILWAY_ENV\" serviceId: \"$RAILWAY_SERVICE\") }"}
"@

try {
    $result = Invoke-RestMethod -Method POST -Uri "https://backboard.railway.app/graphql/v2" -Headers $headers -Body $queryBody
    Write-Host "Variables response:" -ForegroundColor Cyan
    $result | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Also check token validity
Write-Host ""
Write-Host "Checking Railway token..." -ForegroundColor Yellow

$meQuery = '{"query":"query { me { id email } }"}'
try {
    $me = Invoke-RestMethod -Method POST -Uri "https://backboard.railway.app/graphql/v2" -Headers $headers -Body $meQuery
    Write-Host "Token valid, user:" -ForegroundColor Green
    $me | ConvertTo-Json
} catch {
    Write-Host "Token error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
