/**
 * @file event
 * @author Gavin
 */

import {ipcMain, BrowserWindow} from 'electron';
import {State} from './index';

export default {
    install(state: State) {
        ipcMain.on('game:open', (e, data) => {
            console.log('a1a4adds');
            const win = new BrowserWindow({
                title: 'game-helper-window',
                width: 800,
                height: 500,
                webPreferences: {
                    plugins: true
                }
            });
            win.loadURL(data.url);
        });
    }
}