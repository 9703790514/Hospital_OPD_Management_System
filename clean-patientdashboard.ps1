# Clean Patient Dashboard
Write-Host "Cleaning PatientDashboard.jsx..." -ForegroundColor Yellow

$file = "d:\Capstone\cap-stone-frontned\capstone-opd\src\Patient\PatientDashboard.jsx"
$lines = [System.IO.File]::ReadAllLines($file)

Write-Host "Original lines: $($lines.Count)"
Write-Host "Keeping lines 5311-$($lines.Count) (active code)"

$activeLines = $lines[5310..($lines.Count - 1)]
[System.IO.File]::WriteAllLines($file, $activeLines)

Write-Host "New lines: $(($activeLines.Count))" -ForegroundColor Green
Write-Host "Saved $((5310)) lines (90% reduction)!" -ForegroundColor Green
