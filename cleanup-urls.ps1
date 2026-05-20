# Frontend Cleanup Script
Write-Host "=== Frontend Cleanup Starting ===" -ForegroundColor Cyan

# Define URL mappings
$urlMap = @{
    "'http://localhost:2003" = "```${import.meta.env.VITE_LOGIN_SERVICE_URL}"
    "'http://localhost:2002" = "```${import.meta.env.VITE_USERS_SERVICE_URL}"
    "'http://localhost:2005" = "```${import.meta.env.VITE_DOCTOR_SERVICE_URL}"
    "'http://localhost:2008" = "```${import.meta.env.VITE_PATIENT_SERVICE_URL}"
    "'http://localhost:2009" = "```${import.meta.env.VITE_BILL_SERVICE_URL}"
    "'http://localhost:2010" = "```${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}"
    "'http://localhost:2006" = "```${import.meta.env.VITE_MEDICAL_RECORD_SERVICE_URL}"
    "'http://localhost:2007" = "```${import.meta.env.VITE_DOCTOR_RATING_SERVICE_URL}"
    "'http://localhost:2012" = "```${import.meta.env.VITE_NURSE_CHECKUP_SERVICE_URL}"
}

$srcPath = "d:\Capstone\cap-stone-frontned\capstone-opd\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx"

$count = 0
foreach ($file in $files) {
    $modified = $false
    $content = Get-Content $file.FullName -Raw
    
    foreach ($old in $urlMap.Keys) {
        if ($content -like "*$old*") {
            $content = $content.Replace($old, $urlMap[$old])
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "Complete! Modified $count files" -ForegroundColor Green
