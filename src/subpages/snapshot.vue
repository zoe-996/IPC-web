<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('preview.snapshot')}}</div>
    <div style="color: red;font-size:12px;margin-top:10px;" v-if="notsupport">{{$t('tip.notesupport')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('schedule.quality')}}</div>
      <select class="commonWidth" v-model="quality">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('schedule.framerate')}}</div>
      <select class="commonWidth" v-model="framerate">
        <option v-for="(val,index) in framearr" :key="index">{{val}}</option>
      </select>
      <div class="lableStyle">FPS</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('schedule.interval')}}</div>
      <input class="commonWidth" maxlength="3" v-model="interval" v-num/>
      <div class="lableStyle">{{$t('dt.second')}}(1~600)</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('schedule.stream')}}</div>
      <select class="commonWidth" v-model="stream" :disabled="disstreamtype">
        <option value="0">{{$t('preview.mainstream')}}</option>
        <option value="1">{{$t('preview.substream')}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t("schedule.mjpeg")}}</div>
      <span style="font-size:12px;">{{mjpegurl}}</span>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('schedule.snapshoturl')}}</div>
      <span style="font-size:12px;">{{snapshoturl}}</span>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
    <p style="color:#7f7f7f;font-size:12px;width:580px;">{{$t('tip.noteurl')}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      notsupport: false,
      disstreamtype: false,
      framearr: [],
      quality: '',
      framerate: '',
      interval: '',
      stream: '',
      mjpegurl: '',
      snapshoturl : ''
    };
  },
  mounted() {
    this.$getAPI("/action/get?subject=devability").then(res=>{
      this.notsupport = res.response.devability.stream > 2 ? false:true;
    });
    this.mjpegurl = "http://"+ document.location.host + "/action/stream?subject=mjpeg&user=admin&pwd=admin";
    this.snapshoturl = "http://"+ document.location.host +"/action/snap?cam=0&user=admin&pwd=admin";
    this.getparam();
  },
  methods: {
    restore() {
      this.quality = "7";
      this.interval = "1";
      this.framerate = this.framearr[0];
    },
    getparam() {
      let curframrate;
      this.$getAPI("/action/get?subject=snap").then(res=>{
        curframrate = res.response.snap.framerate;
        this.quality = res.response.snap.quality;
        this.interval = res.response.snap.interval;
        this.stream = res.response.snap.stream;
      });
      this.$getAPI("/action/get?subject=snapability").then(res=>{
        let streamopt = res.response.snapability.streamopt;
        if (parseInt(streamopt)==0x01 || parseInt(streamopt)==0x02) {
          this.disstreamtype = true;
        } else {
          this.disstreamtype = false;
        }
        this.framearr=[];
        if(this.stream==0){
          let sarr = res.response.snapability.stream0.split('-');
          for(let i = parseInt(sarr[0]); i <= parseInt(sarr[1]); i++){
            this.framearr.push(i);
          }
        }else{
          let sarr = res.response.snapability.stream1.split('-');
          for(let i = parseInt(sarr[0]); i <= parseInt(sarr[1]); i++){
            this.framearr.push(i);
          }
        }
        this.framerate = curframrate;
      });
    },
    saveparam() {
      if(this.interval == '' || this.interval < 1 || this.interval > 600){
        this.interval = '';
        return;
      }
      let object = {
        request: {
          snap: {
            framerate: this.framerate,
            quality: this.quality,
            interval: this.interval,
            stream: this.stream
          }
        },
      };
      this.$postAPI("/action/set?subject=snap", object, true);
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