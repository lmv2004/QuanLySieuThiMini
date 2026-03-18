const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/pages');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir(srcDir, function(file) {
    if (!file.endsWith('.jsx')) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace addToast(`some string ${var}`, 'success') -> addToast('success', `some string ${var}`)
    // This regex looks for: addToast( <anything> , 'success' )
    // We assume the message doesn't contain ", 'success')"
    
    const regexSuccess = /addToast\((.+?),\s*(['"]success['"])\)/g;
    const regexError = /addToast\((.+?),\s*(['"]error['"])\)/g;
    
    let modified = false;
    
    content = content.replace(regexSuccess, (match, msgObj, typeStr) => {
        // If the match already starts with 'success', ignore
        if (msgObj.trim() === "'success'" || msgObj.trim() === '"success"') return match;
        modified = true;
        return `addToast(${typeStr}, ${msgObj})`;
    });

    content = content.replace(regexError, (match, msgObj, typeStr) => {
        if (msgObj.trim() === "'error'" || msgObj.trim() === '"error"') return match;
        modified = true;
        return `addToast(${typeStr}, ${msgObj})`;
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Fixed', path.basename(file));
    }
});

console.log(`Fixed ${modifiedCount} files`);
