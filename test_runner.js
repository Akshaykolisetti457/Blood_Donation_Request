const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const SCREENSHOT_PATH = "C:\\Users\\Akshay\\.gemini\\antigravity-ide\\brain\\f4295f02-7de8-4716-81c1-ff7e165ba346\\screenshot.png";
const PROFILE_DIR = "C:\\Users\\Akshay\\.gemini\\antigravity-ide\\brain\\f4295f02-7de8-4716-81c1-ff7e165ba346\\chrome-profile";

async function main() {
    console.log("Starting Chrome...");
    if (!fs.existsSync(PROFILE_DIR)) {
        fs.mkdirSync(PROFILE_DIR, { recursive: true });
    }

    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${PORT}`,
        '--disable-gpu',
        `--user-data-dir=${PROFILE_DIR}`,
        '--window-size=1280,1024',
        'http://127.0.0.1:8000'
    ]);

    chrome.on('error', (err) => {
        console.error("Chrome spawn error:", err);
    });

    // Wait for Chrome port to open
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get targets list
    let targets;
    try {
        targets = await getJSON(`http://127.0.0.1:${PORT}/json`);
    } catch (e) {
        console.error("Failed to get targets from Chrome:", e.message);
        chrome.kill();
        process.exit(1);
    }

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
        console.error("No active page target found in Chrome.");
        chrome.kill();
        process.exit(1);
    }

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    let messageId = 1;
    const pendingPromises = new Map();

    function sendCommand(method, params = {}) {
        const id = messageId++;
        const msg = JSON.stringify({ id, method, params });
        ws.send(msg);
        return new Promise((resolve, reject) => {
            pendingPromises.set(id, { resolve, reject });
        });
    }

    ws.onopen = async () => {
        console.log("WebSocket connected. Enabling Console and Runtime...");
        try {
            await sendCommand("Runtime.enable");
            await sendCommand("Log.enable");
            console.log("Waiting 2 seconds for initial animations...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Clicking 'Enter App' button...");
            const clickRes = await sendCommand("Runtime.evaluate", { 
                expression: "document.getElementById('enterBtn').click();" 
            });
            console.log("Click result:", JSON.stringify(clickRes));

            console.log("Waiting 3 seconds for dashboard to load and transition...");
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log("Capturing screenshot of dashboard...");
            const result = await sendCommand("Page.captureScreenshot", { format: 'png' });
            const buffer = Buffer.from(result.result.data, 'base64');
            fs.writeFileSync(SCREENSHOT_PATH, buffer);
            console.log("Screenshot written to:", SCREENSHOT_PATH);
        } catch (err) {
            console.error("Error during devtools interaction:", err);
        } finally {
            console.log("Closing WebSocket and killing Chrome...");
            ws.close();
            chrome.kill();
            process.exit(0);
        }
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && pendingPromises.has(data.id)) {
            const { resolve, reject } = pendingPromises.get(data.id);
            pendingPromises.delete(data.id);
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data);
            }
        } else if (data.method === "Runtime.consoleAPICalled") {
            const args = data.params.args.map(a => a.value !== undefined ? a.value : JSON.stringify(a)).join(' ');
            console.log(`[BROWSER CONSOLE] [${data.params.type}] ${args}`);
        } else if (data.method === "Runtime.exceptionThrown") {
            console.error(`[BROWSER EXCEPTION]`, JSON.stringify(data.params.exceptionDetails));
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        chrome.kill();
        process.exit(1);
    };
}

function getJSON(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

main().catch(err => {
    console.error("Main execution failed:", err);
});
