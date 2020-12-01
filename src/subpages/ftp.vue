<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.ftp')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ftp.serveraddr')}}</div>
      <input class="commonWidth" v-model="host" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('guide.port')}}</div>
      <input v-model="port" maxlength="5" class="commonWidth" v-num/>
      <div class="lableStyle">(1~65535)</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.username')}}</div>
      <input class="commonWidth" v-model="username" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.password')}}</div>
      <pwd-input v-model="pwd" @getPwd="(res)=>{pwd=res}"></pwd-input>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ftp.remotepath')}}</div>
      <input class="commonWidth" v-model="rpath" v-pwd/>
    </div>
    <div style="margin:10px 0 0 20px;">
      <input id="enbk" type="checkbox" :checked="enable" @change="onChange">
      <label for="enbk">{{$t('ftp.breakpoint')}}</label>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="test">{{$t('smtp.test')}} FTP</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { message } from "ant-design-vue";
import PwdInput from "../components/pwdinput"
export default {
  data() {
    return {
      enable: false,
      host: '',
      port: '',
      username: '',
      pwd: '',
      rpath: ''
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
      this.host = '',
      this.port = 21,
      this.username = "";
      this.pwd = "";
      this.rpath = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=ftp").then(res=>{
        this.enable = res.response.ftp.resume==1 ? true:false;
        this.host = res.response.ftp.host;
        this.port = res.response.ftp.port;
        this.username = res.response.ftp.username;
        this.pwd = res.response.ftp.password;
        this.rpath = res.response.ftp.rpath;
      });
    },
    test(){
      let tagxml = '<?xml version="1.0" encoding="utf-8"?>' + '<request>' + '<ftp ver="2.0">' + '<host>' + this.host + '</host>' + '<port>' + this.port + '</port>' + '<anonymous>0</anonymous>' + '<username>' + this.username + '</username>' + '<password>' + this.pwd + '</password>' + '</ftp>' + '</request>';
      this.$post("/action/test?subject=ftp", tagxml).then(()=>{
        message.success(this.$t('tip.testsuc'));
      }).catch(()=>{
        message.error(this.$t('tip.testfai'));
      });
    },
    saveparam() {
      if(this.port == '' || this.port <= 0 || this.port > 65535){
        message.error(this.$t('common.errinput'));
        return;
      }
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          ftp: {
            host: this.host,
            port: this.port,
            anonymous: 0,
            username: this.username,
            password: this.pwd,
            resume: active,
            rpath: this.rpath
          }
        },
      };
      this.$postAPI("/action/set?subject=ftp", object, true);
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