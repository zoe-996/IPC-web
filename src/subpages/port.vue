<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('guide.port')}}</div>
    <div class="commonTitle">{{$t('port.portsetting')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('port.httpport')}}</div>
      <input v-model="httpport" maxlength="5" class="commonWidth" v-num/>
      <div class="lableStyle">[1..65535 ,{{$t('common.default')}} 80]</div>
    </div>
    <div class="lineSpacing" v-if="supportHttps">
      <div class="textWidth">{{$t('port.httpsport')}}</div>
      <input v-model="httpsport" maxlength="5" class="commonWidth" v-num/>
      <div class="lableStyle">[1..65535 ,{{$t('common.default')}} 443]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('port.rtspport')}}</div>
      <input v-model="rtspport" maxlength="5" class="commonWidth" v-num/>
      <div class="lableStyle">[1..65535 ,{{$t('common.default')}} 554]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('port.tcpport')}}</div>
      <input v-model="tcpport" maxlength="5" class="commonWidth" v-num/>
      <div class="lableStyle">[1..65535 ,{{$t('common.default')}} 6000]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('port.flashport')}}</div>
      <input v-model="flashport" maxlength="5" class="commonWidth" :disabled="!hasflashport" v-num/>
      <div class="lableStyle" v-if="hasflashport">[1..65535 ,{{$t('common.default')}} 1935]</div>
    </div>
    <div class="commonTitle">{{$t('port.protosetting')}}</div>
    <div style="margin:10px 20px;">
      <div class="ckbox" v-if="protomask & 1">
        <input id="onvif" type="checkbox" @change="()=>{this.ckOnvif = !this.ckOnvif}" :checked="ckOnvif">
        <label for="onvif">ONVIF</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<2">
        <input id="hk" type="checkbox" @change="()=>{this.ckHk = !this.ckHk}" :checked="ckHk">
        <label for="hk">HK</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<1">
        <input id="dh" type="checkbox" @change="()=>{this.ckDh = !this.ckDh}" :checked="ckDh">
        <label for="dh">DH</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<4">
        <input id="al" type="checkbox" @change="()=>{this.ckAl = !this.ckAl}" :checked="ckAl">
        <label for="al">AL</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<5">
        <input id="xm" type="checkbox" @change="()=>{this.ckXm = !this.ckXm}" :checked="ckXm">
        <label for="xm">XM</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<3">
        <input id="hb" type="checkbox" @change="()=>{this.ckHb = !this.ckHb}" :checked="ckHb">
        <label for="hb">HB</label>
      </div>
      <div class="ckbox" v-if="protomask & 1<<9">
        <input id="ts" type="checkbox" @change="()=>{this.ckTs = !this.ckTs}" :checked="ckTs">
        <label for="ts">TS</label>
      </div>
      <p style="color:red;font-size: 12px;">{{$t('general.notep2pcode')}}</p>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { message,Modal } from "ant-design-vue";
export default {
  data() {
    return {
      supportHttps: false,
      hasflashport: true,
      gHport: 0,
      gHsport: 0,
      httpport: 80,
      httpsport: 443,
      rtspport: 554,
      tcpport: 6000,
      flashport: 1935,
      ckOnvif: true,
      ckDh: false,
      ckHk: false,
      ckHb: false,
      ckAl: false,
      ckXm: false,
      ckTs: false,
      protomask: 0,
      devpara: {}
    };
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.httpport = 80;
      this.httpsport = 443;
      this.rtspport = 554;
      this.tcpport = 6000;
      this.flashport = 1935;
      this.ckOnvif = true;
      this.ckDh = false;
      this.ckHk = false;
      this.ckHb = false;
      this.ckAl = false;
      this.ckXm = false;
      this.ckTs = false;
    },
    getparam() {
      this.$getAPI("/action/get?subject=netserv").then(res=>{
        this.gHport = res.response.netserv.http;
        this.httpport = res.response.netserv.http;
        this.gHsport = res.response.netserv.https;
        this.httpsport = res.response.netserv.https;
        this.rtspport = res.response.netserv.rtsp;
        this.tcpport = res.response.netserv.tcp;
        if(res.response.netserv.rtmp>0){
        this.flashport =  res.response.netserv.rtmp;
        this.hasflashport = true;
        }
      });
      this.$getAPI("/action/get?subject=devability").then(res=>{
        this.protomask = parseInt(res.response.devability.nvrproto);
        let featrueab = parseInt(res.response.devability.featrueab);
        if (!(featrueab & 0x08)) {
            this.supportHttps = false;   
        }
      });
      this.$getAPI("/action/get?subject=devpara").then(res=>{
        this.devpara = res.response.devpara;
        let mask = parseInt(res.response.devpara.nvrproto);
        this.ckOnvif = (mask & 1) ? true : false;
        this.ckDh = (mask & 1<<1) ? true : false;
        this.ckHk = (mask & 1<<2) ? true : false;
        this.ckHb = (mask & 1<<3) ? true : false;
        this.ckAl = (mask & 1<<4) ? true : false;
        this.ckXm = (mask & 1<<5) ? true : false;
        this.ckTs = (mask & 1<<9) ? true : false;
      });
    },
    saveparam() {
        let that = this;
        let http = this.httpport;
        let https = this.httpsport;
        let rtsp = this.rtspport;
        let tcp = this.tcpport;
        let rtmp = this.flashport;
        if(http < 1 || https < 1 || rtsp < 1 || tcp < 1 || rtmp < 1 || http > 65535 || https > 65535 || rtsp > 65535 || tcp > 65535 || rtmp > 65535 || http == https || http == rtsp || http == tcp || http == rtmp || https == rtsp || https == tcp || https == rtmp || rtsp == tcp || rtsp == rtmp || tcp == rtmp){
            message.error(this.$t('common.errinput'));
            return;
        }
        if(http != this.gHport){
            Modal.confirm({
                centered: true,
                content: this.$t('port.httptips'),
                onOk() {
                    that.postdata();
                },
                onCancel() {},
            });
            return;
        }
        if(https != this.gHsport){
            Modal.confirm({
                centered: true,
                content: this.$t('port.httpstips'),
                onOk() {
                    that.postdata();
                    window.location.href = "/login.html";
                },
                onCancel() {},
            });
            return;
        }
        this.postdata();
    },
    postdata(){
        let object = {request:{netserv:{http:this.httpport,https:this.httpsport,rtsp:this.rtspport,tcp:this.tcpport,rtmp:this.flashport}}}
        this.$postAPI("/action/set?subject=netserv", object, true);
        let onvif = this.ckOnvif ? 1:0;
        let hk = this.ckHk ? 1:0;
        let dh = this.ckDh ? 1:0;
        let al = this.ckAl ? 1:0;
        let xm = this.ckXm ? 1:0;
        let hb = this.ckHb ? 1:0;
        let ts = this.ckTs ? 1:0;
        let proto = (ts << 9) + (xm << 5) + (al << 4) + (hb << 3) + (hk << 2) + (dh << 1) + onvif;
        this.devpara.nvrproto = String(proto);
        let object1 = {
            request:{
                devpara: this.devpara
            }
        }
        this.$postAPI("/action/set?subject=devpara", object1, true);
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
.ckbox{
  display: inline-block;
  margin: 0 10px;
}
</style>