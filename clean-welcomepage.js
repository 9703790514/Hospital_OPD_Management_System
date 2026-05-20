const fs = require('fs');

// Clean WelcomePage.jsx
const file = "d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Components\\WelcomePage.jsx";
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// The active code starts at line 284 (0-indexed: 283)
const cleanedLines = lines.slice(283);

fs.writeFileSync(file, cleanedLines.join('\n'), 'utf8');

console.log(`✓ WelcomePage.jsx cleaned`);
console.log(`  Original: ${lines.length} lines`);
console.log(`  New: ${cleanedLines.length} lines`);
console.log(`  Deleted: ${283} lines`);
