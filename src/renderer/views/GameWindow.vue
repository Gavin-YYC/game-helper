<template>
    <div class="page">
        <div class="operations">
            <el-button @click="home">Home</el-button>
            <el-button @click="log">Log</el-button>
            <el-button @click="min">Minimize</el-button>
            <el-button @click="start">{{isStop ? 'Start' : 'Stop'}}</el-button>
        </div>

        <div v-if="url" class="webview">
            <iframe :src="url" :useragent="ua"></iframe>
        </div>
    </div>
</template>

<script>
import {Button} from 'element-ui';
import {ipcRenderer} from 'electron';
import dm from '../common/dm';

export default {
    data() {
        return {
            url: 'http://wan.xunlei.com/game-offical/105151620/play?gameid=105151620',
            ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            isStop: true
        };
    },

    components: {
        'el-button': Button
    },

    methods: {
        min() {

        },

        log() {

        },

        invokeDm(action, params) {
            return new Promise(resolve => {
                ipcRenderer.once('dm', (e, data) => {
                    resolve(data);
                });
                ipcRenderer.send('dm', action, params);
            });
        },

        async start() {
            this.isStop = !this.isStop;

            // 找到窗口句柄
            const hwnd = await dm.FindWindow('', 'electron-renderer-index');
            if (hwnd === 0) {
                return console.log('没有找到窗口句柄');
            }

            // 设置窗口宽高
            const sizeRes = await dm.SetWindowSize(hwnd, 800, 600);
            if (sizeRes === 0) {
                return console.log('设置窗口宽高失败');
            }

            // 设置窗口位置
            const posRes = await dm.MoveWindow(hwnd, 50, 50);
            if (posRes === 0) {
                return console.log('移动窗口失败');
            }

            // 后台绑定窗口
            const bindRes = await dm.BindWindow(hwnd, 'gdi', 'windows3', 'windows', 0);
            if (bindRes === 0) {
                return console.log('移动窗口失败');
            }

            console.log('窗口绑定成功');
        },

        home() {
            this.$router.push({path: '/'});
        }
    }
}
</script>

<style lang="less" scoped>
.page {
    display: flex;
    height: 100vh;
    flex-direction: column;
}
.operations {
    height: 50px;
}
.webview {
    flex: 1;
    border: 1px solid red;

    iframe {
        width: 100%;
        height: 100%;
        display: block;
        border: none;
    }
}
</style>
