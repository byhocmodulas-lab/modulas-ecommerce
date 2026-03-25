$result = curl.exe -s "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
# Look for error details
if ($result -match 'data-next-error-message="([^"]+)"') {
    Write-Output "ERROR: $($Matches[1])"
} elseif ($result.Length -lt 500) {
    Write-Output "Short response: $result"
} else {
    Write-Output "Response length: $($result.Length)"
    # Extract any error patterns
    if ($result -match 'Error:([^\n<]+)') {
        Write-Output "Error found: $($Matches[1])"
    }
}
