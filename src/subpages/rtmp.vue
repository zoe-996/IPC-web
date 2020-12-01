<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.rtmp')}}</div>
    <div style="margin:10px 0 0 5px;">
      <input id="enauth" type="checkbox" :checked="enable" @change="onChange">
      <label for="enauth">{{$t('smtp.auth')}}</label>
    </div>
    <div style="margin:10px 0 0 20px;font-size:13px;" v-show="enable">
      <div style="margin-bottom:6px;display:flex;">
        <span>{{$t('common.period')}}1 : </span>
        <time-input v-model="stime1" @getTime="(res)=>{stime1=res}"></time-input>
        <span> ~ </span>
        <time-input v-model="etime1" @getTime="(res)=>{etime1=res}"></time-input>
      </div>
      <div style="margin-bottom:6px;display:flex;">
        <span>{{$t('common.period')}}2 : </span>
        <time-input v-model="stime2" @getTime="(res)=>{stime2=res}"></time-input>
        <span> ~ </span>
        <time-input v-model="etime2" @getTime="(res)=>{etime2=res}"></time-input>
      </div>
      <div style="margin-bottom:6px;display:flex;">
        <span>{{$t('common.period')}}3 : </span>
        <time-input v-model="stime3" @getTime="(res)=>{stime3=res}"></time-input>
        <span> ~ </span>
        <time-input v-model="etime3" @getTime="(res)=>{etime3=res}"></time-input>
      </div>
      <div style="margin-bottom:6px;display:flex;">
        <span>{{$t('common.period')}}4 : </span>
        <time-input v-model="stime4" @getTime="(res)=>{stime4=res}"></time-input>
        <span> ~ </span>
        <time-input v-model="etime4" @getTime="(res)=>{etime4=res}"></time-input>
      </div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('rtsp.pushtype')}}</div>
      <select v-model="type" class="commonWidth" :disabled="!enable" @change="typeChange">
        <option value="0">{{$t('preview.mainstream')}}</option>
        <option value="1">{{$t('preview.substream')}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('rtsp.pushurl')}}</div>
      <input class="commonWidth" v-model="url" :disabled="!enable" v-pwd/>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { message} from "ant-design-vue";
import TimeInput from '../components/timeinput'
export default {
  data() {
    return {
      enable: false,
      type: '0',
      url: '',
      mainurl: '',
      suburl: '',
      stime1: 0,
      stime2: 0,
      stime3: 0,
      stime4: 0,
      etime1: 0,
      etime2: 0,
      etime3: 0,
      etime4: 0
    };
  },
  components: {
    TimeInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable = false;
      this.type = "0";
      this.url = "";
      this.stime1 = 0;
      this.stime2 = 0;
      this.stime3 = 0;
      this.stime4 = 0;
      this.etime1 = 0;
      this.etime2 = 0;
      this.etime3 = 0;
      this.etime4 = 0;
    },
    getparam() {
      this.$getAPI("/action/get?subject=rtmp").then(res=>{
        this.enable = res.response.rtmp.push.active==1 ? true:false;
        this.mainurl = res.response.rtmp.push.url[0];
        this.suburl = res.response.rtmp.push.url[1];
        let section1 = res.response.rtmp.push.tsection[0].split('-');
        let section2 = res.response.rtmp.push.tsection[1].split('-');
        let section3 = res.response.rtmp.push.tsection[2].split('-');
        let section4 = res.response.rtmp.push.tsection[3].split('-');
        this.stime1 = parseInt(section1[0]);
        this.etime1 = parseInt(section1[1]);
        this.stime2 = parseInt(section2[0]);
        this.etime2 = parseInt(section2[1]);
        this.stime3 = parseInt(section3[0]);
        this.etime3 = parseInt(section3[1]);
        this.stime4 = parseInt(section4[0]);
        this.etime4 = parseInt(section4[1]);
        this.url = this.mainurl;
        this.type = '0';
      });
    },
    saveparam() {
      if(this.stime1 > this.etime1 || this.stime2 > this.etime2 || this.stime3 > this.etime3 || this.stime4 > this.etime4){
        message.error(this.$t('common.errinput'));
        return;
      }
      let section1 = this.stime1 + '-' + this.etime1;
      let section2 = this.stime2 + '-' + this.etime2;
      let section3 = this.stime3 + '-' + this.etime3;
      let section4 = this.stime4 + '-' + this.etime4;
      let active = this.enable ? 1:0;
      if (this.type=='0') {
        this.mainurl = this.url;
      } else {
        this.suburl = this.url;
      }
      let object = {request:{rtmp:{push:{active:active,url:[this.mainurl,this.suburl],tsection:[section1,section2,section3,section4]}}}};
      this.$postAPI("/action/set?subject=rtmp", object, true);
    },
    onChange(){
      this.enable = !this.enable;
    },
    typeChange(){
      if (this.type=='0') {
        this.url = this.mainurl
      } else {
        this.url = this.suburl
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 184px;
  height: 23px;
  outline: none;
}
</style>