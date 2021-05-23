<template>
    <div>
        <p>{{text}}</p>
        <button @click="openGame">启动窗口</button>
    </div>
</template>

<script>
import {ipcRenderer} from 'electron';
export default {
    data() {
        return {
            text: 'hello renderer'
        };
    },

    mounted() {
        ipcRenderer.on('dm.Ver', (e, data) => {
            this.text += ` 大漠版本: ${data}`;
        });
        ipcRenderer.send('dm.Ver');
    },

    methods: {
        openGame() {
            ipcRenderer.send('game:open', {
                url: 'http://wan.xunlei.com/game-offical/105151620/play?gameid=105151620&server_id=2684&pro=xl_web&referrer=XLQD%2FGWSY%2FWDYX%2FJRYX2&referrer_desc=%E8%BF%85%E9%9B%B7%E6%B8%A0%E9%81%93%2F%E5%AE%98%E7%BD%91%E9%A6%96%E9%A1%B5%2F%E6%88%91%E7%9A%84%E6%B8%B8%E6%88%8F%2F%E8%BF%9B%E5%85%A5%E6%B8%B8%E6%88%8F2'
            });
        }
    }
}
</script>