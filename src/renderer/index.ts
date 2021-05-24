/**
 * @file render entry
 * @author Gavin
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import app from './views/index.vue';
import Home from './views/Home.vue';
import GameWindow from './views/GameWindow.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/game-window',
            component: GameWindow
        }
    ]
});

new Vue({
    router,
    render: h => h(app)
}).$mount('#app');
