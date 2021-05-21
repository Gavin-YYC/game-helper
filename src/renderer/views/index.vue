<template>
    <div>
        <p>{{text}}</p>
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
    }
}
</script>