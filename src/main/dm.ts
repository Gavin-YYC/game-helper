/**
 * @file dm
 * @author Gavin
 */

import winax from 'winax';
import path from 'path';
import {execSync} from 'child_process';
import dmConf from '../../.reginfo.json';
import debug from '../common/debug';
import {State} from './index';

interface Options {
    regCode: string;
    verInfo: string;
}

const log = debug.init('dm');
const ipList = '121.204.252.143|121.204.253.161|125.77.165.62|125.77.165.131';

// 注册
function getObj() {
    try {
        return new winax.Object('dm.dmsoft');
    }
    catch (e) {
        execSync(`regsvr32 ${path.join(__dirname, 'dm.dll')} /s`)
        return new winax.Object('dm.dmsoft')
    }
}

// 反注册
function uninstall() {
    try {
        execSync(`regsvr32 ${path.join(__dirname, 'dm.dll')} /s /u`);
        new winax.Object('dm.dmsoft');
    }
    catch (e) {
        if (e.message.includes('dm.dmsoft')) {
            log('Uninstall dm.dmsoft successful.');
        }
    }
    
}
 
export default {
    install(state: State) {
        this.uninstall();
        const dll = getObj();
        if (!dll) {
            log('Register dm.dmsoft failed.');
            process.exit();
        }

        let isVip = false;
        if (dmConf.regCode && dmConf.verInfo) {
            const reg = dll.RegEx(dmConf.regCode, dmConf.verInfo, ipList);
            // -1 无法连接网络，可能防火墙拦截，需要加上IP列表
            // -2 进程没有已管理员的方式运行
            // -8 版本附加信息长度超过了20
            // -9 版本附加信息里包含了非法字母
            // 0 失败，未知错误
            // 1 成功
            // 2 余额不足
            // 3 绑定了本机器，但是账户余额不足50元
            // 4 注册码错误
            // 5 你的机器或者IP在黑名单列表中或者不在白名单列表中
            // 6 非法使用插件
            // 7 你的帐号因为非法使用被封禁
            // 8 ver_info不在你设置的附加白名单中
            // 77 机器码或者IP因为非法使用，而被封禁
            isVip = reg === 1;
        }

        log('Install dm.dmsoft successful. Version:', dll.Ver());
        log(isVip ? 'Register dm.dmsoft VIP successful' : '');

        state.dm = dll;
    },

    uninstall() {
        uninstall();
    }
};
 