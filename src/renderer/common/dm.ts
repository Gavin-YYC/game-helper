/**
 * @file dm
 * @author Gavin
 */

import {ipcRenderer} from 'electron';
import store from '../common/store';

function getPromise(str: string) {
    return new Promise((resolve) => {
        ipcRenderer.once('dm', (e, data) => {
            const match = str.match(/this.dm.([a-z]+)\(/i);
            const name = match && match[1];
            store.commit('addLog', {name, data, time: Date.now()});
            resolve(data);
        });
        ipcRenderer.send('dm', str);
    });
}

export default {
    async FindWindow(cls: string, title: string): Promise<number> {
        const str = `this.dm.FindWindow('${cls}', '${title}')`;
        return await getPromise(str) as number;
    },

    async SetWindowSize(hwnd: number, width: number, height: number): Promise<number> {
        const str = `this.dm.SetWindowSize(${hwnd}, ${width}, ${height})`;
        return await getPromise(str) as number;
    },

    async MoveWindow(hwnd: number, x: number, y: number): Promise<number> {
        const str = `this.dm.MoveWindow(${hwnd}, ${x}, ${y})`;
        return await getPromise(str) as number;
    },

    async BindWindow(hwnd: number, display: string, mouse: string, keypad: string, mode: number): Promise<number> {
        const str = `this.dm.BindWindow(${hwnd}, '${display}', '${mouse}', '${keypad}', ${mode})`;
        return await getPromise(str) as number;
    },

    async BindWindowEx(hwnd: number, display: string, mouse: string, keypad: string, publics: string, mode: number): Promise<number> {
        const str = `this.dm.BindWindowEx(${hwnd}, '${display}', '${mouse}', '${keypad}', '${publics}', ${mode})`;
        return await getPromise(str) as number;
    },

    async GetBindWindow(): Promise<number> {
        const str = `this.dm.GetBindWindow()`;
        return await getPromise(str) as number;
    },

    async UnBindWindow(): Promise<number> {
        const str = `this.dm.UnBindWindow()`;
        return await getPromise(str) as number;
    },

    async GetClientSize(hwnd: number): Promise<{[p: string]: number}> {
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
        return await getPromise(str) as {[p: string]: number};

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

    async KeyPress(code: number): Promise<number> {
        const str = `this.dm.KeyPress(${code})`;
        return await getPromise(str) as number;
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

    async GetColor(x: number, y: number): Promise<string> {
        const str = `this.dm.GetColor(${x}, ${y})`;
        return await getPromise(str) as string;
    },

    async CapturePng(x1: number, y1: number, x2: number, y2: number, file: string) {
        const str = `this.dm.CapturePng(${x1}, ${y1}, ${x2}, ${y2}, '${file}')`;
        return await getPromise(str);
    },

    async GetLastError() {
        const str = `this.dm.GetLastError()`;
        return await getPromise(str); 
    },

    async FindStrFastExS(x1: number, y1: number, x2: number, y2: number, string: string, colorFormat: string, sim: number) {
        const str = `this.dm.FindStrFastExS(${x1}, ${y1}, ${x2}, ${y2}, '${string}', '${colorFormat}', ${sim})`;
        return await getPromise(str); 
    }
};
