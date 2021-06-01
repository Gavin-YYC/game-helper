/**
 * @file dm functions
 * @author Gavin
 */

import delay from 'delay';
import dm from './dm';
import storage from './data';
import mapPoint from './conf/point.json';
import settings from './conf/settings.json';
import utils from './game.utils';
import log from './log';

type FubenName = 'qg' | 'qh' | 'dj' | 'yb' | 'zs' | 'zb' | 'zsh';

export default {
    // 绑定窗口
    async bindWindow(): Promise<number> {
        const name = '迅雷';
        const cls = 'Chrome_WidgetWin_0';
        const oldHwnd = await dm.GetBindWindow();
        if (oldHwnd) {
            await dm.UnBindWindow();
        }

        const hwnd = await dm.FindWindow(cls, name);
        if (hwnd) {
            const rect = await dm.GetClientSize(hwnd);
            await dm.SetWindowSize(hwnd, rect.width, rect.height);
            await dm.MoveWindow(hwnd, -10, -10);
            return await dm.BindWindowEx(hwnd, 'gdi', 'windows3', 'windows', '', 0);
        }

        return 0;
    },

    // 是否在游戏内
    // 判断某个点的值是否正确
    async checkInGame() {
        return await utils.checkColor('inGame');
    },

    // 初始化设置
    async autoSetting() {
        // 最大化游戏窗口
        const points = mapPoint['closeMap'];
        for (const p of points) {
            if (await utils.checkColor(p)) {
                await dm.MoveTo(p[0] as number, p[1] as number);
                await dm.LeftClick();
                await delay(300);
            }
        }

        // 屏蔽与声音
        const actionMap = ['pingbi', 'shengyin'];
        for (const name of actionMap) {
            const res = await utils.findWord(name);
            if (res) {
                await utils.clickPointCenter(name);
                await delay(1000);
            }
        }
    },

    async fubenSingle(task: any, fuben: any) {
        // 打开副本窗口
        const hasBox = await utils.tryOpenBox(fuben.title, fuben.icon);
        if (!hasBox) return 'fuben box not found';

        // 选中任务
        await utils.clickPointCenter(task);
        await delay(500);

        // 判断已经做完了
        const isZero = await utils.findWord(fuben.zero);
        if (isZero) return 'over';

        // 进入副本
        await utils.clickPointCenter(fuben.enter);
        await delay(2000);
        const isInFb = await utils.findWord(fuben.exit);
        if (!isInFb) return 'not in game';

        // 鼓舞
        await utils.clickPointCenter(fuben.guwu);

        // 等待结束
        const isEnd = await utils.waitShow(fuben.lingqu, 3 * 60 * 1000);
        if (isEnd) {
            await utils.clickPointCenter(fuben.lingqu);
            await delay(3000);
            return 'done';
        }
        else {
            return 'end not found';
        }
    },

    // 自动副本
    // 每个副本失败3次就自动跳过
    async autoFuben() {
        const maxErrorTimes = 3;
        const fuben = mapPoint.fuben;
        const tasks = Object.keys(fuben.tasks) as FubenName[];
        const tasksConfig = settings.fuben;
        const store = storage.get('fuben') || {};
        const doList = tasks.filter(n => store[n] !== 1);

        for (const task of doList) {
            log.info(`|- 开始副本${task}`);
            const point = fuben.tasks[task];
            let isDone = false;
            let num = 0;
            let errNum = 0;
            do {
                const status = await this.fubenSingle(point, fuben);
                if (status === 'over') {
                    isDone = true;
                    store[task] = 1;
                    storage.set('fuben', store);
                    log.info(` - 当前副本已经做完`);
                }
                else if (status === 'done') {
                    log.info(` - 完成${++num}次`);
                }
                else {
                    log.info(`- Error: ${status}`);
                    if (++errNum >= maxErrorTimes) {
                        isDone = true;
                    }
                }
            }
            while (!isDone);
        }

        // 关闭副本窗口
        await utils.tryCloseBox(fuben.title, fuben.close);
    }
};

