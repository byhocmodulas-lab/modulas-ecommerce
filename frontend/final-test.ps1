Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'

Write-Output "=== TSC CHECK ==="
$tsc = npx tsc --noEmit 2>&1 | Out-String
if ($tsc.Trim().Length -eq 0) { Write-Output "ZERO ERRORS" } else { Write-Output $tsc.Substring(0, [Math]::Min(4000, $tsc.Length)) }

Write-Output "`n=== PAGE TESTS ==="
$pages = @(
    '/',
    '/products',
    '/products/sample-product-1',
    '/products/sample-product-2',
    '/login',
    '/signup',
    '/forgot-password',
    '/blog',
    '/courses'
)

foreach ($p in $pages) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 60
        $sw.Stop()
        $hasErr = $r.Content -match 'Internal Server Error|Unhandled Runtime Error|Application error'
        $status = if ($hasErr) { 'RENDER ERROR' } else { 'OK' }
        $len = $r.Content.Length
        Write-Output "  $p => $($r.StatusCode) $status ($len bytes, $([math]::Round($sw.Elapsed.TotalSeconds, 1))s)"
    } catch {
        $sw.Stop()
        Write-Output "  $p => FAILED ($([math]::Round($sw.Elapsed.TotalSeconds, 1))s): $($_.Exception.Message)"
    }
}