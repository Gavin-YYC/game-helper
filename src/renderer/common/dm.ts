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
        const str = `this.dm.FindWindow('${cls}', '${title}')`;
        return await getPromise(str);
    },

    async SetWindowSize(hwnd: string, width: number, height: number) {
        const str = `this.dm.SetWindowSize(${hwnd}, ${width}, ${height})`;
        return await getPromise(str);
    },

    async MoveWindow(hwnd: string, x: number, y: number) {
        const str = `this.dm.MoveWindow(${hwnd}, ${x}, ${y})`;
        return await getPromise(str);
    },

    async BindWindow(hwnd: number, display: string, mouse: string, keypad: string, mode: number) {
        const str = `this.dm.BindWindow(${hwnd}, '${display}', '${mouse}', '${keypad}', ${mode})`;
        return await getPromise(str);
    },

    async BindWindowEx(hwnd: number, display: string, mouse: string, keypad: string, publics: string, mode: number) {
        const str = `this.dm.BindWindowEx(${hwnd}, '${display}', '${mouse}', '${keypad}', '${publics}', ${mode})`;
        return await getPromise(str);
    },

    async UnBindWindow() {
        const str = `this.dm.UnBindWindow()`;
        return await getPromise(str);
    },

    async GetClientSize(hwnd: number) {
        const str = `(() => {
            const width = new this.winax.Variant(-1, 'byref');
            const height = new this.winax.Variant(-1, 'byref');
            const res = this.dm.GetClientSize(${hwnd}, width, height);
            if (res) {
                return {
                    width: Number(width),
                    height: Number(height)
                };
            }
        })()`;
        return await getPromise(str);

    },

    // 找字
    async FindStr(x1: number, y1: number, x2: number, y2: number, string: string, colorFormat: string, sim: number, x: number, y: number) {
        const str = `this.dm.FindStrS(${x1}, ${y1}, ${x2}, ${y1}, '${string}', '${colorFormat}', ${sim}, ${x}, ${y})`;
        return await getPromise(str);
    },

    // 设置字库
    async SetDict(index: number, file: string) {
        const str = `this.dm.SetDict(${index}, '${file}'})`;
        return await getPromise(str);
    },

    // 鼠标
    async MoveTo(x: number, y: number) {
        const str = `this.dm.MoveTo(${x}, ${y})`;
        return await getPromise(str);
    },

    async LeftClick() {
        const str = `this.dm.LeftClick()`;
        return await getPromise(str);
    },

    async KeyPressStr(string: string) {
        const str = `this.dm.KeyPressStr('${string}', 100)`;
        return await getPromise(str);
    },

    // 图色
    async CmpColor(x: number, y: number, color: string, sim: number) {
        const str = `this.dm.CmpColor(${x}, ${y}, '${color}', '${sim}')`;
        return await getPromise(str);
    },

    async GetColor(x: number, y: number) {
        const str = `this.dm.GetColor(${x}, ${y})`;
        return await getPromise(str);
    },

    async CapturePng(x1: number, y1: number, x2: number, y2: number, file: string) {
        const str = `this.dm.CapturePng(${x1}, ${y1}, ${x2}, ${y2}, '${file}')`;
        return await getPromise(str);
    },

    async GetLastError() {
        const str = `this.dm.GetLastError()`;
        return await getPromise(str); 
    }
};
