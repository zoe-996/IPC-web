<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.rtsp')}}</div>
    <div class="commonTitle">{{$t('rtsp.rtspinfo')}}</div>
    <div style="margin:10px 0 0 20px;">
      <input id="enauth" type="checkbox" :checked="enable1" @change="onChange1">
      <label for="enauth">{{$t('smtp.auth')}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('preview.mainstream')}}</div>
      <div class="lableStyle">{{mainaddr}}</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('preview.substream')}}</div>
      <div class="lableStyle">{{subaddr}}</div>
    </div>
    <div class="commonTitle">{{$t('rtsp.rtspbroadcast')}}</div>
    <div style="margin:10px 0 0 20px;">
      <input id="multicast" type="checkbox" :checked="enable2" @change="onChange2">
      <label for="multicast">{{$t('rtsp.enablemulticast')}}</label>
    </div>
    <div class="lineSpacing" style="display: flex;">
      <div class="textWidth">{{$t('rtsp.multicastaddress')}}</div>
      <ip-input v-model="addr" @getIp="(res)=>{addr=res}" :isDisabled="!enable2"></ip-input>
      <div class="lableStyle">[224.0.0.1~239.255.255.254]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('guide.port')}}</div>
      <input v-model="port" maxlength="5" class="commonWidth" :disabled="!enable2" v-num/>
      <div class="lableStyle">[10000..50000]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">TTL</div>
      <input v-model="ttl" maxlength="3" class="commonWidth" :disabled="!enable2" v-num/>
      <div class="lableStyle">[64..255]</div>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import IpInput from '../components/Ipinput'
export default {
  data() {
    return {
      enable1: true,
      enable2: false,
      addr: '',
      port: '',
      ttl: '',
      mainaddr: '',
      subaddr: ''
    };
  },
  components: {
    IpInput: IpInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable1 = true;
      this.enable2 = false;
      this.addr = "224.0.0.1";
      this.port = 10000;
      this.ttl = 64;
    },
    getparam() {
      this.$getAPI("/action/get?subject=rtsp").then(res=>{
        this.enable1 = res.response.rtsp.auth==1 ? true:false;
        this.enable2 = res.response.rtsp.mcast.active==1 ? true:false;
        this.port = res.response.rtsp.mcast.port;
        this.addr = res.response.rtsp.mcast.addr;
        this.ttl = res.response.rtsp.mcast.ttl;
      });
      this.$getAPI("/action/get?subject=netserv").then(res=>{
        let rtsp = res.response.netserv.rtsp;
        this.mainaddr = "rtsp://" + window.location.hostname + ":" + rtsp + "/live/main";
        this.subaddr = "rtsp://" + window.location.hostname + ":" + rtsp + "/live/sub";
      });
    },
    saveparam() {
      if(this.port < 10000 || this.port > 50000){
        this.port = '';
        return;
      }
      if(this.ttl < 64 || this.ttl > 255){
        this.ttl = '';
        return;
      }
      if(this.addr == ''){
        return;
      }
      let auth = this.enable1 ? 1:0;
      let active = this.enable2 ? 1:0;
      let object = {request:{rtsp:{auth:auth,mcast:{active:active,port:this.port,addr:this.addr,ttl:this.ttl}}}};
      this.$postAPI("/action/set?subject=rtsp", object, true);
    },
    onChange1(){
      this.enable1 = !this.enable1;
    },
    onChange2(){
      this.enable2 = !this.enable2;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 184px;
  height: 23px;
  border:1px solid #c9c9c9;
  outline: none;
}
</style>