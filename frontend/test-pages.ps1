$pages = @('/', '/products', '/login', '/signup', '/blog', '/courses', '/forgot-password')
foreach ($p in $pages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$p" -UseBasicParsing -TimeoutSec 30
        $hasErr = $r.Content -match 'Internal Server Error|Unhandled Runtime Error|Application error'
        $status = if ($hasErr) { 'RENDER ERROR' } else { 'OK' }
        $len = $r.Content.Length
        Write-Output "  $p => $($r.StatusCode) $status ($len bytes)"
    } catch {
        Write-Output "  $p => FAILED: $($_.Exception.Message)"
    }
}
