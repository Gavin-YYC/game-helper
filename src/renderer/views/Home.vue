<template>
    <div>
        <div class="add">
            <label>
                <span>url</span>
                <input type="text" v-model="form.url">
            </label>
            <label>
                <span>ua</span>
                <input type="text" v-model="form.ua">
            </label>
            <button @click="add">Add</button>
        </div>

        <h3 class="title">List</h3>
        <div class="list">
            <div v-for="item, i in list" :key="i">
                <span>{{item.url}}</span>
                <span>{{item.ua}}</span>
                <button @click="open">Open</button>
            </div>
        </div>
    </div>
</template>

<script>
import storage from 'electron-json-storage';
const storeKey = 'gameList';
export default {
    data() {
        const list = storage.get(storeKey) || [];
        console.log(list);
        return {
            list,
            form: {
                url: '',
                ua: ''
            }
        };
    },

    methods: {
        add() {
            const data = JSON.parse(JSON.stringify(this.form));
            this.list.push(data);
            storage.set(storeKey, this.list, () => {
                this.form.url = '';
                this.form.ua = '';
            });
        },

        open() {
            this.$router.push('game-window');
        }
    }
}
</script>