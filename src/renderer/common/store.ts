/**
 * @file store
 * @author Gavin
 */

import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        gameLogs: [] as any[]
    },

    mutations: {
        addLog(state: any, log: string) {
            state.gameLogs.unshift(log);
        }
    },

    actions: {
        addLog({commit}, data) {
            data.time =  moment().format('YYYY-MM-DD HH:mm:ss');
            commit('addLog', data);
        }
    }
});
