<template>
  <div class="sideContent">
    <div class="navTitle">
      <div class="titleItem" :class="{ titleSelect: showwm }" @click="onShowItem(showwm)" v-if="showhdr || showfps">
        {{ $t("video.videowm") }}
      </div>
      <div class="titleItem" :class="{ titleSelect: !showwm }" @click="onShowItem(!showwm)">
        {{ $t("video.videotitle") }}
      </div>
    </div>
    <div v-show="showwm">
      <div style="margin-top:10px;" v-if="showhdr">
        <input id="hdr" type="checkbox" :checked="enableHDR" @change="onChangeHDR">
        <label for="hdr">HDR</label>
      </div>
      <div style="margin-top:10px;" v-if="showfps">
        <input id="fps" type="checkbox" :checked="enableFPS" @change="onChangeFPS">
        <label for="fps">50/60 FPS</label>
      </div>
      <div class="buttonGroup">
        <button class="commonBtn" @click="getwmparam">{{ $t("common.refresh") }}</button>
        <button class="commonBtn" @click="showReboot(0)">{{ $t("common.save") }}</button>
      </div>
    </div>
    <div v-show="!showwm">
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{$t('preview.mainstream')}}</div>
        <div class="item">
          <div class="name">{{ $t("audio.codec") }}</div>
          <select class="commonWith" v-model="mainCodec">
              <option v-for="(val,index) in mcodecarr" :key="index">{{val}}</option>
          </select>
        </div>
        <div class="item" v-show="smartenc && mainCodec=='h265'">
          <div class="name">
            <input id="menc" type="checkbox" :checked="ckMenc" @change="()=>{ckMenc=!ckMenc}">
            <label for="menc">{{$t('video.smartenc')}}</label>
          </div>
          <div class="value" v-show="ckMenc">h265+</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.resolution") }}</div>
          <select class="commonWith" v-model="resolutionM">
              <option v-for="(value,ind) in resolutMarr" :key="ind" :value="ind">{{value}}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.profile") }}</div>
          <select class="commonWith" v-model="profileM">
              <option value="0">Baseline</option>
              <option value="1">Main Profile</option>
              <option value="2">High Profile</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.frameratio") }}</div>
          <select class="commonWith" v-model="curframeM" :title="$t('video.noteframe')">
              <option v-for="(v,i) in frameMarr" :key="i">{{v}}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitratetype") }}</div>
          <select class="commonWith" v-model="bittypeM">
              <option value="1">CBR</option>
              <option value="0">VBR</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitraterange") }}</div>
          <div class="value">[{{bitrangeM[resolutionM]}}] kbps</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitrate") }}</div>
          <input class="commonWith" v-model="bitrateM" v-num maxlength="4">
        </div>
        <div class="item">
          <div class="name">{{ $t("video.quality") }}</div>
          <select class="commonWith" v-model="qualityM" :disabled="ckMenc || bittypeM==='1'">
              <option value="6">{{ $t("video.best") }}</option>
              <option value="5">{{ $t("video.better") }}</option>
              <option value="4">{{ $t("video.good") }}</option>
              <option value="3">{{ $t("video.normal") }}</option>
              <option value="2">{{ $t("video.worse") }}</option>
              <option value="1">{{ $t("video.worst") }}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.keyframe") }}</div>
          <select class="commonWith" v-model="keyframeM" :disabled="ckMenc" :title="$t('video.notekeyframe')">
            <option v-for="(a,b) in keyfreamMarr" :key="b">{{a}}</option>
          </select>
        </div>
        <div class="item" style="margin-left:10px;">
          <input id="maudio" type="checkbox" :checked="ckMaudio" @change="()=>{ckMaudio=!ckMaudio}">
          <label for="maudio">{{$t('video.withaudio')}}</label>
        </div>
      </div>
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{$t('preview.substream')}}</div>
        <div class="item" style="margin-left:10px;">
          <input id="suben" type="checkbox" :checked="subActive" @change="()=>{subActive=!subActive}">
          <label for="suben">{{$t('common.enable')}}</label>
        </div>
        <div class="item">
          <div class="name">{{ $t("audio.codec") }}</div>
          <select class="commonWith" v-model="subCodec" :disabled="!subActive">
              <option v-for="(c,d) in scodecarr" :key="d">{{c}}</option>
          </select>
        </div>
        <div class="item" v-show="smartenc && subCodec=='h265'">
          <div class="name">
            <input id="subenc" type="checkbox" :checked="ckSenc" @change="()=>{ckSenc=!ckSenc}" :disabled="!subActive">
            <label for="subenc">{{$t('video.smartenc')}}</label>
          </div>
          <div class="value" v-show="ckSenc">h265+</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.resolution") }}</div>
          <select class="commonWith" v-model="resolutionS" :disabled="!subActive">
              <option v-for="(e,f) in resolutSarr" :key="f">{{e}}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.profile") }}</div>
          <select class="commonWith" v-model="profileS" :disabled="!subActive">
              <option value="0">Baseline</option>
              <option value="1">Main Profile</option>
              <option value="2">High Profile</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.frameratio") }}</div>
          <select class="commonWith" v-model="curframeS" :disabled="!subActive" :title="$t('video.noteframe')">
              <option v-for="(g,h) in frameSarr" :key="h">{{g}}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitratetype") }}</div>
          <select class="commonWith" v-model="bittypeS" :disabled="!subActive">
              <option value="1">CBR</option>
              <option value="0">VBR</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitraterange") }}</div>
          <div class="value">{{bitrangeS}}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.bitrate") }}</div>
          <input class="commonWith" v-model="bitrateS" :disabled="!subActive" v-num maxlength="4">
        </div>
        <div class="item">
          <div class="name">{{ $t("video.quality") }}</div>
          <select class="commonWith" v-model="qualityS" :disabled="!subActive || ckSenc || bittypeS==='1'">
              <option value="6">{{ $t("video.best") }}</option>
              <option value="5">{{ $t("video.better") }}</option>
              <option value="4">{{ $t("video.good") }}</option>
              <option value="3">{{ $t("video.normal") }}</option>
              <option value="2">{{ $t("video.worse") }}</option>
              <option value="1">{{ $t("video.worst") }}</option>
          </select>
        </div>
        <div class="item">
          <div class="name">{{ $t("video.keyframe") }}</div>
          <select class="commonWith" v-model="keyframeS" :disabled="!subActive || ckSenc" :title="$t('video.notekeyframe')">
            <option v-for="(m,n) in keyfreamSarr" :key="n">{{m}}</option>
          </select>
        </div>
        <div class="item" style="margin-left:10px;">
          <input id="subaudio" type="checkbox" :checked="ckSaudio" @change="()=>{ckSaudio=!ckSaudio}" :disabled="!subActive">
          <label for="subaudio">{{$t('video.withaudio')}}</label>
        </div>
      </div>
      <div class="buttonGroup">
        <button class="commonBtn" @click="getparam">{{ $t("common.refresh") }}</button>
        <button class="commonBtn" @click="saveparam(1)">{{ $t("common.save") }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal } from "ant-design-vue";
