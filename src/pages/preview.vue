<template>
    <a-layout style="flex:1;display:flex;flex-direction: row;background:#c9c9c9">
        <div class="videoBox">
            <div id="iePlayer" v-if="isie">
                <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="100%" height="100%"></object>
            </div>
            <div id="h5Player" style="display: flex;" v-else>
                <div style='margin:auto;' v-if="showH265">
                    <a style='color: #974040;'>{{$t('tip.streamnotsupport')}}</a>
                </div>
            </div>
            <div class="videoCtrl">
                <div style="margin: 2px 0 0 6px;float:left;width:130px;">
                    <div style="display:inline-block;">
                        <div :title="$t('preview.ratio')" class="groupButton" @click="onShowRatio">
                            <img :src="ratioImg" style="width:24px; height: 18px;">
                            <i class="dropdown"></i>
                        </div>
                    </div>
                    <div class="popup" style="width: 130px;height: 30px;left:14px;" v-show="showRatioType" @mouseleave="()=>{showRatioType=false}">
                        <img :title="$t('preview.normal')"   class="imgButton" src="../assets/img/ratio1x.png"   @click="onSwitchRatio(1)">
                        <img :title="$t('preview.ratio43')"  class="imgButton" src="../assets/img/ratio4_3.png"  @click="onSwitchRatio(2)">
                        <img :title="$t('preview.ratio169')" class="imgButton" src="../assets/img/ratio16_9.png" @click="onSwitchRatio(3)">
                        <img :title="$t('preview.stretch')"  class="imgButton" src="../assets/img/stretch.png"   @click="onSwitchRatio(4)">
                    </div>
                    <div style="display:inline-block;">
                        <div :title="$t('preview.channel')" class="groupButton" @click="onShowStream">
                            <img :src="channelImg" style="width:24px; height: 18px;">
                            <i class="dropdown"></i>
                        </div>
                    </div>
                    <div class="popup" style="width: 72px;height: 30px;left:60px;" v-show="showStreamType" @mouseleave="()=>{showStreamType=false}">
                        <img :title="$t('preview.mainstream')"  class="imgButton" src="../assets/img/channel1.png" @click="onSwitchChannel(0)">
                        <img :title="$t('preview.substream')"  class="imgButton" src="../assets/img/channel2.png" @click="onSwitchChannel(1)">
                    </div>
                </div>
                <div style="width: 24px ;height: 24px;float:left;" :title="alarmTips">
                    <img :src="alarmPic" style="width: 24px;height: 24px;">
                </div>
                <div style="float:right;margin-right:10px;">
                    <img class="imgButtonCut" :title="$t('preview.audio')" :src="audioImg" v-if="isie" @click="onAudio"/>
                    <img class="imgButtonCut" :title="$t('preview.intercom')" :src="talkImg" v-if="isie" @click="onTalkback"/>
                    <img class="imgButtonCut" :title="$t('preview.snapshot')" src="../assets/img/snapshot.png" @click="onSnapshot"/>
                    <img class="imgButtonCut" :title="$t('preview.consecutivesnapshot')" src="../assets/img/consecutivesnapshot.png" v-if="isie" @click="onConSnapshot"/>
                    <img class="imgButtonCut" :title="$t('preview.record')" :src="recordImg" v-if="isie" @click="onRecord"/>
                    <img class="imgButtonCut" :title="$t('preview.ezoom')" :src="zoomImg" v-if="isie" @click="onEzoom"/>
                    <img class="imgButtonCut" :title="$t('preview.fullscreen')" src="../assets/img/fullscreen.png" v-if="isie" @click="onFullscreen"/>
                </div>
            </div>
        </div>
        <div class="btn">
            <img :src="hideImg" style="cursor:pointer;" @click="ctrl()">
        </div>
        <div class="ctrlArea" v-show="ctrlArea">
            <Accordion></Accordion>
        </div>
    </a-layout>
