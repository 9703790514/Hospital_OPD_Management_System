# Remove Console Statements Script
Write-Host "=== Removing Console Statements ===" -ForegroundColor Cyan

$srcPath = "d:\Capstone\cap-stone-frontned\capstone-opd\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx"

$totalRemoved = 0
$filesModified = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $newLines = @()
    $removed = 0
    
    foreach ($line in $lines) {
        # Check if line is not already commented and contains console statement
        if (($line -notmatch '^\s*//' ) -and ($line -match 'console\.(log|error|warn|debug)\(')) {
            $removed++
            continue # Skip this line
        }
        $newLines += $line
    }
    
    if ($removed -gt 0) {
        $newLines | Set-Content $file.FullName -Encoding UTF8
        $totalRemoved += $removed
        $filesModified++
        Write-Host "Cleaned $($file.Name): $removed statements removed"
    }
}

Write-Host ""
Write-Host "Complete! $totalRemoved console statements removed from $filesModified files" -ForegroundColor Green
