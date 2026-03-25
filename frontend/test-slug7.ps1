# Run next dev in foreground briefly to capture stderr
Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'

# Kill existing
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start and capture output
$job = Start-Job -ScriptBlock {
    Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'
    npx next dev --port 3000 2>&1
}

# Wait for server to start
Start-Sleep -Seconds 25

# Hit the slug page
try {
    $null = Invoke-WebRequest -Uri "http://localhost:3000/products/sample-product-1" -UseBasicParsing -TimeoutSec 30
} catch {}

Start-Sleep -Seconds 5

# Get job output
$output = Receive-Job $job | Out-String
Write-Output $output.Substring([Math]::Max(0, $output.Length - 4000))

Stop-Job $job -ErrorAction SilentlyContinue
Remove-Job $job -ErrorAction SilentlyContinue
