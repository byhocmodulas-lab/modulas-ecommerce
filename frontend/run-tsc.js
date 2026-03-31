const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

process.chdir('c:\\Users\\Admin\\Modulas E-commerce\\frontend');

try {
  const output = execSync('npx tsc --noEmit 2>&1', {
    encoding: 'utf8',
    timeout: 120000,
    cwd: 'c:\\Users\\Admin\\Modulas E-commerce\\frontend'
  });
  fs.writeFileSync('tsc-output.txt', output || 'TSC: ZERO ERRORS');
} catch (e) {
  fs.writeFileSync('tsc-output.txt', e.stdout || e.stderr || e.message);
}
