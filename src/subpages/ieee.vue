<template>
  <div class="sideContent">
    <div class="navTitle">IEEE 802.1x</div>
    <div style="margin:10px 0 0 5px;">
      <input id="enieee" type="checkbox" :checked="enable" @change="onChange">
      <label for="enieee">{{$t("common.enable")}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('upnp.protocol')}}</div>
      <select v-model="type" class="commonWidth" :disabled="!enable">
        <option value="0">EAP-MD5</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('upnp.eapolver')}}</div>
      <select v-model="eapver" class="commonWidth" :disabled="!enable">
        <option value="0">1</option>
        <option value="1">2</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.username')}}</div>
      <input class="commonWidth" v-model="username" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.password')}}</div>
      <pwd-input v-model="pwd" :isDisabled="!enable" @getPwd="(res)=>{pwd=res}"></pwd-input>
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
      type: '0',
      eapver: '0',
      username: '',
      pwd: ''
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
      this.type = '0',
      this.eapver = '0',
      this.username = "";
      this.pwd = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=ieee8021x").then(res=>{
        this.enable = res.response.ieee8021x.active==1 ? true:false;
        this.username = res.response.ieee8021x.identity;
        this.pwd = res.response.ieee8021x.password;
        this.type = res.response.ieee8021x.eaptype;
        this.eapver = res.response.ieee8021x.eapver;
      });
    },
    saveparam() {
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          ieee8021x: {
            active: active,
            identity: this.username,
            eaptype: this.type,
            eapver: this.eapver,
            password: this.pwd
          }
        },
      };
      this.$postAPI("/action/set?subject=ieee8021x", object, true);
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