/**
 * @file dm functions
 * @author Gavin
 */

import dm from './dm';
import delay from 'delay';

// 点位信息
const mapPoint: any = {
    closeMap: [[348, 421, 'ffffff'], [1893, 95, 'ffffff'], [1540, 181, 'ffffff']],
    pingbi: [1880, 197, 1902, 219, 'pb', 'aa955d-333333|ffe9b3-333333'],
    shengyin: [1770, 224, 1792, 246, 'sy', 'be8f11-333333'],
    inGame: [815, 1026, '9de100'],
    fuben: {
        icon: [1320, 101, '3730b0'],
        title: [916, 188, 1096, 217, 'drfb', 'eed89c-444444|ce912e-333333|f7f3e7-333333'],
        zero: [619, 714, 730, 748, 'num_0', '22bb11-000000'],
        enter: [941, 719, 1054, 751, 'fb_jr', 'ffffbd-555555|fcdd71-444444'],
        guwu: [670, 771, 762, 861],
        exit: [1698, 569, 1806, 612, 'fb_tc', 'e3be64-333333'],
        lingqu: [872, 694, 1017, 738, 'fb_lq', 'f3f3d3-666666'],
        tasks: [
            [617, 236, 695, 265, 'fb_qg', 'eedd44-000000|aa7733-000000'],
            [734, 238, 812, 267, 'fb_qh', 'eedd44-000000|aa7733-000000'],
            [848, 239, 926, 268, 'fb_yb', 'eedd44-000000|aa7733-000000'],
            [961, 237, 1039, 266, 'fb_dj', 'eedd44-000000|aa7733-000000'],
            [1076, 238, 1154, 267, 'fb_zs', 'eedd44-000000|aa7733-000000'],
            [1188, 238, 1266, 267, 'fb_zb', 'eedd44-000000|aa7733-000000'],
            [1301, 236, 1379, 265, 'fb_zsh', 'eedd44-000000|aa7733-000000']
        ]
    }
};

// 点位工具函数
const pointUtils = {
    /**
     * 指定位置的点是否正确
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
     async checkColor(pointNameOrPoint: any) {
        const p = Array.isArray(pointNameOrPoint)
            ? pointNameOrPoint
            : mapPoint[pointNameOrPoint];
        const color = await dm.GetColor(p[0], p[1]);
        return color === p[2];
    },

    /**
     * 在范围内查找是否存在字库内的文字
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
    async findWord(pointNameOrPoint: any) {
        const p = Array.isArray(pointNameOrPoint)
            ? pointNameOrPoint
            : mapPoint[pointNameOrPoint];
        return await dm.FindStrFastExS(p[0], p[1], p[2], p[3], p[4], p[5], 0.8);
    },

    /**
     * 点击点的中心
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
    async clickPointCenter(pointNameOrPoint: any) {
        const p = Array.isArray(pointNameOrPoint)
            ? pointNameOrPoint
            : mapPoint[pointNameOrPoint];
        await dm.MoveTo((p[0] + p[2]) / 2, (p[1] + p[3]) / 2);
        await dm.LeftClick();
    },

    /**
     * 查找窗口
     *
     * @param shoBox 点信息，字符串或直接数组，待检查的目标窗口
     * @param clickBox 点信息，字符串或直接数组，目标窗口不存在，需要点击的窗口
     * @param times 重试查找的次数
     */
    async tryFindBox(shoBox: any, clickBox: any, times = 3) {
        const p1 = Array.isArray(shoBox) ? shoBox : mapPoint[shoBox];
        const p2 = Array.isArray(clickBox) ? clickBox : mapPoint[clickBox];
        const arr = new Array(times).fill(1).map((a, i) => i);
        let has = false;

        for (const i of arr) {
            const res = await pointUtils.findWord(p1);
            if (!res) {
                const hasIcon = await pointUtils.checkColor(p2);
                if (hasIcon) {
                    await dm.MoveTo(p2[0], p2[1]);
                    await dm.LeftClick();
                    await delay(500);
                }
            }
            else {
                has = true;
                break;
            }
        }

        return has;
    },

    /**
     * 等待某个元素出现
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     * @param timer 等待时长，毫秒数
     */
    async waitShow(pointNameOrPoint: any, duration = 1 * 60 * 1000) {
        const p = Array.isArray(pointNameOrPoint)
            ? pointNameOrPoint
            : mapPoint[pointNameOrPoint];

        let has = false;
        let dur = 2000;
        let arr = new Array(Math.floor(duration / dur)).fill(1).map((a, i) => i);

        for (const i of arr) {
            const res = await this.findWord(p);
            await delay(2000);
            if (res) {
                has = true;
                break;
            }
        }

        return has;
    }
};

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
        return await pointUtils.checkColor('inGame');
    },

    // 初始化设置
    async autoSetting() {
        // 最大化游戏窗口
        const points = mapPoint['closeMap'];
        for (const p of points) {
            if (await pointUtils.checkColor(p)) {
                await dm.MoveTo(p[0], p[1]);
                await dm.LeftClick();
                await delay(300);
            }
        }

        // 屏蔽与声音
        const actionMap = ['pingbi', 'shengyin'];
        for (const name of actionMap) {
            const res = await pointUtils.findWord(name);
            if (res) {
                await pointUtils.clickPointCenter(name);
                await delay(1000);
            }
        }
    },

    // 自动副本
    async autoFuben() {
        const {icon, title, tasks, zero, enter, guwu, exit, lingqu} = mapPoint.fuben;

        // 打开副本窗口
        const hasBox = await pointUtils.tryFindBox(title, icon);
        if (!hasBox) {
            return;
        }

        // 循环做副本
        for (const task of tasks) {
            console.log('dfqw');
            await pointUtils.clickPointCenter(task);
            await delay(500);

            // 是不是已经做完了
            const isZero = await pointUtils.findWord(zero);
            if (isZero) {
                continue;
            }

            // 进入副本
            await pointUtils.clickPointCenter(enter);
            await delay(500);
            const isInFb = await pointUtils.findWord(exit);
            if (!isInFb) {
                break;
            }

            // 鼓舞
            await pointUtils.clickPointCenter(guwu);

            // 等待结束
            const isEnd = await pointUtils.waitShow(lingqu, 3 * 60 * 1000);
            if (isEnd) {
                await pointUtils.clickPointCenter(lingqu);
            }
        }
    }
};

