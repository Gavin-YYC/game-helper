/**
 * @file render entry
 * @author yyc
 */

import Vue from 'vue';
import index from './views/index.vue';

new Vue({
    el: '#app',
    render: h => h(index)
});