export default {
  data() {
    return {
      showwm: false,
      showhdr: false,
      showfps: false,
      enableHDR: false,
      enableFPS: false,
      smartenc: false,
      mainCodec: '',
      mcodecarr: [],
      ckMenc: false,
      resolutionM: '',
      resolutMarr: [],
      profileM: '0',
      curframeM: '',
      frameMarr: [],
      bittypeM: '0',
      bitrangeM: [],
      bitrateM: '',
      qualityM: '1',
      keyframeM: '',
      keyfreamMarr: [],
      ckMaudio: false,
      subCodec: '',
      scodecarr: [],
      ckSenc: false,
      resolutionS: '',
      resolutSarr: [],
      profileS: '1',
      curframeS: '',
      frameSarr: [],
      bittypeS: '1',
      bitrangeS: '',
      bitrateS: '',
      qualityS: '4',
      keyframeS: '',
      keyfreamSarr: [],
      ckSaudio: false,
      subActive: false,
      g_reboot: '',
      g_maincodec: '',
      g_subcodec: '',
      g_resolution1: '',
      g_resolution2: ''
    };
  },
  mounted() {
    this.$getAPI("/action/get?subject=devability").then((res)=>{
      this.showhdr = res.response.devability.hdr === '1' ? true : false;
      this.showfps = res.response.devability.highfps === '1' ? true : false;
      if (this.showhdr || this.showfps) {
        this.showwm = true;
        this.getwmparam();
      } else {
        this.showwm = false;
      }
    });
    this.getparam();
  },
  methods: {
    onChangeHDR(){
      this.enableHDR = !this.enableHDR;
      if(this.enableFPS && this.enableHDR){
        this.enableFPS = false;
      }
    },
    onChangeFPS(){
      this.enableFPS = !this.enableFPS;
      if(this.enableFPS && this.enableHDR){
        this.enableHDR = false;
      }
    },
    getwmparam(){
      this.$getAPI("/action/get?subject=videowork").then((res)=>{
        this.enableHDR = res.response.videowork.hdr === '1' ? true : false;
        this.enableFPS = res.response.videowork.highfps === '1' ? true : false;
      });
    },
    saveparam(){
      let vneedreboot = parseInt(this.g_reboot) & 2 ? true:false;
      let rneedreboot = parseInt(this.g_reboot) & 1 ? true:false;
      if(((this.mainCodec!==this.g_maincodec || this.subCodec!==this.g_subcodec)&&vneedreboot) || ((this.resolutionM!==this.g_resolution1 || this.resolutionS!==this.g_resolution2)&&rneedreboot)){
        this.showReboot(1);
      }else{
        this.postdata(1);
      }
    },
    onShowItem(flag) {
      if(!flag){
        this.showwm = !this.showwm;
      }
    },
    getparam() {
      this.$getAPI("/action/get?subject=videoencability&stream=0").then((res)=>{
        this.smartenc = res.response.videoencability.h264.smartenc == 0 ? false:true;
        this.g_reboot = res.response.videoencability.reboot;
        this.mcodecarr = [];
        this.resolutMarr = [];
        this.frameMarr = [];
        this.keyfreamMarr = [];
        if(res.response.videoencability.h264 != undefined){
          this.mcodecarr.push('h264');
        }
        if(res.response.videoencability.h265 != undefined){
          this.mcodecarr.push('h265');
        }
        let optionarr = res.response.videoencability.h264.option;
        for(let i = 0; i < optionarr.length; i++){
          let resolut = optionarr[i].resolution;
          this.resolutMarr.push(resolut);
        }
        for(let i = 0; i < optionarr.length; i++){
          let bitr = optionarr[i].bitrate;
          this.bitrangeM.push(bitr);
        }
        let f = optionarr[0].framerate.split('-');
        for(let j = parseInt(f[0]); j <= parseInt(f[1]); j++){
          this.frameMarr.push(j);
        }
        let k = optionarr[0].keygop.split('-');
        for(let j = parseInt(k[0]); j <= parseInt(k[1]); j++){
          this.keyfreamMarr.push(j);
        }
      })
      this.$getAPI("/action/get?subject=videoencability&stream=1").then((res)=>{
        this.scodecarr = [];
        this.resolutSarr = [];
        this.frameSarr = [];
        this.keyfreamSarr = [];
        if(res.response.videoencability.h264 != undefined){
          this.scodecarr.push('h264');
        }
        if(res.response.videoencability.h265 != undefined){
          this.scodecarr.push('h265');
        }
        let optionarr = res.response.videoencability.h264.option;
        for(let i = 0; i < optionarr.length; i++){
          let resolut = optionarr[i].resolution;
          this.resolutSarr.push(resolut);
        }
        let f = optionarr[0].framerate.split('-');
        for(let j = parseInt(f[0]); j <= parseInt(f[1]); j++){
          this.frameSarr.push(j);
        }
        this.bitrangeS = "[" + optionarr[0].bitrate + "] kbps";
        let k = optionarr[0].keygop.split('-');
        for(let j = parseInt(k[0]); j <= parseInt(k[1]); j++){
          this.keyfreamSarr.push(j);
        }
      });
      this.$getAPI("/action/get?subject=videoenc&stream=0").then((res)=>{
        this.mainCodec = res.response.videoenc.codec==0 ? 'h264':'h265';
        this.g_maincodec = this.mainCodec;
        this.g_resolution1 = res.response.videoenc.resolution;
        for(let i=0;i<this.resolutMarr.length;i++){
          if(res.response.videoenc.resolution==this.resolutMarr[i]){
            this.resolutionM = i;
          }
        }
        this.curframeM = res.response.videoenc.framerate;
        this.bittypeM = res.response.videoenc.rc;
        this.keyframeM = res.response.videoenc.keygop;
        this.bitrateM = res.response.videoenc.bitrate;
        this.qualityM = res.response.videoenc.quality;
        this.profileM = res.response.videoenc.profile;
        this.ckMaudio = res.response.videoenc.audioen==1 ? true:false;
        this.ckMenc = res.response.videoenc.smarten==1 ? true:false;
      });
      this.$getAPI("/action/get?subject=videoenc&stream=1").then((res)=>{
        this.subCodec= res.response.videoenc.codec==0 ? 'h264':'h265';
        this.g_subcodec = this.subCodec;
        this.g_resolution2 = res.response.videoenc.resolution;
        this.resolutionS = res.response.videoenc.resolution;
        this.curframeS = res.response.videoenc.framerate;
        this.bittypeS = res.response.videoenc.rc;
        this.keyframeS = res.response.videoenc.keygop;
        this.bitrateS = res.response.videoenc.bitrate;
        this.qualityS = res.response.videoenc.quality;
        this.profileS = res.response.videoenc.profile;
        this.subActive = res.response.videoenc.active==1 ? true:false;
        this.ckSaudio = res.response.videoenc.audioen==1 ? true:false;
        this.ckSenc = res.response.videoenc.smarten==1 ? true:false;
      });
    },
    showReboot(n){
      let that = this;
      Modal.confirm({
        centered: true,
        content: this.$t("tip.notevreboot"),
        onOk() {
          that.postdata(n);
        },
        onCancel() {},
      });
    },
    postdata(n){
      if(n==0){
        let hdr = this.enableHDR ? 1:0;
        let fps = this.enableFPS ? 1:0;
        let object = {request: {videowork: {hdr: hdr,highfps: fps}}};
        this.$postAPI("/action/set?subject=videowork", object, true);
      }else{
        let audioen = this.ckMaudio ? '1':'0';
        let cksmarten = this.ckMenc ? '1':'0';
        let codec = this.mainCodec=='h264' ? '0':'1';
        let object = {
          request:{
            videoenc:{
              active: '1',
              codec: codec,
              resolution: this.resolutMarr[this.resolutionM],
              framerate: this.curframeM,
              rc: this.bittypeM,
              keygop: this.keyframeM,
              bitrate: this.bitrateM,
              quality: this.qualityM,
              profile: this.profileM,
              audioen: audioen,
              smarten: cksmarten
            }
          }
        };
        this.$postAPI("/action/set?subject=videoenc&stream=0", object, true);
        let subenable = this.subActive ? '1':'0';
        let saudioen = this.ckSaudio ? '1':'0';
        let scksmarten = this.ckSenc ? '1':'0';
        let scodec = this.subCodec=='h264' ? '0':'1';
        let object1 = {
          request:{
            videoenc:{
              active: subenable,
              codec: scodec,
              resolution: this.resolutionS,
              framerate: this.curframeS,
              rc: this.bittypeS,
              keygop: this.keyframeS,
              bitrate: this.bitrateS,
              quality: this.qualityS,
              profile: this.profileS,
              audioen: saudioen,
              smarten: scksmarten
            }
          }
        };
        this.$postAPI("/action/set?subject=videoenc&stream=1", object1, true);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
.commonWith{
  width: 210px;
  height:23px;
  outline: none;
}
</style>