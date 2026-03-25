Write-Output "Testing /products with 120s timeout..."
$sw = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000/products" -UseBasicParsing -TimeoutSec 120
    $sw.Stop()
    $hasErr = $r.Content -match 'Internal Server Error|Unhandled Runtime Error|Application error'
    $status = if ($hasErr) { 'RENDER ERROR' } else { 'OK' }
    Write-Output "  /products => $($r.StatusCode) $status ($($r.Content.Length) bytes) in $($sw.Elapsed.TotalSeconds)s"
} catch {
    $sw.Stop()
    Write-Output "  /products => FAILED after $($sw.Elapsed.TotalSeconds)s: $($_.Exception.Message)"
}
