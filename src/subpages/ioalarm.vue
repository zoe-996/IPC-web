<template>
  <div class="sideContent">
    <div class="navTitle" style="width:960px;margin-bottom:8px;">
      <div class="titleItem" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("configuration.ioalarm") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("common.schedule") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==2 }" @click="onShowItem(2)">{{ $t("motion.action") }}</div>
    </div>
    <div style="color: red;font-size:12px;" v-if="notsupport">{{$t('tip.notesupport')}}</div>
    <div v-show="navnum==0">
      <div class="item">
        <div class="name">{{ $t("ioalarm.inlevel") }}</div>
        <select class="commonWidth" v-model="inlevel" :disabled="notsupport">
            <option value="0">{{$t('common.low')}}</option>
            <option value="1">{{$t('common.high')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("ioalarm.outlevel") }}</div>
        <select class="commonWidth" v-model="outlevel" :disabled="notsupport">
            <option value="0">{{$t('common.low')}}</option>
            <option value="1">{{$t('common.high')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("ioalarm.alarmdn") }}</div>
        <select class="commonWidth" v-model="alarmdn" :disabled="notsupport">
            <option value="0">{{$t('common.disable')}}</option>
            <option value="1">{{$t('common.enable')}}</option>
        </select>
      </div>
      <div class="item">
        <div class="name">{{ $t("ioalarm.currentin") }}</div>
        <div class="value">{{curin}}</div>
      </div>
      <div class="item">
        <div class="name">{{ $t("ioalarm.currentout") }}</div>
        <select class="commonWidth" v-model="curout" :disabled="notsupport">
            <option value="0">{{$t('common.disable')}}</option>
            <option value="1">{{$t('common.high')}}</option>
            <option value="2">{{$t('common.low')}}</option>
            <option value="3">{{ $t("common.schedule") }}</option>
        </select>
      </div>
      <div v-show="curout==='3'">
        <div class="timebox">
          {{$t('common.period')}}1 : 
          <time-input v-model="stime1" @getTime="(res)=>{stime1=res}"></time-input> ~ <time-input v-model="etime1" @getTime="(res)=>{etime1=res}"></time-input>
          <select class="selectLevel" v-model="output1">
              <option value="2">{{$t('common.low')}}</option>
              <option value="1">{{$t('common.high')}}</option>
          </select>
        </div>
        <div class="timebox">
          {{$t('common.period')}}2 : 
          <time-input v-model="stime2" @getTime="(res)=>{stime2=res}"></time-input> ~ <time-input v-model="etime2" @getTime="(res)=>{etime2=res}"></time-input>
          <select class="selectLevel" v-model="output2">
              <option value="2">{{$t('common.low')}}</option>
              <option value="1">{{$t('common.high')}}</option>
          </select>
        </div>
        <div class="timebox">
          {{$t('common.period')}}3 : 
          <time-input v-model="stime3" @getTime="(res)=>{stime3=res}"></time-input> ~ <time-input v-model="etime3" @getTime="(res)=>{etime3=res}"></time-input>
          <select class="selectLevel" v-model="output3">
              <option value="2">{{$t('common.low')}}</option>
              <option value="1">{{$t('common.high')}}</option>
          </select>
        </div>
        <div class="timebox">
          {{$t('common.period')}}4 : 
          <time-input v-model="stime4" @getTime="(res)=>{stime4=res}"></time-input> ~ <time-input v-model="etime4" @getTime="(res)=>{etime4=res}"></time-input>
          <select class="selectLevel" v-model="output4">
              <option value="2">{{$t('common.low')}}</option>
              <option value="1">{{$t('common.high')}}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-show="navnum==1">
      <div style="margin:6px 0 6px 0;font-size:14px;">
          <span>{{$t('motion.mintime')}}</span>
          <input v-model="duration" maxlength="3" style="width:200px;height:23px;outline: none;" :disabled="notsupport" v-num />
          <span style="color:#7f7f7f"> [ {{$t('common.maximum')}} 300s ]</span>
      </div>
      <a-radio-group v-model="radioValue" :disabled="notsupport">
          <a-radio :style="radioStyle" value="1">7*24 {{$t('dt.hour')}}</a-radio>
          <a-radio :style="radioStyle" value="2">{{ $t("common.schedule") }}</a-radio>
          <Sched v-show="radioValue === '2'" :data="secData" :subject="'alarm'" :m="2"></Sched>
          <a-radio :style="radioStyle" value="0">{{ $t("common.disable") }}</a-radio>
      </a-radio-group>
    </div>
    <div v-show="navnum==2">
      <div>
        <input id="alarmout" type="checkbox" @change="()=>{outmask = (outmask & 1) ? outmask-1:outmask+1}" :checked="!!(outmask & 1)" :disabled="notsupport">
        <label for="alarmout">{{$t('motion.alarmout')}}</label>
      </div>
      <div>
        <input id="record" type="checkbox" @change="()=>{outmask = (outmask & 1<<13) ? outmask-8192:outmask+8192}" :checked="!!(outmask & 1<<13)" :disabled="notsupport">
        <label for="record">{{$t('motion.record')}}</label>
      </div>
      <div>
        <input id="ftp" type="checkbox" @change="()=>{outmask = (outmask & 1<<14) ? outmask-16384:outmask+16384}" :checked="!!(outmask & 1<<14)" :disabled="notsupport">
        <label for="ftp">{{$t('motion.ftp')}}</label>
      </div>
      <div>
        <input id="sendemail" type="checkbox" @change="()=>{outmask = (outmask & 1<<16) ? outmask-65536:outmask+65536}" :checked="!!(outmask & 1<<16)" :disabled="notsupport">
        <label for="sendemail">{{$t('motion.sendemail')}}</label>
      </div>
      <div>
        <input id="snapshot" type="checkbox" @change="()=>{outmask = (outmask & 1<<12) ? outmask-4096:outmask+4096}" :checked="!!(outmask & 1<<12)" :disabled="notsupport">
        <label for="snapshot">{{$t('motion.snapshot')}}</label>
      </div>
      <div>
        <input id="audioout" type="checkbox" @change="()=>{outmask = (outmask & 1<<17) ? outmask-131072:outmask+131072}" :checked="!!(outmask & 1<<17)" :disabled="notsupport">
        <label for="audioout">{{$t('motion.audioout')}}</label>
      </div>
    </div>
    <div class="buttonGroup">
        <button class="commonBtn" @click="restore" :disabled="notsupport">{{ $t("common.restore") }}</button>
        <button class="commonBtn" @click="getparam" :disabled="notsupport">{{ $t("common.refresh") }}</button>
        <button class="commonBtn" @click="saveparam" :disabled="notsupport">{{ $t("common.save") }}</button>
    </div>
  </div>
