# Get error details via curl verbose
$result = curl.exe -v -s "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
# Find error template in HTML
$lines = $result -split "`n"
foreach ($line in $lines) {
    if ($line -match 'data-next-error|error-message|error-digest|Error:') {
        Write-Output $line.Substring(0, [Math]::Min(500, $line.Length))
    }
}
# Check status
if ($result -match 'HTTP/1.1 (\d+)') {
    Write-Output "`nHTTP Status: $($Matches[1])"
}