</template>
<script>
import { Layout } from 'ant-design-vue';
import Accordion from '../components/Accordion'
export default {
    data() {
        return {
            ctrlArea:true,
            isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
            hideImg:require('@/assets/img/hide.png'),
            bv:null,
            obj:null,
            channel: 0,
            tcpPort: 6000,
            audioOn: false,
            talkOn: false,
            recordOn:false,
            zoomOn:false,
            iscorridor: 0,
            showRatioType: false,
            showStreamType: false,
            showH265: false,
            ratioImg:require('@/assets/img/stretch.png'),
            channelImg:require('@/assets/img/channel1.png'),
            audioImg:require('@/assets/img/mute.png'),
            talkImg:require('@/assets/img/talkbackoff.png'),
            recordImg:require('@/assets/img/recordoff.png'),
            zoomImg:require('@/assets/img/zoomadd.png'),
            alarmPic: require('@/assets/img/alarm.png'),
            alarmTips: this.$t('preview.noalarm'),
            T: null,
            alarmtype: 0,
            count: 40,
            alarmFlag: false
        };
    },
    components:{
        ALayout:Layout,
        Accordion
    },
    async mounted(){
        if (this.isie) {
            let videoimg =  await this.$getAPI('/action/get?subject=videoimage');
            this.iscorridor = videoimg.response.videoimage.rotate;
            let data0 = await this.$getAPI('/action/get?subject=netserv');
            this.tcpPort = data0.response.netserv.tcp;
            var _obj = document.getElementById("iePlayer");
            var scriptStr = document.createElement('script');
            scriptStr.setAttribute('for', 'activex');
            scriptStr.event = 'OnLoad';
            _obj.appendChild(scriptStr);
            this.initObject(0);
        } else {
            this.initPlayer(0);
        }
        this.getAlarmParam();
    },
    methods:{
        async initPlayer(n){
            let data2 = await this.$getAPI('/action/get?subject=videoenc&stream=' + n );
            let vCodec = data2.response.videoenc.codec;
            let audioen = data2.response.videoenc.audioen;
            if(vCodec==1){
                if(this.bv!=null){
                    this.bv.destroy(true);
                    this.bv = null;
                }
                this.showH265 = true;
                return;
            }else{
                this.showH265 = false;
            }
            let hasAudio = false;
            let url = '/action/stream?subject=flvlive&stream=' + n;
            let data1 = await this.$getAPI('/action/get?subject=audioenc');
            let active = data1.response.audioenc.active;
            let aCodec = data1.response.audioenc.codec;
            if(active==1 && aCodec==2 && audioen==1){
                hasAudio = true;
            }
            if(this.bv==null){
                this.showH265 = false;
                this.bv = new window.FlvJsPlayer({
                    id: 'h5Player',
                    playsinline: true,
                    url: url,
                    autoplay: true,
                    hasAudio: hasAudio,
                    ignores: ['time','play','progress','replay'],
                    closeVideoClick: true,
                    height: '100%',
                    width: '100%'
                });
            }else{
                this.bv.src = url;
            }
            if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
                return;
            }
            this.bv.on('ended',async ()=>{
                this.bv.src = url;
                let result = await this.$getAPI('/action/get?subject=videoenc&stream=' + n );
                if(result.response.videoenc.codec == 1){
                    this.bv.destroy(true);
                    this.bv = null;
                    this.showH265 = true;
                }
            })
        },
        initObject(n){
            if(this.obj!==null){
                this.obj.Stop(2000);
            }
            let username = localStorage.getItem("user");
            let password = localStorage.getItem("pwd");
            let lang = localStorage.getItem("lang");
            setTimeout(()=>{
                this.obj = document.getElementById('activex');
                let ocxver = this.obj.GetVersion();
                let regver = new RegExp("[0-9.]+");
                ocxver = String(regver.exec(ocxver));
                let verarr = ocxver.split('.');
                if(parseInt(verarr[0]) < 4 || (parseInt(verarr[0])===4 && parseInt(verarr[1]) < 30)){
                    document.getElementById('iePlayer').innerHTML="<div  style='width: 100%;height: 48px;text-align: center;margin-top: 200px;'><a href='/setup.exe' style='color: #974040;'>" + this.$t('tip.downocx') + "</a></div>";
                    return;
                }
                this.obj.Language = parseInt(lang);
                this.obj.UIMode = 1;
                this.obj.DeviceIp = document.location.hostname;
                this.obj.TcpPort = this.tcpPort;
                this.obj.Play(username, password, n);
                if (this.audioOn) {
                    this.obj.SetSpeakerVolume(85);
                } else {
                    this.obj.SetSpeakerVolume(0);
                }
                if (this.iscorridor == 1) {
                    this.obj.SetVideoRatio(0);
                    this.obj.StretchVideo(0);
                }
            },0)
        },
        getAlarmParam(){
            this.$getAPI('/action/alarm?subject=subcript').then((res)=>{
                let aurl = res.response.refer.url;
                let urlarr = aurl.split('=');
                if (urlarr.length > 0) {
                    let strid = urlarr[urlarr.length - 1];
                    this.T = setInterval(()=>{
                        this.getAlarmInfo(strid);
                    },1500)
                }
            });
        },
        getAlarmInfo(strid){
            let url = "/action/alarm?subject=query&id=" + strid;
            this.$getAPI(url).then((res)=>{
                if(res.response != ''){
                    let alarmtype = res.response.alarmmsg.topic;
                    let statu = res.response.alarmmsg.status;
                    if(statu == 1){
                        if (alarmtype == "IO") {
                            this.alarmTips = this.$t('preview.ioalarm');
                        } else if (alarmtype == "MOTION") {
                            this.alarmTips = this.$t('preview.malarm');
                        } else if (alarmtype == "PIR") {
                            this.alarmTips = this.$t('preview.piralarm');
                        }
                        if(!this.alarmFlag){
                            this.count = 40;
                            this.alarmFlag = true
                            this.switchPic();
                        }
                    }
                }
            })
        },
        switchPic(){
            if (this.alarmtype == 0) {
                this.alarmtype = 1;
                this.alarmPic = require('@/assets/img/alarm1.png');
            } else {
                this.alarmtype = 0;
                this.alarmPic = require('@/assets/img/alarm.png');
            }
            if (this.count == 0) {
                this.alarmPic = require('@/assets/img/alarm.png');
                this.alarmTips = this.$t('preview.noalarm');
                this.alarmFlag = false;
            } else {
                this.count--;
                setTimeout(()=>{
                    this.switchPic();
                },500)
            }
        },
        ctrl(){
            if(this.ctrlArea){
                this.hideImg = require('@/assets/img/show.png');
                this.ctrlArea = !this.ctrlArea;
            }else{
                this.hideImg = require('@/assets/img/hide.png');
                this.ctrlArea = !this.ctrlArea;
            }
        },
        onShowRatio(){
            this.showRatioType = !this.showRatioType;
        },
        onShowStream(){
            this.showStreamType = !this.showStreamType;
        },
        aspectRatio(m,n){
            let width = document.getElementById('h5Player').clientWidth;
            let height =document.getElementById('h5Player').clientHeight;
            let w = height * m / n;
            let h = width * n / m;
            if (w > width) {
                w = width;
                return {w,h}
            } else {
                h = height;
                return {w,h}
            }
        },
        onSwitchRatio(n){
            if (n==1) {
                this.ratioImg = require('@/assets/img/ratio1x.png');
                this.showRatioType = false;
                if(this.isie){
                    this.obj.SetVideoRatio(0);
                    this.obj.StretchVideo(0);
                }else{
                    document.getElementsByTagName('video')[0].setAttribute('style','width:100%;height:100%;object-fit:contain;');
                }
            }else if (n==2) {
                this.ratioImg = require('@/assets/img/ratio4_3.png');
                this.showRatioType = false;
                if(this.isie){
                    this.obj.SetVideoRatio(1);
                    this.obj.StretchVideo(0);
                }else{
                    let { w, h } = this.aspectRatio(4,3);
                    document.getElementsByTagName('video')[0].setAttribute('style','width:' + w + 'px;height:' + h + 'px;object-fit:fill;margin: auto;');
                }
            } else if (n==3) {
                this.ratioImg = require('@/assets/img/ratio16_9.png');
                this.showRatioType = false;
                if(this.isie){
                    this.obj.SetVideoRatio(2);
                    this.obj.StretchVideo(0);
                }else{
                    let { w, h } = this.aspectRatio(16,9);
                    document.getElementsByTagName('video')[0].setAttribute('style','width:' + w + 'px;height:' + h + 'px;object-fit:fill;margin: auto;');
                }
            } else {
                this.ratioImg = require('@/assets/img/stretch.png');
                this.showRatioType = false;
                if(this.isie){
                    this.obj.StretchVideo(1);
                }else{
                    document.getElementsByTagName('video')[0].setAttribute('style','width:100%;height:100%;object-fit:fill;');
                }
            }
        },
        onSwitchChannel(i){
            if(this.channel == i){
                this.showStreamType = false;
                return;
            }else{
                if (i==0) {
                    this.channelImg = require('@/assets/img/channel1.png')
                } else {
                    this.channelImg = require('@/assets/img/channel2.png')
                }
                this.channel = i;
                if (this.isie) {
                    this.initObject(i);
                } else {
                    this.initPlayer(i);
                }
            }
            this.showStreamType = false;
        },
        onAudio(){
            if(this.obj!==null){
                if(this.audioOn){
                    this.audioOn = false;
                    this.audioImg = require('@/assets/img/mute.png');
                    this.obj.SetSpeakerVolume(0);
                }else{
                    this.audioOn = true;
                    this.audioImg = require('@/assets/img/volumehover.png');
                    this.obj.SetSpeakerVolume(80);
                }
            }
        },
        onTalkback(){
            if(this.obj!==null){
                if(this.talkOn){
                    this.talkOn = false;
                    this.talkImg = require('@/assets/img/talkbackoff.png');
                    this.obj.StopTalkback();
                }else{
                    this.talkOn = true;
                    this.talkImg = require('@/assets/img/talkbackonhover.png');
                    this.obj.StartTalkback();
                }
            }
        },
        onSnapshot(){
            if(this.obj!==null){
                this.obj.Snapshot();
            }else{
                window.open("http://" + document.location.host + "/action/snap")
            }
        },
        onConSnapshot(){
            if(this.obj!==null){
                this.obj.MultSnapshot(3);
            }
        },
        onRecord(){
            if(this.obj!==null){
                if(this.recordOn){
                    this.recordOn = false;
                    this.recordImg = require('@/assets/img/recordoff.png');
                    this.obj.StopRecord();
                }else{
                    this.recordOn = true;
                    this.recordImg = require('@/assets/img/recordon.png');
                    this.obj.StartRecord();
                }
            }
        },
        onEzoom(){
            if(this.obj!==null){
                if(this.zoomOn){
                    this.zoomOn = false;
                    this.zoomImg = require('@/assets/img/zoomadd.png');
                    this.obj.EnableZoom(0);
                }else{
                    this.zoomOn = true;
                    this.zoomImg = require('@/assets/img/zoomaddhover.png');
                    this.obj.EnableZoom(1);
                }
            }
        },
        onFullscreen(){
            if(this.obj!==null){
                this.obj.FullScreen();
            }
        }
    },
    destroyed(){
        if(this.bv!=null){
            this.bv.destroy(true);
        }
        if(this.T!=null){
            clearInterval(this.T)
        }
    }
}
</script>
<style lang="scss" scoped>
.videoBox{
    #iePlayer,#h5Player{
        width: 100%;
        height: 100%;
        flex: 1;
        background: #000;
        border: 3px solid #03547c;
        overflow: hidden;
    }
    .videoCtrl{
        width: 100%;
        height: 35px;
        background-color: #fff;
        border: 1px solid #000;
        margin-top:2px;
        overflow: hidden;
        .groupButton{
            width:48px;
            height:26px;
            cursor:pointer;
            margin:1px;
            border:1px solid black;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items:center;
            .dropdown{
                background: url('../assets/img/dropdown.png') no-repeat;
                display: inline-block;
                width: 12px;
                height: 18px;
            }
        }
        .groupButton:hover{
            border:1px solid #bb131a;
        }
        .popup{
            border: 1px solid black;
            border-radius: 4px;
            background-color: #f0f0f0;
            position: fixed;
            bottom: 0.17rem;
        }
        .imgButton{
            width: 26px;
            height: 20px;
            margin: 0 0 0 4px;
            cursor: pointer;
        }
        .imgButtonCut{
            margin: 2px 0 0 12px;
            width: 30px;
            height: 30px;
            padding: 4px;
            border:2px solid transparent;
            cursor: pointer;
        }
        .imgButtonCut:hover{
            border:2px solid #bb131a;
        }
    }
}
.btn{
    width:10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.ctrlArea{
    background: #fff;
    border-radius: 3px;
    display: inline-block;
    width:220px;
    margin: 5px 10px 5px 3px;
    overflow: hidden;
}
</style>