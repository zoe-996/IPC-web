<template>
  <div class="sideContent">
    <div class="navTitle" style="width:960px;">
      <div class="titleItem" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("schedule.record") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("schedule.snapshot") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==2 }" @click="onShowItem(2)">{{ $t("schedule.ftpupload") }}</div>
    </div>
    <div style="margin:8px 0 0 8px;" v-show="navnum==0">
      <a-checkbox @change="onChangeRecord" :checked="enablerecord">{{$t('common.enable')}}</a-checkbox>
      <div class="item">
        <div class="name">{{ $t("schedule.prerecord") }}</div>
        <select class="commonWidth" v-model="presec" :disabled="!enablerecord">
            <option value="0">0 {{$t('dt.second')}}</option>
            <option value="1">1 {{$t('dt.second')}}</option>
            <option value="2">2 {{$t('dt.second')}}</option>
            <option value="3">3 {{$t('dt.second')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("schedule.stream") }}</div>
        <select class="commonWidth" v-model="stream" :disabled="!enablerecord">
            <option value="0">{{$t('preview.mainstream')}}</option>
            <option value="1">{{$t('preview.substream')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("schedule.destination") }}</div>
        <select class="commonWidth" v-model="recordpath" :disabled="!enablerecord">
            <option value="0">Disk</option>
            <option value="1">NFS</option>
        </select>
      </div>
      <a-checkbox @change="()=>{enrecycle=!enrecycle}" :checked="enrecycle" :disabled="!enablerecord">{{$t('schedule.overwrite')}}</a-checkbox>
      <div class="item">
        <div class="name">{{ $t("schedule.recordpkg") }}</div>
        <select class="commonWidth" v-model="packsec" :disabled="!enablerecord">
            <option value="180">3 {{$t('dt.minute')}}</option>
            <option value="300">5 {{$t('dt.minute')}}</option>
            <option value="600">10 {{$t('dt.minute')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("common.schedule") }}</div>
        <a-radio-group v-model="recordRadioValue" :disabled="!enablerecord">
          <a-radio value="1">7*24 {{$t('dt.hour')}}</a-radio>
          <a-radio value="2">{{ $t("common.schedule") }}</a-radio>
        </a-radio-group>
      </div>
      <Sched v-show="recordRadioValue === '2'" :data="recordSecData" :subject="'schetask'" :m="1"></Sched>
    </div>
    <div style="margin:8px 0 0 8px;" v-show="navnum==1">
      <a-checkbox @change="onChangeSnap" :checked="enablesnap">{{$t('common.enable')}}</a-checkbox>
      <div class="item">
        <div class="name">{{ $t("schedule.destination") }}</div>
        <select class="commonWidth" v-model="snappath" :disabled="!enablesnap">
            <option value="0">Disk</option>
            <option value="1">NFS</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("common.schedule") }}</div>
        <a-radio-group v-model="snapRadioValue" :disabled="!enablesnap">
          <a-radio value="1">7*24 {{$t('dt.hour')}}</a-radio>
          <a-radio value="2">{{ $t("common.schedule") }}</a-radio>
        </a-radio-group>
      </div>
      <Sched v-show="snapRadioValue === '2'" :data="snapSecData" :subject="'schetask'" :m="0"></Sched>
    </div>
    <div style="margin:8px 0 0 8px;" v-show="navnum==2">
      <a-radio-group v-model="ftpRadioValue">
        <a-radio :style="radioStyle" value="1">7*24 {{$t('dt.hour')}}</a-radio>
        <a-radio :style="radioStyle" value="2">{{ $t("common.schedule") }}</a-radio>
        <Sched v-show="ftpRadioValue === '2'" :data="uploadSecData" :subject="'schetask'" :m="2"></Sched>
        <a-radio :style="radioStyle" value="0">{{ $t("common.disable") }}</a-radio>
      </a-radio-group>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{ $t("common.restore") }}</button>
      <button class="commonBtn" @click="getparam">{{ $t("common.refresh") }}</button>
      <button class="commonBtn" @click="saveparam">{{ $t("common.save") }}</button>
    </div>
  </div>
