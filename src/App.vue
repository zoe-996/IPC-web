<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <Head></Head>
      <router-view></router-view>
      <div class="footer">Copyright &copy; TRASSIR 2018-2020 All rights reserved.</div>
    </div>
  </a-config-provider>
</template>

<script>
import Head from "./components/Head.vue";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
// import de from "ant-design-vue/lib/locale-provider/de_DE";
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  components: { Head },
  created() {
    this.$i18n.locale = "zh";
    localStorage.setItem("user","admin");
    localStorage.setItem("pwd","827ccb0eea8a706c4c34a16891f84e7b");
    localStorage.setItem("lang","4");
  },
};
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

