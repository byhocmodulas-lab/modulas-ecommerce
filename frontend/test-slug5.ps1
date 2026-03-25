# Remove .next directory completely and restart
Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'
Remove-Item -Recurse -Force '.next' -ErrorAction SilentlyContinue
Write-Output "Removed .next directory"

# Start dev server
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d `"C:\Users\Admin\Modulas E-commerce\frontend`" && npx next dev --port 3000" -WindowStyle Hidden
Write-Output "Started dev server, waiting for it..."

# Wait for server
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 5
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 10
        Write-Output "Server ready!"
        break
    } catch {
        Write-Output "  Waiting... ($($i+1)/15)"
    }
}

Start-Sleep -Seconds 3

# Test slug page with curl
Write-Output "`nTesting /products/sample-product-1..."
$status = curl.exe -s -o NUL -w "%{http_code}" "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
Write-Output "Status: $($status.Trim())"

# Also try with Invoke-WebRequest
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000/products/sample-product-1" -UseBasicParsing -TimeoutSec 60
    Write-Output "IWR: $($r.StatusCode) ($($r.Content.Length) bytes)"
} catch {
    Write-Output "IWR failed: $($_.Exception.Message)"
}
