# Clean large files with commented code
Write-Host "=== Cleaning Large Files ===" -ForegroundColor Cyan

# BillingDeskConsultationBill.jsx: Keep lines 4203-end (delete 1-4202)
$file1 = "d:\Capstone\cap-stone-frontned\capstone-opd\src\BillingDesk\BillingDeskConsultationBill.jsx"
$lines1 = [System.IO.File]::ReadAllLines($file1)
$keep1 = $lines1[4202..($lines1.Count - 1)]
[System.IO.File]::WriteAllLines($file1, $keep1)
Write-Host "✓ BillingDeskConsultationBill.jsx: $($lines1.Count) -> $($keep1.Count) lines (deleted $((4202)) lines)" -ForegroundColor Green

# BillingDeskGenerateBill.jsx: Find active code start
$file2 = "d:\Capstone\cap-stone-frontned\capstone-opd\src\BillingDesk\BillingDeskGenerateBill.jsx"
$lines2 = [System.IO.File]::ReadAllLines($file2)
$activeStart2 = -1
for ($i = 0; $i -lt $lines2.Count; $i++) {
    if ($lines2[$i] -match '^import React' -and $lines2[$i] -notmatch '^\s*//') {
        $activeStart2 = $i
        break
    }
}
if ($activeStart2 -gt 0) {
    $keep2 = $lines2[$activeStart2..($lines2.Count - 1)]
    [System.IO.File]::WriteAllLines($file2, $keep2)
    Write-Host "✓ BillingDeskGenerateBill.jsx: $($lines2.Count) -> $($keep2.Count) lines (deleted $activeStart2 lines)" -ForegroundColor Green
}

# DoctorMySchedule.jsx
$file3 = "d:\Capstone\cap-stone-frontned\capstone-opd\src\Doctor\DoctorMySchedule.jsx"
$lines3 = [System.IO.File]::ReadAllLines($file3)
$activeStart3 = -1
for ($i = 0; $i -lt $lines3.Count; $i++) {
    if ($lines3[$i] -match '^import React' -and $lines3[$i] -notmatch '^\s*//') {
        $activeStart3 = $i
        break
    }
}
if ($activeStart3 -gt 0) {
    $keep3 = $lines3[$activeStart3..($lines3.Count - 1)]
    [System.IO.File]::WriteAllLines($file3, $keep3)
    Write-Host "✓ DoctorMySchedule.jsx: $($lines3.Count) -> $($keep3.Count) lines (deleted $activeStart3 lines)" -ForegroundColor Green
}

# HomePage.jsx
$file4 = "d:\Capstone\cap-stone-frontned\capstone-opd\src\Patient\HomePage.jsx"
$lines4 = [System.IO.File]::ReadAllLines($file4)
$activeStart4 = -1
for ($i = 0; $i -lt $lines4.Count; $i++) {
    if ($lines4[$i] -match '^import React' -and $lines4[$i] -notmatch '^\s*//') {
        $activeStart4 = $i
        break
    }
}
if ($activeStart4 -gt 0) {
    $keep4 = $lines4[$activeStart4..($lines4.Count - 1)]
    [System.IO.File]::WriteAllLines($file4, $keep4)
    Write-Host "✓ HomePage.jsx: $($lines4.Count) -> $($keep4.Count) lines (deleted $activeStart4 lines)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Green
