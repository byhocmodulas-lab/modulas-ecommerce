Set-Location 'C:\Users\Admin\Modulas E-commerce\frontend'
$tsc = npx tsc --noEmit 2>&1 | Out-String
if ($tsc.Trim().Length -eq 0) { Write-Output "TSC: ZERO ERRORS" } else { Write-Output $tsc.Substring(0, [Math]::Min(4000, $tsc.Length)) }
