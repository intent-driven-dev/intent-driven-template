'use strict';

const { spawn } = require('node:child_process');
const path = require('node:path');

const SERVER = path.resolve(__dirname, '..', '..', 'src', 'server.js');

// Boots the real application as a child process and resolves with its base URL.
function startApp({ dataFile }) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SERVER], {
      env: { ...process.env, PORT: '0', DATA_FILE: dataFile },
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    let output = '';
    child.once('error', reject);
    child.once('exit', (code) => reject(new Error(`app exited early with code ${code}`)));
    child.stdout.on('data', (chunk) => {
      output += chunk;
      const match = output.match(/listening on (\d+)/);
      if (match) {
        child.removeAllListeners('exit');
        resolve({ child, baseUrl: `http://127.0.0.1:${match[1]}` });
      }
    });
  });
}

function stopApp(child) {
  return new Promise((resolve) => {
    child.once('exit', resolve);
    child.kill();
  });
}

module.exports = { startApp, stopApp };
