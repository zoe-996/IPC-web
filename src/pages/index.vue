<template>
    <a-config-provider :locale="locale">
        <div id="app">
            <Head></Head>
            <router-view></router-view>
            <div class="footer">Copyright &copy; TRASSIR 2020-2025 All rights reserved.</div>
        </div>
    </a-config-provider>
</template>
<script>
import Head from "../components/Head";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import ru from "ant-design-vue/lib/locale-provider/ru_RU";
import en from "ant-design-vue/lib/locale-provider/en_GB";
export default {
    data() {
        return {
            locale: en,
        };
    },
    components: { Head },
    mounted(){
        let language = localStorage.getItem("lang");
        if (language === '4') {
            this.locale = zhCN;
        } else if (language === '25') {
            this.locale = ru;
        } else {
            this.locale = en;
        }
    }
}
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  color: #000;
  font-size: 0.12rem;
  text-align: center;
  padding: 0.1rem 0.5rem;
}
</style>