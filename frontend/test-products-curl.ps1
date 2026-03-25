Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'
Write-Output "Testing /products with curl to see error details..."
$result = curl.exe -v -s "http://localhost:3000/products" 2>&1 | Out-String
Write-Output $result.Substring(0, [Math]::Min(5000, $result.Length))
