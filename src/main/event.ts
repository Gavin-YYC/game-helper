/**
 * @file event
 * @author Gavin
 */

import {ipcMain, BrowserWindow} from 'electron';
import {State} from './index';

export default {
    install(state: State) {
        ipcMain.on('game:open', (e, data) => {
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

        ipcMain.on('helper:start', e => {
            const res = state.dm.FindWindow('', 'electron-renderer-index');
            console.log(res);
        });
    }
}