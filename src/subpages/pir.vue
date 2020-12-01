<template>
  <div class="sideContent">
    <div class="navTitle" style="width:960px;margin-bottom:8px;">
      <div class="titleItem" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("common.schedule") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("motion.action") }}</div>
    </div>
    <div style="color: red;font-size:12px;" v-if="notsupport">{{$t('tip.notesupport')}}</div>
    <div v-show="navnum==0">
      <div style="margin:6px 0 6px 0;font-size:14px;">
          <span>{{$t('motion.mintime')}}</span>
          <input v-model="duration" maxlength="3" style="width:200px;height:23px;outline: none;" :disabled="notsupport" v-num/>
          <span style="color:#7f7f7f"> [ {{$t('common.maximum')}} 300s ]</span>
      </div>
      <a-radio-group v-model="radioValue" :disabled="notsupport">
          <a-radio :style="radioStyle" value="1">7*24 {{$t('dt.hour')}}</a-radio>
          <a-radio :style="radioStyle" value="2">{{ $t("common.schedule") }}</a-radio>
          <Sched v-show="radioValue === '2'" :data="secData" :subject="'alarm'" :m="4"></Sched>
          <a-radio :style="radioStyle" value="0">{{ $t("common.disable") }}</a-radio>
      </a-radio-group>
    </div>
    <div v-show="navnum==1">
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
export default {
    components: {
        ARadio: Radio,
        ARadioGroup: Radio.Group,
        Sched: Sched
    },
    data(){
        return{
            navnum: 0,
            notsupport: false,
            duration: 10,
            radioValue: '0',
            outmask: 0,
            secData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}],
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            }
        }
    },
    mounted(){
        this.$getAPI("/action/get?subject=devability").then((res) => {
            this.notsupport = res.response.devability.pir>0 ? false : true;
        });
        this.getparam();
    },
    methods:{
        onShowItem(n) {
            this.navnum = n;
        },
        restore(){
            this.duration = 10;
            this.radioValue = '0';
            this.outmask = 0;
        },
        getparam(){
            this.$getAPI("/action/get?subject=alarm&type=4").then((res) => {
                this.radioValue = res.response.alarmevt.active;
                this.duration = parseInt(res.response.alarmevt.duration);
                this.outmask = parseInt(res.response.alarmevt.outmask);
                this.secData = res.response.alarmevt.schedule.day;
            });
        },
        saveparam(){
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
            this.$postAPI("/action/set?subject=alarm&type=4", object, true);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
</style>