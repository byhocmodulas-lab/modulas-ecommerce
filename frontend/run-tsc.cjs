#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('node_modules\\.bin\\tsc --noEmit', {
    encoding: 'utf8',
    timeout: 120000,
    cwd: 'C:\\Users\\Admin\\Modulas E-commerce\\frontend',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  fs.writeFileSync('C:\\Users\\Admin\\Modulas E-commerce\\frontend\\tsc-output.txt', 'TSC: ZERO ERRORS\n');
} catch (e) {
  const out = (e.stdout || '') + (e.stderr || '');
  fs.writeFileSync('C:\\Users\\Admin\\Modulas E-commerce\\frontend\\tsc-output.txt', out || e.message || 'Unknown error');
}
process.exit(0);
