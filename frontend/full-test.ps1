Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'

Write-Output "=== TSC CHECK ==="
$tsc = npx tsc --noEmit 2>&1 | Out-String
if ($tsc.Trim().Length -eq 0) { Write-Output "ZERO ERRORS" } else { Write-Output $tsc.Substring(0, [Math]::Min(3000, $tsc.Length)) }

Write-Output "`n=== Clearing Next.js cache ==="
Remove-Item -Recurse -Force '.next\cache' -ErrorAction SilentlyContinue
Write-Output "Done"

Write-Output "`n=== Waiting for dev server to be ready ==="
# Try to hit homepage to trigger recompilation
$ready = $false
for ($i = 0; $i -lt 5; $i++) {
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 30
        $ready = $true
        break
    } catch {
        Write-Output "  Attempt $($i+1)..."
        Start-Sleep -Seconds 5
    }
}

if (-not $ready) {
    Write-Output "Dev server not ready. Please start it manually."
    exit 1
}

Write-Output "`n=== PAGE TESTS ==="
$pages = @('/', '/products', '/products/sample-product-1', '/login', '/signup', '/blog', '/courses', '/forgot-password')
foreach ($p in $pages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 45
        $hasErr = $r.Content -match 'Internal Server Error|Unhandled Runtime Error|Application error'
        $status = if ($hasErr) { 'RENDER ERROR' } else { 'OK' }
        $len = $r.Content.Length
        Write-Output "  $p => $($r.StatusCode) $status ($len bytes)"
    } catch {
        Write-Output "  $p => FAILED: $($_.Exception.Message)"
    }
}