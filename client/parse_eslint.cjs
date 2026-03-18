const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));
const errors = data.filter(d => d.errorCount > 0);
let out = '';
errors.forEach(d => {
    out += '\n--- ' + d.filePath + ' ---\n';
    d.messages.forEach(m => out += `Line ${m.line}: ${m.message}\n`);
});
fs.writeFileSync('eslint_summary.txt', out);
