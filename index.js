const { spawn } = require('child_process');
const http = require('http');

// 1. Start the Dummy HTTP Server for Railway Health Check
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Clawdbot is running!');
});

server.listen(port, () => {
  console.log(`Fake HTTP server listening on port ${port} for Railway health check.`);
});

// 2. Start Clawdbot Gateway
console.log('Starting Clawdbot Gateway...');
const clawdbot = spawn('npx', ['clawdbot', 'gateway', '--allow-unconfigured'], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env,
    CLAWDBOT_CONFIG_FILE: 'clawdbot.json'
  }
});

clawdbot.on('close', (code) => {
  console.log(`Clawdbot process exited with code ${code}`);
  process.exit(code);
});
