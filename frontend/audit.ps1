Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'
Write-Output "=== TSC ERRORS ==="
$tsc = npx tsc --noEmit 2>&1 | Out-String
if ($tsc.Trim().Length -eq 0) { Write-Output "NONE" } else { Write-Output $tsc }
Write-Output "=== NEXT LINT ==="
$lint = npx next lint 2>&1 | Out-String
Write-Output $lint.Substring(0, [Math]::Min(3000, $lint.Length))
Write-Output "=== PAGE TESTS ==="
$pages = @('/', '/products', '/login', '/signup')
foreach ($p in $pages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 20
        $hasErr = $r.Content -match 'Internal Server Error|Unhandled Runtime Error|Application error'
        $status = if ($hasErr) { 'RENDER ERROR' } else { 'OK' }
        Write-Output "  $p => $($r.StatusCode) $status (${$r.Content.Length} bytes)"
    } catch {
        Write-Output "  $p => FAILED: $($_.Exception.Message)"
    }
}
