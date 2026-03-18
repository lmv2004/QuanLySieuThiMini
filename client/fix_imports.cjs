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
    
    // Replace import { TableActions } from '../../components/Manage/TableActions';
    // with import { TableActions } from '../../components/TableActions';
    const regex = /\.\.\/\.\.\/components\/Manage\/TableActions/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '../../components/TableActions');
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Fixed', path.basename(file));
    }
});

console.log(`Fixed ${modifiedCount} files`);
