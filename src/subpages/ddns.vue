<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.ddns')}}</div>
    <div style="margin:10px 0 0 5px;">
      <input id="enddns" type="checkbox" :checked="enable" @change="onChange">
      <label for="enddns">{{$t('common.enable')}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ddns.servertype')}}</div>
      <select v-model="servertype" class="commonWidth" :disabled="!enable">
        <option value="0">3322</option>
        <option value="1">Oray</option>
        <option value="2">Dyndns</option>
        <option value="3">NO-IP</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ddns.serverdomain')}}</div>
      <input class="commonWidth" v-model="serverdomain" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.username')}}</div>
      <input class="commonWidth" v-model="username" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.password')}}</div>
      <pwd-input v-model="pwd" :isDisabled="!enable" @getPwd="(res)=>{pwd=res}"></pwd-input>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ddns.updateinterval')}}</div>
      <input class="commonWidth" v-model="interval" maxlength="2" :disabled="!enable" v-num/>
      <div class="lableStyle">{{$t('dt.minute')}}[1~10]</div>
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
      servertype: '0',
      interval: '10',
      serverdomain: '',
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
      this.servertype = "0";
      this.interval = "10";
      this.serverdomain = "";
      this.username = "";
      this.pwd = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=ddns").then(res=>{
        this.enable = res.response.ddns.active==0 ? false:true;
        this.servertype = res.response.ddns.type;
        this.interval = parseInt(res.response.ddns.interval / 60);
        this.serverdomain = res.response.ddns.domain;
        this.username = res.response.ddns.username;
        this.pwd = res.response.ddns.password;
      });
    },
    saveparam() {
      if(this.interval == '' || this.interval < 1 || this.interval > 10){
        this.interval = '';
        return;
      }
      let active  = this.enable ? 1:0;
      let int = parseInt(this.interval) * 60;
      let object = {
        request: {
          ddns: {
            active: active,
            type: this.servertype,
            interval: int,
            domain: this.serverdomain,
            username: this.username,
            password: this.pwd
          }
        },
      };
      this.$postAPI("/action/set?subject=ddns", object, true);
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