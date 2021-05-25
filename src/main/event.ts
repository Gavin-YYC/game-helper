/**
 * @file event
 * @author Gavin
 */

import {ipcMain} from 'electron';
import {State} from './index';

export default {
    install(state: State) {
        ipcMain.on('dm', (e, str) => {
            const func = new Function('return ' + str);
            const res = func.call(state.dm);
            e.reply('dm', res);
        });
    }
}