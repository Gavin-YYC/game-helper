/**
 * @file render entry
 * @author Gavin
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './views/index.vue';

Vue.use(VueRouter);

new Vue({
    el: '#app',
    render: h => h(index)
});
