/**
 * @file render entry
 * @author Gavin
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import store from './common/store';
import app from './views/index.vue';
import Home from './views/Home.vue';

import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        }
    ]
});

new Vue({
    store,
    router,
    render: h => h(app)
}).$mount('#app');
