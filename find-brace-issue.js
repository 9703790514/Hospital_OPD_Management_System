const fs = require('fs');

const file = 'd:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Components\\ForgotPasswordPage.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

let braceCount = 0;
for (let i = 0; i < 200; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    
    if (braceCount < 0 || (i > 50 && i < 195 && braceCount > 5)) {
        console.log(`Line ${i + 1}: brace count = ${braceCount} | ${line.trim().substring(0, 80)}`);
    }
}

console.log(`\nFinal brace count after 200 lines: ${braceCount}`);
console.log('(Should be close to 0 for balanced code)');
