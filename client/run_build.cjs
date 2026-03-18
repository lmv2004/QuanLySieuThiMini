const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('npx vite build', { encoding: 'utf8' });
  fs.writeFileSync('vite_error.txt', out.replace(/\x1b\[\d+m/g, ''));
  console.log('Build succeeded');
} catch (err) {
  let log = err.stdout ? err.stdout.toString() : '';
  log += '\n' + (err.stderr ? err.stderr.toString() : '');
  log += '\n' + (err.message ? err.message.toString() : '');
  fs.writeFileSync('vite_error.txt', log.replace(/\x1b\[\d+m/g, ''));
  console.log('Build failed, wrote to vite_error.txt');
}
