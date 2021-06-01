/**
 * @file data
 * @author Gavin
 * @description 数据管理
 */

import fs from 'fs';
import moment from 'moment';
import jsonData from './data.json';

/**
 * 按日期存放
 * {
 *     20210601: {
 *         fuben: {
 *             qh: 1,
 *             dj: 1
 *         }
 *     }
 * }
 */

export default {
    get(name: string) {
        const today = moment().format('YYYY-MM-DD');
        const data = (jsonData as any)[today];
        return data && data[name];
    },

    set(key: string, data: any) {
        (jsonData as any)[key] = data;
    }
}

