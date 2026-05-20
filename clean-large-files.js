const fs = require('fs');
const path = require('path');

const filesToClean = [
    { path: "d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\BillingDesk\\BillingDeskGenerateBill.jsx", startLine: 4431 },
    { path: "d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Doctor\\DoctorMySchedule.jsx", startLine: 2620 },
    { path: "d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Patient\\HomePage.jsx", startLine: 1410 }
];

console.log("=== Cleaning Large Files ===\n");

filesToClean.forEach(({ path: filepath, startLine }) => {
    const filename = path.basename(filepath);
    
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    
    const originalCount = lines.length;
    const cleanedLines = lines.slice(startLine - 1);
    
    fs.writeFileSync(filepath, cleanedLines.join('\n'), 'utf8');
    
    const deleted = originalCount - cleanedLines.length;
    const pct = Math.round((deleted / originalCount) * 100);
    
    console.log(`✓ ${filename}`);
    console.log(`  Original: ${originalCount} lines`);
    console.log(`  New: ${cleanedLines.length} lines`);
    console.log(`  Deleted: ${deleted} lines (${pct}% reduction)\n`);
});

console.log("=== Cleanup Complete ===");
