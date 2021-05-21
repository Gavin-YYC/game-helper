/**
 * @file debug
 * @author Gavin
 */

import debug from 'debug';

export default {
    isDev() {
        return process.env.NODE_ENV === 'development';
    },

    init(namespace: string) {
        if (this.isDev()) {
            debug.enable(namespace);
            return debug(namespace);
        }

        return (...args: any[]) => {};
    }
};
