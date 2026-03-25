# Get first 5000 bytes of response to find error
$html = curl.exe -s "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
Write-Output $html.Substring(0, [Math]::Min(3000, $html.Length))
