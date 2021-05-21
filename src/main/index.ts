/**
 * @file game
 * @author Gavin
 */

import debug from '../common/debug';
import {app, BrowserWindow, ipcMain} from 'electron';
import dmDll from './dm';
import dmConf from '../../.reginfo.json';

const dm = dmDll.install({
    regCode: dmConf.reg_code,
    verInfo: dmConf.ver_info
});

ipcMain.on('dm.Ver', e => {
  e.reply('dm.Ver', dm.Ver());
});

function createWindow () {
    const url = debug.isDev()
      ? 'http://localhost:8080/index.html'
      : `file://${__dirname}/index.html`;

    console.log(url);

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