import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

process.env.ELECTRON_IS_KIOSK = 'true';

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    kiosk: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: isDev,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-kiosk-id', () => {
  return process.env.VITE_KIOSK_ID || 'kiosk-001';
});

ipcMain.on('notify-ready', () => {
  console.log('Kiosk UI is ready');
});
