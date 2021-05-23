/**
 * @file game
 * @author Gavin
 */

import {app, BrowserWindow} from 'electron';
import debug from '../common/debug';
import event from './event';
import dmDll from './dm';

export interface State {
    [propName: string]: any;
}

function installModule() {
    const state: State = {};
    dmDll.install(state);
    event.install(state);
}

function createWindow() {
    const url = debug.isDev()
        ? 'http://localhost:8080/index.html'
        : `file://${__dirname}/index.html`;

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL(url);
}

app.on('ready', () => {
    installModule();
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