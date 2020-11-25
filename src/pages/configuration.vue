<template>
    <a-layout>
        <Side></Side>
        <a-layout-content :style="{ padding: '0.24rem', background: '#fff'}">
            <router-view></router-view>
        </a-layout-content>
    </a-layout>
</template>
<script>
import { Layout } from 'ant-design-vue';
import Side from '../components/Side';

export default {
    data() {
        return {

        };
    },
    components:{
        ALayout:Layout,
        ALayoutContent:Layout.Content,
        Side
    }
}
</script>
<style lang="scss" scoped>

</style>