/**
 * @file dm
 * @author Gavin
 */

import {ipcRenderer} from 'electron';

function getPromise(str: string) {
    return new Promise((resolve) => {
        ipcRenderer.once('dm', (e, data) => {
            resolve(data);
        });
        ipcRenderer.send('dm', str);
    });
}

export default {
    async FindWindow(cls: string, title: string) {
        const str = `this.FindWindow('${cls}', '${title}')`;
        return await getPromise(str);
    },

    async SetWindowSize(hwnd: string, width: number, height: number) {
        const str = `this.SetWindowSize(${hwnd}, ${width}, ${height})`;
        return await getPromise(str);
    },

    async MoveWindow(hwnd: string, x: number, y: number) {
        const str = `this.MoveWindow(${hwnd}, ${x}, ${y})`;
        return await getPromise(str);
    },

    async BindWindow(hwnd: number, display: string, mouse: string, keypad: string, mode: number) {
        const str = `this.BindWindow(${hwnd}, '${display}', '${mouse}', '${keypad}', ${mode})`;
        return await getPromise(str);
    }
};
