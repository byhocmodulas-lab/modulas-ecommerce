Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'

# Clear Next.js cache
if (Test-Path '.next') {
    Remove-Item -Recurse -Force '.next\cache' -ErrorAction SilentlyContinue
    Write-Output "Cleared .next/cache"
}

# Kill existing dev server
$procs = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    try { $_.MainModule.FileName -match 'Modulas' } catch { $false }
}
if ($procs) {
    $procs | Stop-Process -Force
    Write-Output "Killed existing dev server"
    Start-Sleep -Seconds 2
}

# Start dev server in background
Start-Process -FilePath "npx" -ArgumentList "next", "dev", "--port", "3000" -WindowStyle Hidden -WorkingDirectory 'C:\Users\Admin\Modulas E-commerce\frontend'
Write-Output "Started dev server, waiting 12s for compilation..."
Start-Sleep -Seconds 12

# Test pages
$pages = @('/', '/products', '/products/sample-product-1', '/login', '/signup', '/blog', '/courses', '/forgot-password')
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
