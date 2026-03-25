Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'

# Check if dev server is already running
$retries = 0
while ($retries -lt 20) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
        Write-Output "Dev server is up!"
        break
    } catch {
        $retries++
        Write-Output "Waiting for dev server... ($retries/20)"
        Start-Sleep -Seconds 3
    }
}

if ($retries -ge 20) {
    Write-Output "Dev server not responding. Starting it..."
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d `"C:\Users\Admin\Modulas E-commerce\frontend`" && npx next dev --port 3000" -WindowStyle Hidden
    Start-Sleep -Seconds 20
}

# Test pages
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
