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
    if (!file.endsWith('ImportExport.jsx')) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace className="hidden" with style={{ display: 'none' }} for the file input
    const regex = /className=["']hidden["']/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, "style={{ display: 'none' }}");
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Fixed', path.basename(file));
    }
});

console.log(`Fixed ${modifiedCount} files`);
