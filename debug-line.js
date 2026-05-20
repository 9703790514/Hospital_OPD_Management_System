const fs = require('fs');

const file = 'd:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Components\\ForgotPasswordPage.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const line217 = lines[216]; // 0-indexed

console.log('Line 217 (0-indexed 216):');
console.log(line217);
console.log('\nCharacter analysis:');

for (let i = 0; i < Math.min(100, line217.length); i++) {
    const char = line217[i];
    const code = char.charCodeAt(0);
    
    if (char === '`') {
        console.log(`Position ${i}: BACKTICK (code ${code})`);
    } else if (char === "'" || char === '"') {
        console.log(`Position ${i}: QUOTE '${char}' (code ${code})`);
    } else if (char === '(' || char === ')') {
        console.log(`Position ${i}: PAREN '${char}' (code ${code})`);
    }
}
