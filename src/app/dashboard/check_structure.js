const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
let openBraces = 0, openParens = 0, openBrackets = 0;
const stack = [];

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') { openBraces++; stack.push({char, i}); }
    else if (char === '}') { openBraces--; stack.pop(); }
    else if (char === '(') { openParens++; stack.push({char, i}); }
    else if (char === ')') { openParens--; stack.pop(); }
    else if (char === '[') { openBrackets++; stack.push({char, i}); }
    else if (char === ']') { openBrackets--; stack.pop(); }
}

console.log(`Braces: ${openBraces}, Parens: ${openParens}, Brackets: ${openBrackets}`);
if (stack.length > 0) {
    console.log('Unclosed items:', stack.slice(-5));
}
