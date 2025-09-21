// electron.js
const { app, BrowserWindow } = require('electron' );
const path = require('path');
const isDev = require('electron-is-dev');
const startServer = require('./server/server.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let startUrl;

  if (isDev) {
    startUrl = 'http://localhost:3000';
    win.webContents.openDevTools( );
  } else {
    startServer();
    startUrl = `file://${path.join(__dirname, 'client/build/index.html')}`;
  }

  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
