/**
 * @file event
 * @author Gavin
 */

import {ipcMain, BrowserWindow, BrowserView} from 'electron';
import winax from 'winax';
import {State} from './index';

export default {
    install(state: State) {
        ipcMain.handle('openWindow', (e, data) => {
            const win = new BrowserWindow({
                width: data.width || 0,
                height: data.width || 0,
                title: data.title || '',
                fullscreen: data.fullscreen || false,
                webPreferences: {
                    plugins: true,
                    webviewTag: true,
                    nodeIntegration: true
                }
            });

            win.loadURL(data.urlOptions.url, data.urlOptions);
            win.menuBarVisible = false;
            win.webContents.on('dom-ready', () => {
                if (data.title) {
                    win.setTitle(data.title);
                }
            });
        });

        ipcMain.on('dm', (e, str) => {
            const func = new Function('return ' + str);
            state.winax = winax;
            const res = func.call(state);
            e.reply('dm', res);
        });
    }
}