const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i);
    if (charCode > 127) {
        console.log(`Non-ASCII at ${i}: ${content[i]} (code: ${charCode}) around: ${content.substring(i-10, i+10)}`);
    }
}
