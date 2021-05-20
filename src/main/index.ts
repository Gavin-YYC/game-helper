/**
 * @file game
 * @author Gavin
 */

import {app, BrowserWindow, ipcMain} from 'electron';
import dmDll from './lib/dm';
import dmConf from '../../.reginfo.json';

const dm = dmDll.install({
    regCode: dmConf.reg_code,
    verInfo: dmConf.ver_info
});

ipcMain.addListener('dm.Ver', () => {
  console.log(dm.Ver());
});

function createWindow () {
    const url = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/index.html'
      : './index.html';
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });


    win.loadURL(url);
    win.webContents.on('did-finish-load', () => {
      win.webContents.openDevTools();
    });
}

app.on('ready', () => {
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