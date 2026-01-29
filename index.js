const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 1. Start the Dummy HTTP Server
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Clawdbot is running!');
});
server.listen(port, () => {
  console.log(`Fake HTTP server listening on port ${port}`);
});

// 2. FORCE Create Config File in HOME directory
// Clawdbot looks for ~/.clawdbot/clawdbot.json by default
const homeDir = os.homedir();
const configDir = path.join(homeDir, '.clawdbot');
const configFile = path.join(configDir, 'clawdbot.json');

const configContent = {
  gateway: {
    mode: "local"
  },
  agents: {
    defaults: {
      model: {
        primary: "google/gemini-3-pro-preview"
      }
    }
  },
  channels: {
    telegram: {
      enabled: true
    }
  },
  plugins: {
    entries: {
      telegram: {
        enabled: true
      }
    }
  },
  auth: {
    profiles: {
      "google:default": {
        "provider": "google",
        "mode": "api_key"
      }
    }
  }
};

try {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configFile, JSON.stringify(configContent, null, 2));
  console.log(`✅ FORCED config written to: ${configFile}`);
} catch (e) {
  console.error("❌ Failed to write config:", e);
}

// 3. Start Clawdbot Gateway
console.log('Starting Clawdbot Gateway...');
// Remove --allow-unconfigured to force it to read the file we just made
const clawdbot = spawn('npx', ['clawdbot', 'gateway'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

clawdbot.on('close', (code) => {
  console.log(`Clawdbot process exited with code ${code}`);
  process.exit(code);
});
