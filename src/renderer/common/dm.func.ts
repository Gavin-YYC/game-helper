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

    async findWindow() {
        const pName = '迅雷';
        const pClass = 'Chrome_WidgetWin_0';
        const secondClass = 'TbcWindowWin';
        const parentHwnd = await dm.FindWindow(pClass, pName);
        if (!parentHwnd) {
            console.log(`[${pName}][${pClass}]迅雷没有启动`);
            return 0;
        }

        // 最大化父窗口
        await dm.SetWindowSize(parentHwnd, screen.availWidth, screen.availHeight);
        await dm.MoveWindow(parentHwnd, 0, 0);

        const sendHwnd = await dm.FindWindowEx(parentHwnd, secondClass, '');
        if (!sendHwnd) {
            console.log(`[${secondClass}]没有打开游戏页面`);
            return 0;
        }

        const list = await dm.EnumWindow(sendHwnd, '', '', 16 + 32);
        const split = list.split(',').map(Number);
        return split[split.length - 1] || 0;
    },

    // 绑定窗口
    async bindWindow() {
        const hwnd = await this.findWindow();
        if (!hwnd) {
            return 0;
        }

        console.log(`获取到目标窗口${hwnd}`);
        return await dm.BindWindowEx(hwnd, 'gdi', 'dx.mouse.input.lock.api3', 'windows', '', 0);  
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
    },

    // 开vip宝箱
    async openVipBox() {
        const {go, box, open, again, ok, close} = mapPoint.vipBox;
        const hasGo = await utils.findWord(go);
        const hasBox = await utils.findWord(box);
        if (hasBox) {
            await utils.clickPointCenter(box);
            await delay(2000);

            for (const item of open) {
                const canGet = await utils.checkColor(item);
                if (!canGet) {
                    console.log('已经领完了');
                    continue;
                }

                await utils.clickPointCenter(item);
                await delay(3500);
                let hasNext = await utils.findWord(again);
                console.log('hasNext', hasNext);
                do {
                    await utils.clickPointCenter(again);
                    await delay(3500);
                    hasNext = await utils.findWord(again);
                    if (!hasNext) {
                        await utils.clickPointCenter(ok);
                        await delay(1000);
                    }
                }
                while (hasNext);
            }
        }
        else if (hasGo) {
            await utils.clickPointCenter(go);
            await delay(1000);
            this.openVipBox();
        }

        // 关闭窗口
        if (await utils.findWord(close)) {
            await utils.clickPointCenter(close);
        }
    }
};

