<template>
    <el-row class="height">
        <el-col :span="12" class="height">
            <div class="container">
                <p>功能区</p>
                <el-button size="small" @click="openWindow">
                    打开窗口
                </el-button>
                <el-button size="small" @click="bindWindow">
                    {{gameWindow.binded ? '解绑' + gameWindow.hwnd : '绑定窗口'}}
                </el-button>
                <el-button size="small" @click="autoLogin">
                    自动登录
                </el-button>
            </div>
        </el-col>
        <el-col :span="12" class="height">
            <div class="container">
                <p>日志区</p>
                <div class="log">
                    <li
                        v-for="(item, i) in gameLogs"
                        :key="i"
                        :class="item.type ? 'log-item-' + item.type : ''"
                        class="log-item">
                        <span class="log-time">{{item.time}}</span>
                        <span class="log-text">{{item.text}}</span>
                    </li>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {Button, Row, Col} from 'element-ui';
import {ipcRenderer} from 'electron';
import moment from 'moment';
import dm from '../common/dm';
import dmFuncs from '../common/dm.func';
export default {
    components: {
        'el-row': Row,
        'el-col': Col,
        'el-button': Button
    },

    computed: {
        gameLogs() {
            return this.$store.state.gameLogs
        }
    },

    data() {
        return {
            binded: false,
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
        async openWindow() {
            ipcRenderer.invoke('openWindow', {
                width: this.gameWindow.width,
                height: this.gameWindow.height,
                title: this.gameWindow.name,
                urlOptions: {
                    url: 'http://wan.xunlei.com/game-offical/105151620/play?gameid=105151620',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                    httpReferre: 'http://wan.xunlei.com'
                }
            });
            this.$store.dispatch('addLog', {
                text: '打开窗口'
            });
        },

        async bindWindow() {
            if (this.gameWindow.binded) {
                const res = dm.UnBindWindow();
                this.gameWindow.binded = !res;
                this.gameWindow.hwnd = 0;
                return this.$store.dispatch('addLog', {
                    text: `解绑窗口${res ? '成功' : '失败'}`,
                    type: res ? '' : 'error'
                });
            }

            const title = this.gameWindow.name;
            const hwnd = await dm.FindWindow('', title);
            if (!hwnd) {
                this.$store.dispatch('addLog', {
                    text: '没找到窗口',
                    type: 'error'
                });
            }

            this.$store.dispatch('addLog', {
                text: `找到窗口 ${hwnd}`
            });
            const sizeRes = await dm.SetWindowSize(hwnd, this.gameWindow.width, this.gameWindow.height);
            this.$store.dispatch('addLog', {
                text: '设置窗口宽高',
                type: sizeRes ? '' : 'error'
            });
            const posRes = await dm.MoveWindow(hwnd, 0, 0);
            this.$store.dispatch('addLog', {
                text: '移动窗口',
                type: posRes ? '' : 'error'
            });
            const bindRes = await dm.BindWindowEx(hwnd, 'gdi', 'windows3', 'windows', '', 0);
            this.$store.dispatch('addLog', {
                text: '绑定窗口',
                type: bindRes ? '' : 'error'
            });
            this.gameWindow.binded = !!bindRes;
            this.gameWindow.hwnd = hwnd;
        },

        async autoLogin() {
            await dmFuncs.checkInGame();
            if (this.gameWindow.binded) {
                this.$prompt('请输入账号密码（__分隔）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async ({value}) => {
                    const split = value.split('__');
                    await dmFuncs.login(
                        925, 482, split[0],
                        925, 525, split[1],
                        925, 605
                    );
                });
            }
            else {
                this.$store.dispatch('addLog', {
                    text: '执行失败，还没有绑定窗口',
                    type: 'error'
                });
            }
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