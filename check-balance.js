const fs = require('fs');

const file = 'd:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Components\\ForgotPasswordPage.jsx';
const content = fs.readFileSync(file, 'utf8');

// Count braces, parens, and brackets
let openBraces = 0, closeBraces = 0;
let openParens = 0, closeParens = 0;
let openBrackets = 0, closeBrackets = 0;

const lines = content.split('\n');
for (let i = 0; i < Math.min(220, lines.length); i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') openBraces++;
        if (char === '}') closeBraces++;
        if (char === '(') openParens++;
        if (char === ')') closeParens++;
        if (char === '[') openBrackets++;
        if (char === ']') closeBrackets++;
    }
}

console.log(`Up to line 220:`);
console.log(`  Braces: ${openBraces} open, ${closeBraces} close (diff: ${openBraces - closeBraces})`);
console.log(`  Parens: ${openParens} open, ${closeParens} close (diff: ${openParens - closeParens})`);
console.log(`  Brackets: ${openBrackets} open, ${closeBrackets} close (diff: ${openBrackets - closeBrackets})`);

if (openBraces !== closeBraces || openParens !== closeParens || openBrackets !== closeBrackets) {
    console.log('\n⚠️  IMBALANCE DETECTED!');
}
