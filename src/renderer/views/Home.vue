<template>
    <el-row class="height">
        <el-col :span="12" class="height">
            <div class="container">
                <p>功能区</p>
                <el-button size="small" @click="bindWindow">
                    {{gameWindow.binded ? '解绑' + gameWindow.hwnd : '绑定窗口'}}
                </el-button>
                <el-button size="small" @click="action">
                    action
                </el-button>
            </div>
        </el-col>
        <el-col :span="12" class="height">
            <div class="container">
                <p>日志区</p>
                <div class="log">
                    <li v-for="(item, i) in gameLogs" :key="i" class="log-item">
                        <span class="log-time">{{item.time | time}}</span>
                        <span class="log-text">{{item.name}} => {{item.data}}</span>
                    </li>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import moment from 'moment';
import {Button, Row, Col} from 'element-ui';
import dmFuncs from '../common/dm.func';
export default {
    components: {
        'el-row': Row,
        'el-col': Col,
        'el-button': Button
    },

    filters: {
        time(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }
    },

    computed: {
        gameLogs() {
            return this.$store.state.gameLogs
        }
    },

    data() {
        return {
            gameWindow: {
                name: 'electron-game-window',
                hwnd: 0,
                width: 1920,
                height: 1040,
                binded: false
            }
        }
    },

    methods: {
        async bindWindow() {
            await dmFuncs.bindWindow();
        },

        async action() {
            await dmFuncs.test();
            // await dmFuncs.autoSetting();
            // await dmFuncs.autoFuben();
        }
    }
}
</script>

<style lang="less" scoped>
.height {
    height: 100%;
}
.container {
    height: 100%;
    padding: 0px 15px;
    overflow: hidden;
}
.log {
    height: 88%;
    overflow: scroll;
    white-space: nowrap;
}
.log-item {
    list-style: none;
}
.log-time {
    font-size: 12px;
    color: gray;
}
.log-text {
    font-size: 12px;
}
.log-item-error {
    color: red;
}
.log-item-warn {
    color: orange;
}
</style>