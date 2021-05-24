<template>
    <div class="page">
        <div>
            <button @click="home">Home</button>
            <button @click="log">Log</button>
            <button @click="min">Minimize</button>
            <button @click="start">{{isStop ? 'Start' : 'Stop'}}</button>
        </div>

        <div v-if="url" class="webview">
            <iframe :src="url" :useragent="ua"></iframe>
        </div>
    </div>
</template>

<script>
import {ipcRenderer} from 'electron';
export default {
    data() {
        return {
            url: 'http://wan.xunlei.com/game-offical/105151620/play?gameid=105151620',
            ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            isStop: true
        };
    },

    methods: {
        min() {

        },

        log() {

        },

        start() {
            this.isStop = !this.isStop;
            ipcRenderer.send('helper:start');
        },

        home() {
            this.$router.push({path: '/'});
        }
    }
}
</script>

<style>
.webview {
    width: 100%;
    height: 450px;
    margin-top: 20px;
    border: 1px solid red;
}
.webview iframe {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
}
</style>