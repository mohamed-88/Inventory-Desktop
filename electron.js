const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs'); // fs بهێتە وەرگرتن
const { fork } = require('child_process');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const isDev = !app.isPackaged;

function createWindow() {
  // --- گوهورینا سەرەکی ل ڤێرەیە ---
  if (!isDev) {
    // 1. رێکا ستاندارد بۆ داتایێن بەرنامەی
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'inventory.db');

    // 2. پشتراستبوون کو فایلێ داتابەیسێ هەیە
    // ئەگەر نەبیت، ئەم دێ وی ژ فایلێن بەرنامەی کۆپی کەین
    if (!fs.existsSync(dbPath)) {
      const sourceDbPath = path.join(process.resourcesPath, 'inventory_dev.db');
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, dbPath);
        console.log(`Database copied to ${dbPath}`);
      } else {
        console.error('Source database not found in resources!');
      }
    }
    
    // 3. سێرڤەری ب رێکا نوی کار پێ بکە
    const serverPath = path.join(__dirname, 'server', 'server.js');
    fork(serverPath, [], { env: { ...process.env, DB_PATH: dbPath } });
  }
  // ---------------------------------

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'client/build/index.html' )}`;
  win.loadURL(startUrl);

  // DevTools بهێلە ڤەکری بۆ تاقیکرنا دوماهیێ
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
