# Get error body with curl
$html = curl.exe -s "http://localhost:3000/products/sample-product-1" 2>&1 | Out-String

# Search for error-related patterns
$patterns = @('template data-', 'error-message', 'error-digest', 'error-stack', 'Error:', '__next_error__')
foreach ($pat in $patterns) {
    $idx = $html.IndexOf($pat)
    if ($idx -ge 0) {
        $start = [Math]::Max(0, $idx - 10)
        $end = [Math]::Min($html.Length, $idx + 500)
        Write-Output "Found '$pat' at $idx :"
        Write-Output $html.Substring($start, $end - $start)
        Write-Output "---"
    }
}
