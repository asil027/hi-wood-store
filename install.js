const { spawn } = require('child_process');
const fs = require('fs');

console.log('Starting npm install runner...');

const npm = spawn('cmd.exe', ['/c', 'npm.cmd', 'install', '--no-audit', '--no-fund', '--verbose'], {
  cwd: __dirname,
  shell: false,
});

npm.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
});

npm.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

npm.on('close', (code) => {
  console.log(`npm process exited with code ${code}`);
  process.exit(code);
});
