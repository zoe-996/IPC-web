<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.rtmp')}}</div>
    <div style="margin:10px 0 0 30px;">
      <a-checkbox @change="onChange" :checked="enable">{{$t('smtp.auth')}}</a-checkbox>
    </div>
    <div style="margin-left:50px;font-size:13px;" v-show="enable">
      <div style="margin-bottom:6px;">{{$t('common.period')}}1 : <a-time-picker v-model="stime1" size="small"/> ~ <a-time-picker v-model="etime1" size="small"/></div>
      <div style="margin-bottom:6px;">{{$t('common.period')}}2 : <a-time-picker v-model="stime2" size="small"/> ~ <a-time-picker v-model="etime2" size="small"/></div>
      <div style="margin-bottom:6px;">{{$t('common.period')}}3 : <a-time-picker v-model="stime3" size="small"/> ~ <a-time-picker v-model="etime3" size="small"/></div>
      <div style="margin-bottom:6px;">{{$t('common.period')}}4 : <a-time-picker v-model="stime4" size="small"/> ~ <a-time-picker v-model="etime4" size="small"/></div>
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
import { TimePicker,Checkbox,message} from "ant-design-vue";
import moment from 'moment';
export default {
  data() {
    return {
      enable: false,
      type: '0',
      url: '',
      mainurl: '',
      suburl: '',
      stime1: moment("00:00:00", "HH:mm:ss"),
      stime2: moment("00:00:00", "HH:mm:ss"),
      stime3: moment("00:00:00", "HH:mm:ss"),
      stime4: moment("00:00:00", "HH:mm:ss"),
      etime1: moment("00:00:00", "HH:mm:ss"),
      etime2: moment("00:00:00", "HH:mm:ss"),
      etime3: moment("00:00:00", "HH:mm:ss"),
      etime4: moment("00:00:00", "HH:mm:ss")
    };
  },
  components: {
    ACheckbox: Checkbox,
    ATimePicker:TimePicker
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable = false;
      this.type = "0";
      this.url = "";
      this.stime1 = moment("00:00:00", "HH:mm:ss");
      this.stime2 = moment("00:00:00", "HH:mm:ss");
      this.stime3 = moment("00:00:00", "HH:mm:ss");
      this.stime4 = moment("00:00:00", "HH:mm:ss");
      this.etime1 = moment("00:00:00", "HH:mm:ss");
      this.etime2 = moment("00:00:00", "HH:mm:ss");
      this.etime3 = moment("00:00:00", "HH:mm:ss");
      this.etime4 = moment("00:00:00", "HH:mm:ss");
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
        this.stime1 = moment(this.getStringTime(section1[0]), "HH:mm:ss");
        this.etime1 = moment(this.getStringTime(section1[1]), "HH:mm:ss");
        this.stime2 = moment(this.getStringTime(section2[0]), "HH:mm:ss");
        this.etime2 = moment(this.getStringTime(section2[1]), "HH:mm:ss");
        this.stime3 = moment(this.getStringTime(section3[0]), "HH:mm:ss");
        this.etime3 = moment(this.getStringTime(section3[1]), "HH:mm:ss");
        this.stime4 = moment(this.getStringTime(section4[0]), "HH:mm:ss");
        this.etime4 = moment(this.getStringTime(section4[1]), "HH:mm:ss");
        this.url = this.mainurl;
        this.type = '0';
      });
    },
    saveparam() {
      let s1 = this.stime1.hour()*3600 + this.stime1.minute()*60 + this.stime1.second();
      let s2 = this.stime2.hour()*3600 + this.stime2.minute()*60 + this.stime2.second();
      let s3 = this.stime3.hour()*3600 + this.stime3.minute()*60 + this.stime3.second();
      let s4 = this.stime4.hour()*3600 + this.stime4.minute()*60 + this.stime4.second();
      let e1 = this.etime1.hour()*3600 + this.etime1.minute()*60 + this.etime1.second();
      let e2 = this.etime2.hour()*3600 + this.etime2.minute()*60 + this.etime2.second();
      let e3 = this.etime3.hour()*3600 + this.etime3.minute()*60 + this.etime3.second();
      let e4 = this.etime4.hour()*3600 + this.etime4.minute()*60 + this.etime4.second();
      let section1 = s1 + '-' + e1;
      let section2 = s2 + '-' + e2;
      let section3 = s3 + '-' + e3;
      let section4 = s4 + '-' + e4;
      if(s1 > e1 || s2 > e2 || s3 > e3 || s4 > e4){
        message.error(this.$t('common.errinput'));
        return;
      }
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
    getStringTime(second){
      let h = parseInt(second / 3600);
      let m = parseInt((second % 3600) / 60);
      let s = parseInt(second % 60);
      let strh = h > 9 ? String(h) : ("0" + String(h));
      let strm = m > 9 ? String(m) : ("0" + String(m));
      let strs = s > 9 ? String(s) : ("0" + String(s));
      return strh + ":" + strm + ":" + strs;
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