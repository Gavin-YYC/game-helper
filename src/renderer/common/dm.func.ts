/**
 * @file dm functions
 * @author Gavin
 */

import dm from './dm';

export default {
    async checkInGame() {
        const resa = await dm.GetColor(763, 979);
        console.log('aaaa', resa);
        const res = await dm.CmpColor(763, 989, '9de100-000000', 1.0);
        console.log('dsada', res);
    },

    async login(x1: number, y1: number, a: string, x2: number, y2: number, p: string, x3: number, y3: number) {
        // 账户
        await dm.MoveTo(x1, y1);
        await dm.LeftClick();
        await dm.KeyPressStr(a);

        // 密码
        await dm.MoveTo(x2, y2);
        await dm.LeftClick();
        await dm.KeyPressStr(p);

        // 登录
        await dm.MoveTo(x3, y3);
        await dm.LeftClick();
    }
};

