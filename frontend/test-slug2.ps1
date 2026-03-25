$result = curl.exe -s -o NUL -w "%{http_code} %{size_download}" "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
Write-Output "curl result: $result"

# Also check for error patterns in the HTML
$html = curl.exe -s "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String
$hasError = $html -match 'Internal Server Error|Unhandled Runtime Error|Application error|data-next-error'
Write-Output "Has error content: $hasError"
if ($html -match 'data-next-error-message="([^"]+)"') {
    Write-Output "Next error: $($Matches[1])"
}
Write-Output "HTML length: $($html.Length) bytes"