</template>
<script>
import { Checkbox, Radio } from "ant-design-vue";
import Sched from '../components/sched'
export default {
  data() {
    return {
      enablerecord: false,
      enablesnap: false,
      navnum: 0,
      presec: '0',
      stream: '0',
      recordpath: '0',
      enrecycle: false,
      packsec: '300',
      ftpRadioValue: '0',
      recordRadioValue: '1',
      snapRadioValue: '1',
      snapdata: {},
      snappath: '0',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      recordSecData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}],
      snapSecData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}],
      uploadSecData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}]
    };
  },
  components: {
    ACheckbox:  Checkbox,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    Sched: Sched
  },
  mounted() {
    this.getRecordParam();
    this.getRecordSchedule();
    this.getSnapParam();
    this.getSnapSchedule();
    this.getUploadSchedule();
  },
  methods: {
    onShowItem(n) {
      this.navnum = n;
    },
    onChangeRecord(){
      this.enablerecord = !this.enablerecord;
      if(!this.enablerecord){
        this.recordRadioValue = '1';
      }
    },
    onChangeSnap(){
      this.enablesnap = !this.enablesnap;
      if(!this.enablesnap){
        this.snapRadioValue = '1';
      }
    },
    restore() {
      if (this.navnum==0) {
        this.enablerecord =  false;
        this.presec = '0';
        this.stream = '0';
        this.recordpath = '0';
        this.enrecycle = false;
        this.packsec = '300';
        this.recordRadioValue = '1';
      } else if (this.navnum==1) {
        this.enablesnap = false;
        this.snappath = '0';
        this.snapRadioValue = '1';
      } else {
        this.ftpRadioValue = '0';
      }
    },
    getparam() {
      if (this.navnum==0) {
        this.getRecordParam();
        this.getRecordSchedule();
      } else if (this.navnum==1) {
        this.getSnapParam();
        this.getSnapSchedule();
      } else {
        this.getUploadSchedule();
      }
    },
    saveparam() {
      if (this.navnum==0) {
        this.saveRecordParam();
      } else if (this.navnum==1) {
        this.saveSnapParam();
      } else {
        this.saveUploadSchedule();
      }
    },
    saveRecordParam(){
      let object = {
        request: {
          record: {
            packsec: this.packsec,
            presec: this.presec,
            stream: this.stream,
            recycle: this.enrecycle?'1':'0',
            path: this.recordpath
          }
        }
      };
      let act;
      if (this.enablerecord) {
        if (this.recordRadioValue==='2') {
          act = 2;
        } else {
          act = 1;
        }
      } else {
        act = 0;
      }
      let object1 = {
        request: {
          schetask :{
            active: act
          } 
        }
      }
      this.$postAPI("/action/set?subject=record", object, true);
      this.$postAPI("/action/set?subject=schetask&type=1", object1, true);
    },
    saveSnapParam(){
      this.snapdata.path = this.snappath;
      let object = {request: {snap: this.snapdata}};
      let act;
      if (this.enablesnap) {
        if (this.snapRadioValue==='2') {
          act = 2;
        } else {
          act = 1;
        }
      } else {
        act = 0;
      }
      let object1 = {request: {schetask :{active: act} }};
      this.$postAPI("/action/set?subject=snap", object, true);
      this.$postAPI("/action/set?subject=schetask&type=0", object1, true);
    },
    saveUploadSchedule(){
      let object = {
        request: {
          schetask: {
            active : this.ftpRadioValue
          }
        }
      }
      this.$postAPI("/action/set?subject=schetask&type=2", object, true);
    },
    getRecordParam(){
      this.$getAPI("/action/get?subject=record").then((res)=>{
        this.stream = res.response.record.stream;
        this.packsec = res.response.record.packsec;
        this.presec = res.response.record.presec;
        this.enrecycle = res.response.record.recycle==1 ? true:false;
        this.recordpath = res.response.record.path;
      });
    },
    getSnapParam(){
      this.$getAPI("/action/get?subject=snap").then((res)=>{
        this.snapdata = res.response.snap;
        this.snappath = res.response.snap.path;
      });
    },
    getRecordSchedule(){
      this.$getAPI("/action/get?subject=schetask&type=1").then((res)=>{
        this.enablerecord = res.response.schetask.active==0?false:true;
        if(res.response.schetask.active==2){
          this.recordRadioValue = '2'
        }else{
          this.recordRadioValue = '1'
        }
        this.recordSecData = res.response.schetask.schedule.day;
      });
    },
    getSnapSchedule(){
      this.$getAPI("/action/get?subject=schetask&type=0").then((res)=>{
        this.enablesnap = res.response.schetask.active==0?false:true;
        if(res.response.schetask.active==2){
          this.snapRadioValue = '2'
        }else{
          this.snapRadioValue = '1'
        }
        this.snapSecData = res.response.schetask.schedule.day;
      });
    },
    getUploadSchedule(){
      this.$getAPI("/action/get?subject=schetask&type=2").then((res)=>{
        this.ftpRadioValue = res.response.schetask.active;
        this.uploadSecData = res.response.schetask.schedule.day;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
.commonWidth {
  width: 216px;
  height: 23px;
  outline: none;
}
</style>