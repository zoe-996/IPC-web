<template>
  <div class="sideContent">
    <div class="navTitle" style="width:960px;margin-bottom:8px;">
      <div class="titleItem" style="width: 170px;" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("ioalarm.netab") }}</div>
      <div class="titleItem" style="width: 178px;" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("ioalarm.startup") }}</div>
    </div>
    <div v-show="navnum==0">
        <input id="ennetab" type="checkbox" :checked="enable1" @change="()=>{enable1=!enable1}">
        <label for="ennetab">{{$t("common.enable")}}</label>
        <div style="margin:6px 0 6px 0;font-size:14px;">
            <span>{{$t('motion.mintime')}}</span>
            <input v-model="duration" maxlength="3" style="width:200px;height:23px;outline: none;" :disabled="!enable1" v-num />
            <span style="color:#7f7f7f"> [ {{$t('common.maximum')}} 300s ]</span>
        </div>
        <div>
            <input id="enalarmout" type="checkbox" @change="()=>{outmask1 = (outmask1 & 1) ? outmask1-1:outmask1+1}" :checked="!!(outmask1 & 1)" :disabled="!enable1">
            <label for="enalarmout">{{$t('motion.alarmout')}}</label>
        </div>
        <div>
            <input id="enrecord" type="checkbox" @change="()=>{outmask1 = (outmask1 & 1<<13) ? outmask1-8192:outmask1+8192}" :checked="!!(outmask1 & 1<<13)" :disabled="!enable1">
            <label for="enrecord">{{$t('motion.record')}}</label>
        </div>
        <div>
            <input id="ensnapshot" type="checkbox" @change="()=>{outmask1 = (outmask1 & 1<<12) ? outmask1-4096:outmask1+4096}" :checked="!!(outmask1 & 1<<12)" :disabled="!enable1">
            <label for="ensnapshot">{{$t('motion.snapshot')}}</label>
        </div>
        <div>
            <input id="enaudioout" type="checkbox" @change="()=>{outmask1 = (outmask1 & 1<<17) ? outmask1-131072:outmask1+131072}" :checked="!!(outmask1 & 1<<17)" :disabled="!enable1">
            <label for="enaudioout">{{$t('motion.audioout')}}</label>
        </div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="restoreNetwork">{{ $t("common.restore") }}</button>
            <button class="commonBtn" @click="getNetwork">{{ $t("common.refresh") }}</button>
            <button class="commonBtn" @click="saveNetwork">{{ $t("common.save") }}</button>
        </div>
    </div>
    <div v-show="navnum==1">
        <input id="startup" type="checkbox" :checked="enable2" @change="()=>{enable2=!enable2}">
        <label for="startup">{{$t("common.enable")}}</label>
        <div>
            <input id="alarmout" type="checkbox" @change="()=>{outmask = (outmask & 1) ? outmask-1:outmask+1}" :checked="!!(outmask & 1)" :disabled="!enable2">
            <label for="alarmout">{{$t('motion.alarmout')}}</label>
        </div>
        <div>
            <input id="record" type="checkbox" @change="()=>{outmask = (outmask & 1<<13) ? outmask-8192:outmask+8192}" :checked="!!(outmask & 1<<13)" :disabled="!enable2">
            <label for="record">{{$t('motion.record')}}</label>
        </div>
        <div>
            <input id="ftp" type="checkbox" @change="()=>{outmask = (outmask & 1<<14) ? outmask-16384:outmask+16384}" :checked="!!(outmask & 1<<14)" :disabled="!enable2">
            <label for="ftp">{{$t('motion.ftp')}}</label>
        </div>
        <div>
            <input id="sendemail" type="checkbox" @change="()=>{outmask = (outmask & 1<<16) ? outmask-65536:outmask+65536}" :checked="!!(outmask & 1<<16)" :disabled="!enable2">
            <label for="sendemail">{{$t('motion.sendemail')}}</label>
        </div>
        <div>
            <input id="snapshot" type="checkbox" @change="()=>{outmask = (outmask & 1<<12) ? outmask-4096:outmask+4096}" :checked="!!(outmask & 1<<12)" :disabled="!enable2">
            <label for="snapshot">{{$t('motion.snapshot')}}</label>
        </div>
        <div>
            <input id="audioout" type="checkbox" @change="()=>{outmask = (outmask & 1<<17) ? outmask-131072:outmask+131072}" :checked="!!(outmask & 1<<17)" :disabled="!enable2">
            <label for="audioout">{{$t('motion.audioout')}}</label>
        </div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="restoreStartup">{{ $t("common.restore") }}</button>
            <button class="commonBtn" @click="getStartup">{{ $t("common.refresh") }}</button>
            <button class="commonBtn" @click="saveStartup">{{ $t("common.save") }}</button>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            navnum: 0,
            enable1: false,
            enable2: false,
            duration: 10,
            outmask1: 0,
            outmask: 0
        }
    },
    mounted(){
        this.getNetwork();
        this.getStartup();
    },
    methods:{
        onShowItem(n) {
            this.navnum = n;
        },
        restoreNetwork(){
            this.enable1 = false;
            this.duration = 10;
            this.outmask1 = 0;
        },
        restoreStartup(){
            this.enable2 = false;
            this.outmask = 0;
        },
        getNetwork(){
            this.$getAPI("/action/get?subject=alarm&type=5").then((res) => {
                this.enable1 = res.response.alarmevt.active == 0 ? false : true;
                this.duration = parseInt(res.response.alarmevt.duration);
                this.outmask1 = parseInt(res.response.alarmevt.outmask);
            });
        },
        getStartup(){
            this.$getAPI("/action/get?subject=alarm&type=1").then((res) => {
                this.enable2 = res.response.alarmevt.active == 0 ? false : true;
                this.outmask = parseInt(res.response.alarmevt.outmask);
            });
        },
        saveNetwork(){
            if(this.duration == '' || this.duration > 300){
                this.duration = '';
                return;
            }
            let act = this.enable1 ? '1' : '0';
            let object = {
                request: {
                    alarmevt: {
                        active: act,
                        duration: this.duration,
                        outmask: this.outmask1
                    }
                }
            }
            this.$postAPI("/action/set?subject=alarm&type=5", object, true);
        },
        saveStartup(){
            let act = this.enable2 ? '1' : '0';
            let object = {
                request: {
                    alarmevt: {
                        active: act,
                        outmask: this.outmask
                    }
                }
            }
            this.$postAPI("/action/set?subject=alarm&type=1", object, true);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
</style>