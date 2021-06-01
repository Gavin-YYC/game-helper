/**
 * @file utils
 * @author Gavin
 */

import delay from 'delay';
import dm from './dm';
import mapPoint from './conf/point.json';

type PointArr = (string | number)[];
type Point = string | PointArr;

function ensureArray(point: Point): PointArr {
    if (Array.isArray(point)) {
        return point as PointArr;
    }

    return (mapPoint as any)[point as string];
}

export default {
    /**
     * 指定位置的点是否正确
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
    async checkColor(pointNameOrPoint: Point) {
        const p = ensureArray(pointNameOrPoint);
        const color = await dm.GetColor(p[0] as number, p[1] as number);
        return color === p[2];
    },

    /**
     * 在范围内查找是否存在字库内的文字
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
    async findWord(pointNameOrPoint: any) {
        const p = ensureArray(pointNameOrPoint);
        return await dm.FindStrFastExS(
            p[0] as number,
            p[1] as number,
            p[2] as number,
            p[3] as number,
            p[4] as string,
            p[5] as string,
            0.8
        );
    },

    /**
     * 点击点的中心
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     */
    async clickPointCenter(pointNameOrPoint: any) {
        const p = ensureArray(pointNameOrPoint);
        await dm.MoveTo(
            ((p[0] as number) + (p[2] as number)) / 2,
            ((p[1] as number) + (p[3] as number)) / 2
        );
        await dm.LeftClick();
    },

    /**
     * 查找窗口
     *
     * @param shoBox 点信息，字符串或直接数组，待检查的目标窗口
     * @param clickBox 点信息，字符串或直接数组，目标窗口不存在，需要点击的窗口
     * @param times 重试查找的次数
     */
    async tryOpenBox(shoBox: any, clickBox: any, times = 3) {
        const p1 = ensureArray(shoBox);
        const p2 = ensureArray(clickBox);
        const arr = new Array(times).fill(1).map((a, i) => i);
        let has = false;

        for (const i of arr) {
            const res = await this.findWord(p1);
            if (!res) {
                const hasIcon = await this.checkColor(p2);
                if (hasIcon) {
                    await dm.MoveTo(p2[0] as number, p2[1] as number);
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
     * 查找窗口
     *
     * @param shoBox 点信息，字符串或直接数组，待检查的目标窗口
     * @param clickBox 点信息，字符串或直接数组，目标窗口不存在，需要点击的窗口
     * @param times 重试查找的次数
     */
     async tryCloseBox(shoBox: any, clickBox: any, type = '', times = 3) {
        const p1 = ensureArray(shoBox);
        const p2 = ensureArray(clickBox);
        const arr = new Array(times).fill(1).map((a, i) => i);
        let done = false;

        for (const i of arr) {
            const res = await this.findWord(p1);
            if (!res) {
                done = true;
                break;
            }
            else {
                const hasIcon = type === 'color'
                    ? await this.checkColor(p2)
                    : await this.findWord(p2);
                if (hasIcon) {
                    await dm.MoveTo(p2[0] as number, p2[1] as number);
                    await dm.LeftClick();
                    await delay(500);
                }
            }
        }

        return done;
    },

    /**
     * 等待某个元素出现
     *
     * @param pointNameOrPoint 点信息，字符串或直接数组
     * @param timer 等待时长，毫秒数
     */
    async waitShow(pointNameOrPoint: any, duration = 1 * 60 * 1000) {
        const p = ensureArray(pointNameOrPoint);

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
