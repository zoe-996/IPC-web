<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.pppoe')}}</div>
    <div style="margin:10px 0 0 5px;">
      <input id="enpppoe" type="checkbox" :checked="enable" @change="onChange">
      <label for="enpppoe">{{$t('common.enable')}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.username')}}</div>
      <input class="commonWidth" v-model="username" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.password')}}</div>
      <pwd-input v-model="pwd" :length="'128'" :isDisabled="!enable" @getPwd="(res)=>{pwd=res}"></pwd-input>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t("tcpip.wificonnect")}}</div>
      <span style="color:#7f7f7f;">{{isconnect}}</span>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('tcpip.ipaddr')}}</div>
      <span style="color:#7f7f7f;">{{addr}}</span>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import PwdInput from "../components/pwdinput"
export default {
  data() {
    return {
      enable: false,
      username: '',
      pwd: '',
      isconnect: '',
      addr: ''
    };
  },
  components: {
    PwdInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable = false;
      this.username = "";
      this.pwd = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=pppoe").then(res=>{
        if (res.response.pppoe.active==0) {
          this.enable = false;
        } else {
          this.enable = true;
        }
        this.username = res.response.pppoe.username;
        this.pwd = res.response.pppoe.password;
      });
      this.$getAPI("/action/get?subject=pppoestat").then(res=>{
        if (res.response.pppoestat.link==0) {
          this.isconnect = this.$t('common.disconnected');
        } else {
          this.isconnect = this.$t('common.connected');
        }
        this.addr = res.response.pppoestat.addr;
      });
    },
    saveparam() {
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          pppoe: {
            active: active,
            username: this.username,
            password: this.pwd
          }
        },
      };
      this.$postAPI("/action/set?subject=pppoe", object, true);
    },
    onChange(){
      this.enable = !this.enable;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 216px;
  height: 23px;
  outline: none;
}
</style>