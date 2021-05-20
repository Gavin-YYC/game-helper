/**
 * @file render entry
 * @author Gavin
 */

import Vue from 'vue';
import index from './views/index.vue';

new Vue({
    el: '#app',
    render: h => h(index)
});