</template>
<script>
import { Radio } from "ant-design-vue";
import Sched from '../components/sched'
import TimeInput from '../components/timeinput'
export default {
  data() {
    return {
      navnum: 0,
      notsupport: false,
      duration: 10,
      radioValue: '0',
      outmask: 0,
      inlevel: '0',
      outlevel: '0',
      alarmdn: '0',
      curin: '',
      curout: '0',
      stime1: 0,
      stime2: 0,
      stime3: 0,
      stime4: 0,
      etime1: 0,
      etime2: 0,
      etime3: 0,
      etime4: 0,
      output1: '2',
      output2: '2',
      output3: '2',
      output4: '2',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      secData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}],
    };
  },
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    TimeInput,
    Sched
  },
  mounted() {
    this.$getAPI("/action/get?subject=devability").then((res) => {
      if (parseInt(res.response.devability.ioin) > 0) {
        this.notsupport = false;
      } else {
        this.notsupport = true;
      }
    });
    this.getparam();
  },
  methods: {
    onShowItem(n) {
      this.navnum = n;
    },
    restore() {
      if (this.navnum==0) {
        this.inlevel = '0';
        this.outlevel = '0';
        this.alarmdn = '0';
        this.curout = '0';
        this.stime1 = 0;
        this.stime2 = 0;
        this.stime3 = 0;
        this.stime4 = 0;
        this.etime1 = 0;
        this.etime2 = 0;
        this.etime3 = 0;
        this.etime4 = 0;
        this.output1 = '2';
        this.output2 = '2';
        this.output3 = '2';
        this.output4 = '2';
      } else {
        this.radioValue = '0';
        this.duration = '10';
        this.outmask = 0;
      }
    },
    getparam() {
      this.$getAPI('/action/get?subject=alarm&type=0').then((res)=>{
        this.radioValue = res.response.alarmevt.active;
        this.duration = parseInt(res.response.alarmevt.duration);
        this.outmask = parseInt(res.response.alarmevt.outmask);
        this.secData = res.response.alarmevt.schedule.day;
      });
      this.$getAPI('/action/get?subject=sysstatus').then((res)=>{
        this.curin = (res.response.systemstat.ioin & 0x01) ? this.$t('common.high') : this.$t('common.low');
      });
      this.$getAPI('/action/get?subject=alarmio').then((res)=>{
        this.inlevel = (res.response.alarmio.input & 1) ? '1':'0';
        this.outlevel = (res.response.alarmio.output & 1) ? '1':'0';
        this.alarmdn = res.response.alarmio.dnswitch;
        this.curout = res.response.alarmio.outmode;
        let section = res.response.alarmio.outduty.section;
        this.stime1 = parseInt(section[0].split('-')[0]);
        this.etime1 = parseInt(section[0].split('-')[1]);
        this.output1 = section[0].split('-')[2];
        this.stime2 = parseInt(section[1].split('-')[0]);
        this.etime2 = parseInt(section[1].split('-')[1]);
        this.output2= section[1].split('-')[2];
        this.stime3 = parseInt(section[2].split('-')[0]);
        this.etime3 = parseInt(section[2].split('-')[1]);
        this.output3 = section[2].split('-')[2];
        this.stime4 = parseInt(section[3].split('-')[0]);
        this.etime4 = parseInt(section[3].split('-')[1]);
        this.output4 = section[3].split('-')[2];
      })
    },
    saveparam() {
      if (this.navnum==0) {
        let str1 = this.stime1 + '-' + this.etime1 + '-' + this.output1;
        let str2 = this.stime2 + '-' + this.etime2 + '-' + this.output2;
        let str3 = this.stime3 + '-' + this.etime3 + '-' + this.output3;
        let str4 = this.stime4 + '-' + this.etime4 + '-' + this.output4;
        let object = {
          request: {
            alarmio: {
              input: this.inlevel,
              output: this.outlevel,
              dnswitch: this.alarmdn,
              outmode: this.curout,
              outduty: {
                section: [
                  str1,str2,str3,str4
                ]
              }
            }
          }
        }
        this.$postAPI("/action/set?subject=alarmio", object, true);
      } else {
        if(this.duration == '' || this.duration > 300){
          this.duration = '';
          return;
        }
        let object = {
          request: {
            alarmevt: {
              active: this.radioValue,
              duration: this.duration,
              outmask: this.outmask
            }
          }
        }
        this.$postAPI("/action/set?subject=alarm&type=0", object, true);
      }
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
.timebox{
  margin:10px 0 0 20px;
  font-size: 13px;
  display: flex;
  .selectLevel{
    margin-left: 10px;
    outline: none;
  }
}
.commonBtn:disabled{
  background-color: #949494;
  border: 1px solid #949494;
  color: #2c2c2c;
  cursor: default;
}
</style>