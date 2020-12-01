<template>
    <a-layout style="display:flex;flex-direction: row;background:#c9c9c9">
        <div class="videoBox">
            <div id="iePlayer" v-if="isie">
                <object id="activex" classid="clsid:45467EBB-4FA5-44CD-91E2-6AEA9B99618F" width="100%" height="100%"></object>
            </div>
            <div id="h5Player1" v-else>
            </div>
            <div class="videoCtrl">
                <div id="resizeGetwidth" class="controlButtons">
                    <img class="imgBtn" :title="$t('playback.stopplay')" src="../assets/img/stop.png" @click="onControl(0)">
                    <img class="imgBtn" :title="$t('playback.slowplay')" src="../assets/img/slow.png" v-if="isie" @click="onControl(1)">
                    <img class="imgBtn" :title="$t('playback.startplay')" src="../assets/img/play.png" v-if="isie" v-show="!isplay" @click="onControl(6)">
                    <img class="imgBtn" :title="$t('playback.pauseplay')"  src="../assets/img/pause.png" v-if="isie" v-show="isplay" @click="onControl(7)">
                    <img class="imgBtn" :title="$t('playback.fastplay')"  src="../assets/img/fast.png" v-if="isie" @click="onControl(2)">
                    <img class="imgBtn" :title="$t('playback.frameplay')" src="../assets/img/frame.png" v-if="isie" @click="onControl(3)">
                    <span style="padding-left: 40px;font-size:12px;">{{playspeed}}</span>
                    <img class="imgBtnRight" :title="$t('preview.fullscreen')" src="../assets/img/fullscreen.png" v-if="isie" @click="onControl(5)">
                    <img class="imgBtnRight" :title="$t('preview.audio')" :src="audioImg" v-if="isie" @click="onControl(8)">
                </div>
                <div style="width: 100%;height: 58px;background-color: #1b486b;">
                    <div id="timelineContent" style="width: 100%;height: 100%;background-color: #969696;"></div>
                </div>
                <div style="width: 100%;height:24px;">
                    <div style="float:left;">
                        <img style="width: 18px;height:18px;cursor: pointer;margin:0 10px 0 10px;" src="../assets/img/shrink.png" @click="onChangeTimeline(true)">
                        <img style="width: 18px;height:18px;cursor: pointer;" src="../assets/img/stretch1.png" @click="onChangeTimeline(false)">
                    </div>
                    <div style="margin-right: 42px;float:right;">
                        <div style="background-color: #6495ed;width: 14px;height:14px;display:inline-block;margin:0 5px 0 15px"></div>
                        <span style="font-size: 12px;color:#fff;">{{$t('playback.continuousrec')}}</span>
                        <div style="background-color: #cd3700;width: 14px;height:14px;display:inline-block;margin:0 5px 0 15px"></div>
                        <span style="font-size: 12px;color:#fff;">{{$t('playback.alarmrec')}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="playbackCalender" v-show="calendarArea">
            <a-calendar :fullscreen="false" @select="onSelect" @panelChange="onPanelChange"/>
            <button class="searchButton" :disabled="searchDisabled" @click="onSearch">{{$t('common.search')}}</button>
        </div>
    </a-layout>
</template>
<script>
import { Layout, Calendar } from 'ant-design-vue';
export default {
    data(){
        return{
            isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
            calendarArea:true,
            isplay:false,
            audioImg:require('@/assets/img/mute.png'),
            mute: true,
            selectDate: '',
            progressBar: null,
            obj: null,
            bv: null,
            playtime: null,
            playspeed: '',
            playframe: false,
            searchDisabled: false,
            T: null
        }
    },
    components:{
        ALayout:Layout,
        ACalendar:Calendar
    },
    mounted(){
        this.onPanelChange(1);
        setTimeout(()=>{
            this.progressBar = window.timeline("timelineContent");
            this.progressBar.startdraw();
            this.progressBar.setplaytime(3600);
            this.progressBar.addevent("doubleclk",this.timelineDbclick);
        },0);
        if (this.isie) {
            var _obj = document.getElementById("iePlayer");
            var scriptStr = document.createElement('script');
            scriptStr.setAttribute('for', 'activex');
            scriptStr.event = 'OnLoad';
            _obj.appendChild(scriptStr);
            var scriptStr1 = document.createElement('script');
            scriptStr1.setAttribute('for', 'activex');
            scriptStr1.event = 'OnPlayProgress';
            _obj.appendChild(scriptStr1);
        }
        let username = localStorage.getItem("user");
        this.$getAPI('/action/get?subject=user&name=' + username).then((res)=>{
            let option = res.response.user.permit.operation;
            if(option & 2){
                if(this.isie){
                    this.initObject()
                }
            }else{
                if (this.isie) {
                    document.getElementById('iePlayer').innerHTML="<div  style='width: 100%;height: 48px;text-align: center;margin-top: 200px;color: #974040;'>" + this.$t('playback.noauth') + "</div>";
                } else {
                    document.getElementById('h5Player1').innerHTML="<div  style='width: 100%;height: 48px;text-align: center;margin-top: 200px;color: #974040;'>" + this.$t('playback.noauth') + "</div>";
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    methods: {
        initObject(){
            let username = localStorage.getItem("user");
            let password = localStorage.getItem("pwd");
            let lang = localStorage.getItem("lang");
            let tcpport = 6000;
            this.$getAPI('/action/get?subject=netserv').then((res)=>{
                tcpport = res.response.netserv.tcp;
            });
            setTimeout(()=>{
                this.obj = document.getElementById('activex');
                if(!this.obj.contentDocument){
                    return;
                }
                this.obj.InitUI(0);
                this.obj.SetLanguage(parseInt(lang));
                this.obj.SetLoginInfo( 0, username, password, document.location.hostname, tcpport);
                this.obj.LoginIPC();
            },0)
        },
        setMask(mask){
            let arr = document.getElementsByClassName('ant-fullcalendar-value');
            let index = [];
            for(var i=0; i<arr.length ;i++){
                arr[i].style.background = "";
                if(arr[i].innerText == '01'){
                    index.push(i);
                }
            }
            for(var j=index[0]; j<index[1] ;j++){
                if(mask & (0x01 << (arr[j].innerText - 1))){
                    arr[j].style.background = "#03547c";
                }
            }
        },
        onPanelChange(value){
            let date;
            if (value===1) {
                let today = new Date;
                let m = (today.getMonth() + 1) < 10 ? '0'+(today.getMonth() + 1) : (today.getMonth() + 1);
                date = String(today.getFullYear()) + String(m);
            } else {
                let m = (value.month() + 1) < 10 ? '0'+(value.month() + 1) : (value.month() + 1);
                date = String(value.year()) + String(m);
            }
            let object = {
                request:{
                    recsearch:{
                        mode: 0,
                        chn: 1,
                        date: date,
                        type: 3,
                        stream: 3
                    }
                }
            };
            this.$postRe('/action/stream?subject=recsearch',object).then(res =>{
                let datemask = res.response.recorddesc.rmask;
                if(datemask.length > 0){
                    datemask = parseInt(datemask);
                }else{
                    datemask = 0;
                }
                this.setMask(datemask)
            })
        },
        onSelect(value) {
            let m = (value.month() + 1) < 10 ? '0'+(value.month() + 1) : (value.month() + 1);
            let d = value.date() < 10 ? '0'+value.date() : value.date();
            this.selectDate = String(value.year()) + String(m) + String(d);
        },
        onSearch(){
            let object = {
                request:{
                    recsearch:{
                        mode: 1,
                        chn: 1,
                        date: this.selectDate,
                        begin: 0,
                        end: 86400,
                        type: 3,
                        stream: 3
                    }
                }
            };
            this.$postRe('/action/stream?subject=recsearch',object).then(res =>{
                this.progressBar.clearsections();
                if(res.response==null){
                    return;
                }
                let arr = res.response.recorddesc;
                for(var k=0; k<arr.length;k++){
                    let begin = arr[k].begin;
                    let end = arr[k].end;
                    let type = arr[k].type;
                    let path = arr[k].path;
                    let audioen = arr[k].audioen;
                    let acodec = arr[k].acodec;
                    if(type == 3){
                        type=2
                    }
                    this.progressBar.addsection(parseInt(begin), parseInt(end), path, parseInt(type), parseInt(audioen), parseInt(acodec));
                }
                
            })
        },
        timelineDbclick(tagtime,audioen,acodec){
            if (this.isie) {
                this.obj.StartPlayByPos(this.selectDate, tagtime, 86400);
                this.obj.SetVolume(0);
                this.isplay = true;
                this.audioImg = require('@/assets/img/mute.png');
                this.playframe = false;
            }else{
                let ishasAudio = false;
                if(this.bv != null){
                    this.bv.destroy(true);
                    this.bv = null;
                }
                if(audioen == undefined || acodec == undefined){
                    this.progressBar.setplaytime(tagtime);
                    return;
                }
                if(audioen == 1 && acodec == 2){
                    ishasAudio = true;
                }
                let uuid = Math.round(Math.random() * 4200000);
                let url = '/action/stream?subject=flvplayback&date=' + this.selectDate + '&time=' + tagtime + '-86400&sid=' + String(uuid);
                if (this.bv == null) {
                    this.bv = new window.FlvJsPlayer({
                        id: 'h5Player1',
                        hasAudio:ishasAudio,
                        playsinline: true,
                        url: url,
                        autoplay: true,
                        height: '100%',
                        width: '100%',
                        ignores: ['time','play','progress','replay']
                    });
                }
            }
            this.searchDisabled = true;
            this.playtime = tagtime;
            if(this.T == null){
                this.T = setInterval(()=>{
                    if (this.isie) {
                        if(this.obj != null && this.obj.IsPlaying()){
                            this.progressBar.setplaytime(this.obj.GetPlayProgress());
                            if (this.playframe) {
                                return;
                            }
                            let speed = this.obj.GetPlayspeed();
                            if (speed === 0) {
                                this.playspeed = '';
                            } else if (speed === 1) {
                                this.playspeed = '1X';
                            } else if (speed === 2) {
                                this.playspeed = '2X';
                            } else if (speed === 3) {
                                this.playspeed = '1/2X';
                            } else if (speed === 4) {
                                this.playspeed= '1/4X';
                            }
                        }
                    }else{
                        if(this.bv!= null){
                            let curtime = this.playtime + parseInt(this.bv.video.currentTime);
                            if (this.playtime == curtime) {
                                return;
                            }
                            this.progressBar.setplaytime(curtime);
                            if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
                                return;
                            }
                            if(this.bv.ended){
                                this.bv.destroy(true);
                                this.bv = null;
                                this.searchDisabled = false;
                            }
                        }
                    }
                },200);
            }
        },
        onChangeTimeline(flag){
            if(this.progressBar==null){
                return;
            }
            if(flag){
                this.progressBar.shrink();
            }else{
                this.progressBar.stretch();
            }
        },
        onControl(n){
            if(this.isie){
                if(!this.obj.contentDocument){
                    return;
                }
                if(n==0){
                    this.obj.StopPlay();
                    this.isplay = false;
                    this.searchDisabled = false;
                    this.playspeed = '';
                    this.playframe = false
                }else if(n==1){
                    if(this.obj.IsPlaying()){
                        this.obj.PlayControl(n,0);
                        this.isplay = false;
                        this.playframe = false;
                    }
                }else if(n==6){
                    if(this.obj.IsPlaying()){
                        this.obj.PausePlay(0);
                        this.isplay = true;
                        this.playframe = false;
                    }
                }else if(n==7){
                    if(this.obj.IsPlaying()){
                        this.obj.PausePlay(1);
                        this.isplay = false;
                    }
                }else if(n==2){
                    if(this.obj.IsPlaying()){
                        this.obj.PlayControl(n,0);
                        this.isplay = false;
                        this.playframe = false;
                    }
                }else if(n==3){
                    if(this.obj.IsPlaying()){
                        this.obj.PlayControl(n,0);
                        this.isplay = false;
                        this.playframe = true;
                        this.playspeed = '';
                    }
                }else if(n==5){
                    this.obj.PlayControl(n,0);
                }else if(n==8){
                    if(this.obj.IsPlaying()){
                        if(this.mute){
                            this.obj.SetVolume(80);
                            this.audioImg = require('@/assets/img/volumehover.png');
                            this.mute = false;
                        }else{
                            this.obj.SetVolume(0);
                            this.audioImg = require('@/assets/img/mute.png');
                            this.mute = true;
                        }
                    }
                }
            }else{
                if(this.bv != null && n==0){
                    this.bv.destroy(true);
                    this.bv = null;
                    this.searchDisabled = false;
                }
            }
        },
    },
    destroyed(){
        if(this.bv!=null){
            this.bv.destroy(true);
        }
        if(this.T != null){
            clearInterval(this.T);
        }
    }
}
</script>
<style lang="scss" scoped>
.videoBox{
    #iePlayer,#h5Player1{
        width: 100%;
        height: 100%;
        flex: 1;
        background: #000;
        border: 3px solid #03547c;
        overflow: hidden;
    }
    .videoCtrl{
        width: 100%;
        height: 120px;
        .controlButtons{
            background-color: #fff;
            height: 42px;
            margin-top:2px;
            .imgBtn{
                margin: 4px 0 0 8px;
                width: 32px;
                height: 32px;
                padding: 4px;
                border: 1px solid transparent;
                cursor: pointer;
            }
            .imgBtn:hover,.imgBtnRight:hover{
                border:1px solid #bb131a;
            }
            .imgBtnRight{
                float: right;
                margin: 4px 8px 0 0;
                width: 30px;
                height: 30px;
                padding: 4px;
                border: 1px solid transparent;
                cursor:pointer;
            }
        }
    }
}
.playbackCalender{
    background: #fff;
    border-radius: 3px;
    display: inline-block;
    width:273px;
    margin: 5px 5px 5px 3px;
    .searchButton{
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #03547c;
        border: 1px solid #03547c;
        border-radius: 6px;
        outline: none;
        text-align: center;
        color: white;
        cursor: pointer;
    }
    .searchButton:hover{
        background-color: #bb131a;
        border: 1px solid #bb131a;
    }
    .searchButton:disabled{
    background-color: #a7a7a7;
    border: 1px solid #a7a7a7;
    color: #ccc;
    cursor: default;
    }
}
</style>