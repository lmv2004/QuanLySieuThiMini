const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));
const errors = data.filter(d => d.errorCount > 0);
errors.forEach(d => {
    console.log('\n--- ' + d.filePath + ' ---');
    d.messages.forEach(m => console.log(`Line ${m.line}: ${m.message}`));
});
