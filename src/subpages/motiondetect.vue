<template>
    <div class="sideContent">
        <div class="navTitle" style="width:1000px;">
            <div class="titleItem" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("motion.zone") }}</div>
            <div class="titleItem" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("common.schedule") }}</div>
            <div class="titleItem" :class="{ titleSelect: navnum==2 }" @click="onShowItem(2)">{{ $t("motion.action") }}</div>
        </div>
        <div v-show="navnum==0">
            <div style="color:red;margin:6px 0;font-size:13px;">{{$t('tip.maxrect')}}</div>
            <div style="width:642px;height:362px;border:1px solid black;position: relative;float:left;">
                <div id="iePlayer" v-if="isie">
                    <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="640" height="360" align='center'></object>
                </div>
                <div id="h5Player" v-else></div>
                <div style="width:640px;height:360px;position: absolute;left:0;top:0;" v-if="!isie">
                    <canvas id="canvas"></canvas>
                </div>
            </div>
            <div style="float:left;width:343px;height:362px;border:1px solid black;margin-left:6px;padding:10px 0 0 10px;font-size:13px;">
                <a-checkbox @change="onChange" :checked="enable">{{$t('motion.enablemotion')}}</a-checkbox>
                <div class="sliderbox">
                    <div class="text">{{$t('motion.sensitivity')}}</div>
                    <a-slider class="slider" v-model="sensitivity" :disabled="!enable" :min="0" :max="9"></a-slider>
                    <span>{{sensitivity}}</span>
                </div>
                <div class="sliderbox">
                    <div class="text">{{$t('motion.threshold')}}</div>
                    <a-slider class="slider" v-model="threshold" :disabled="!enable"></a-slider>
                    <span>{{threshold}}</span>
                </div>
                <div style="width:322px;height:172px;border:1px solid #2c2c2c;background-color: #f0f0f0;">
                    <canvas id="canvasMotion"></canvas>
                </div>
            </div>
            <div class="buttonGroup">
                <button class="commonBtn" @click="onClear">{{$t('motion.removeall')}}</button>
                <button class="commonBtn" @click="onAllrect">{{$t('motion.allrect')}}</button>
                <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
                <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
            </div>
        </div>
        <div v-show="navnum==1">
            <div style="margin:6px 0 6px 0;font-size:14px;">
                <span>{{$t('motion.mintime')}}</span>
                <input v-model="duration" maxlength="3" style="width:200px;height:23px;outline: none;" v-num/>
                <span style="color:#7f7f7f"> [ {{$t('common.maximum')}} 300s ]</span>
            </div>
            <a-radio-group v-model="radioValue">
                <a-radio :style="radioStyle" value="1">7*24 {{$t('dt.hour')}}</a-radio>
                <a-radio :style="radioStyle" value="2">{{ $t("common.schedule") }}</a-radio>
                <Sched v-show="radioValue === '2'" :data="secData" :subject="'alarm'" :m="2"></Sched>
                <a-radio :style="radioStyle" value="0">{{ $t("common.disable") }}</a-radio>
            </a-radio-group>
            <div class="buttonGroup">
                <button class="commonBtn" @click="secRestore">{{ $t("common.restore") }}</button>
                <button class="commonBtn" @click="getAlarmParam">{{ $t("common.refresh") }}</button>
                <button class="commonBtn" @click="saveAlarm">{{ $t("common.save") }}</button>
            </div>
        </div>
        <div v-show="navnum==2">
            <div><a-checkbox @change="()=>{outmask = (outmask & 1) ? outmask-1:outmask+1}" :checked="!!(outmask & 1)">{{$t('motion.alarmout')}}</a-checkbox></div>
            <div><a-checkbox @change="()=>{outmask = (outmask & 1<<13) ? outmask-8192:outmask+8192}" :checked="!!(outmask & 1<<13)">{{$t('motion.record')}}</a-checkbox></div>
            <div><a-checkbox @change="()=>{outmask = (outmask & 1<<14) ? outmask-16384:outmask+16384}" :checked="!!(outmask & 1<<14)">{{$t('motion.ftp')}}</a-checkbox></div>
            <div><a-checkbox @change="()=>{outmask = (outmask & 1<<16) ? outmask-65536:outmask+65536}" :checked="!!(outmask & 1<<16)">{{$t('motion.sendemail')}}</a-checkbox></div>
            <div><a-checkbox @change="()=>{outmask = (outmask & 1<<12) ? outmask-4096:outmask+4096}" :checked="!!(outmask & 1<<12)">{{$t('motion.snapshot')}}</a-checkbox></div>
            <div><a-checkbox @change="()=>{outmask = (outmask & 1<<17) ? outmask-131072:outmask+131072}" :checked="!!(outmask & 1<<17)">{{$t('motion.audioout')}}</a-checkbox></div>
            <div class="buttonGroup">
                <button class="commonBtn" @click="actionRestore">{{ $t("common.restore") }}</button>
                <button class="commonBtn" @click="getAlarmParam">{{ $t("common.refresh") }}</button>
                <button class="commonBtn" @click="saveAlarm">{{ $t("common.save") }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import { Checkbox, Slider, Radio } from "ant-design-vue";
import Sched from '../components/sched'
export default {
    data(){
        return{
          enable: false,
          T: null,
          T1: null,
          bv:null,
          obj: null,
          isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
          navnum: 0,
          region: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
          ctx_canvas: null,
          curindex: 0,
          ctx_ekg: null,
          bPauseSignal: false,
          startdraw: false,
          sensitivity: 5,
          threshold: 20,
          pointArray: [],
          duration: 10,
          radioValue: '0',
          secData: [{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']},{tsection:['0-0','0-0','0-0','0-0','0-0','0-0']}],
          outmask: 0,
          radioStyle: {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            }
        }
    },
    components:{
        ACheckbox: Checkbox,
        ASlider: Slider,
        ARadio: Radio,
        ARadioGroup: Radio.Group,
        Sched: Sched
    },
    mounted(){
        let canvas_ekg = document.getElementById("canvasMotion");
        this.ctx_ekg = canvas_ekg.getContext("2d");
        this.ctx_ekg.lineWidth = 1;
        canvas_ekg.width = 320;
        canvas_ekg.height = 170;
        for (let i = 0; i < 160; i++) {
            this.pointArray[i] = 0;
        }
        this.T1 = setInterval(()=>{
            if (!this.bPauseSignal) {
                this.ctx_ekg.clearRect(0, 0, 320, 170);
                this.ctx_ekg.strokeStyle = "#2c2c2c";
                this.renderGrade();
                this.ctx_ekg.strokeStyle = "#ff0000";
                this.getMotionSignal();
                this.renderPath();
                this.ctx_ekg.stroke();
            }
        },1000);
        if (this.isie) {
            this.initObject();
        } else {
            this.$getAPI("/action/get?subject=videoenc&stream=0").then((res)=>{
                if (res.response.videoenc.codec==1) {
                    document.getElementById('h5Player').innerHTML = "<img id='imgVideo' src='/action/snap' style='width: 640px;height: 360px'/>";
                    this.T = setInterval(()=>{
                        let num = Math.random() * 700 + 800;
                        num = parseInt(num,10);
                        let path = "/action/snap?t=" + String(num);
                        document.getElementById("imgVideo").src = path;
                    },1000);
                } else {
                    this.bv = new window.FlvJsPlayer({
                        id: 'h5Player',
                        playsinline: true,
                        url: '/action/stream?subject=flvlive&stream=0',
                        autoplay: true,
                        hasAudio: false,
                        controls: false,
                        ignores: ['replay'],
                        closeVideoClick: true,
                        height: '360',
                        width: '640'
                    });
                    if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
                        return;
                    }
                    this.bv.on('ended',()=>{
                        this.bv.src = '/action/stream?subject=flvlive&stream=0';
                    })
                }
            });
            let obj_canvas = document.getElementById("canvas");
            obj_canvas.width = 640;
            obj_canvas.height = 360;
            this.ctx_canvas = obj_canvas.getContext("2d");
            this.ctx_canvas.lineWidth = 1;
            obj_canvas.onmousedown = this.startdrawgrid;
            obj_canvas.onmouseup = this.stopdrawgrid;
            obj_canvas.onmousemove = this.movinggrid;
            obj_canvas.onmouseout = this.stopdrawgrid;
        }
        this.getMotionParam();
        this.getAlarmParam();
    },
    methods:{
        addpoint(pt){
            let point = parseInt(pt * 168 / 200);
            if(point >= 168){
                point = 167;
            }
            point = 168 - point;
            let bfind = false;
            for(let i = 0; i < 160; i++){
                if (this.pointArray[i] === 0) {
                    this.pointArray[i] = point;
                    bfind = true;
                }
            }
            if (!bfind) {
                for (let k = 0; k < 159; k++) {
                    this.pointArray[k] = this.pointArray[k + 1];
                }
                this.pointArray[159] = point;
            }
        },
        getMotionSignal(){
            this.$getAPI('/action/get?subject=mdstatus').then((res)=>{
                let row = res.response.mdstatus.row;
                let cell = res.response.mdstatus.cell;
                let col = res.response.mdstatus.col;
                let move = res.response.mdstatus.move;
                if(this.isie && this.obj!=null){
                    this.obj.SetPieceMaskShow(1,parseInt(row),parseInt(col),cell);
                }
                if(move > 200){
                    move = 200;
                }
                this.addpoint(move);
            });
        },
        renderPath(){
            this.ctx_ekg.beginPath();
            this.ctx_ekg.moveTo(0.5, this.pointArray[0] + 0.5);
            for (let j = 1; j < 160; j++) {
                this.ctx_ekg.lineTo(j * 2, this.pointArray[j]);
            }
        },
        renderGrade(){
            let offset = parseInt(170 / 10);
            let base = offset;
            for(let i = 0; i < 10; i++){
                this.ctx_ekg.beginPath();
                this.ctx_ekg.moveTo(0.5, base + 0.5);
                this.ctx_ekg.lineTo(320 + 20, base);
                this.ctx_ekg.stroke();
                base += offset;
            }
            this.ctx_ekg.strokeStyle = "#436eee";
            offset = 170 / 100;
            this.ctx_ekg.beginPath();
            this.ctx_ekg.moveTo(0, parseInt(offset * (100 - this.threshold)) + 0.5);
            this.ctx_ekg.lineTo(320, parseInt(offset * (100 - this.threshold)) + 0.5);
            this.ctx_ekg.stroke();
        },
        onShowItem(n) {
            this.navnum = n;
            if(n==0){
                this.bPauseSignal = false;
            }else{
                this.bPauseSignal = true;
            }
        },
        initObject(){
            var _obj = document.getElementById("iePlayer");
            var scriptStr = document.createElement('script');
            scriptStr.setAttribute('for', 'activex');
            scriptStr.event = 'OnLoad';
            _obj.appendChild(scriptStr);
            let username = localStorage.getItem("user");
            let password = localStorage.getItem("pwd");
            let lang = localStorage.getItem("lang");
            let tcpport = 6000;
            this.$getAPI('/action/get?subject=netserv').then((res)=>{
                tcpport = res.response.netserv.tcp;
            });
            setTimeout(()=>{
                this.obj = document.getElementById('activex');
                this.obj.Language = parseInt(lang);
                this.obj.UIMode = 11;
                this.obj.DeviceIp = document.location.hostname;
                this.obj.TcpPort = tcpport;
                this.obj.Play(username, password, 0);
                this.obj.StretchVideo(1);
                this.obj.SetPieceMaskFormat(24,40);
            },0)
        },
        draw(){
            this.ctx_canvas.strokeStyle = "red";
            for(let i=0; i<4;i++){
                if(this.region[i][2]>0 && this.region[i][3]>0){
                    this.ctx_canvas.strokeRect(this.region[i][0],this.region[i][1],this.region[i][2],this.region[i][3]);
                    for (let tempw = 16; tempw < parseInt(this.region[i][2]); tempw += 16) {
                        this.ctx_canvas.beginPath();
                        this.ctx_canvas.moveTo(tempw + parseInt(this.region[i][0]) + 0.5, parseInt(this.region[i][1]));
                        this.ctx_canvas.lineTo(tempw + parseInt(this.region[i][0]), parseInt(this.region[i][3]) + parseInt(this.region[i][1]));
                        this.ctx_canvas.stroke();
                    }
                    for (let temph = 15; temph < parseInt(this.region[i][3]); temph += 15) {
                        this.ctx_canvas.beginPath();
                        this.ctx_canvas.moveTo(parseInt(this.region[i][0]), temph + parseInt(this.region[i][1]) - 0.5);
                        this.ctx_canvas.lineTo(parseInt(this.region[i][2]) + parseInt(this.region[i][0]), temph + parseInt(this.region[i][1]) + 0.5);
                        this.ctx_canvas.stroke();
                    }
                }
            }
        },
        startdrawgrid(e){
            if(!this.enable){
                return;
            }
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            this.region[this.curindex][0] = parseInt(tempx / 16) * 16;
            this.region[this.curindex][1] = parseInt(tempy / 15) * 15;
            this.startdraw = true;
        },
        movinggrid(e){
            if(!this.enable || !this.startdraw){
                return;
            }
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            tempx = parseInt(tempx / 16) * 16 + 16;
            tempy = parseInt(tempy / 15) * 15 + 15;
            if(this.region[this.curindex][0] >= tempx || this.region[this.curindex][1] >= tempy){
                return;
            }
            this.region[this.curindex][2] = tempx - this.region[this.curindex][0];
            this.region[this.curindex][3] = tempy - this.region[this.curindex][1];
            this.ctx_canvas.clearRect(0,0,640,360);
            this.draw();
        },
        stopdrawgrid(e){
            if(!this.enable || !this.startdraw){
                return;
            }
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            tempx = parseInt(tempx / 16) * 16 + 16;
            tempy = parseInt(tempy / 15) * 15 + 15;
            if(this.region[this.curindex][0] >= tempx || this.region[this.curindex][1] >= tempy){
                return;
            }
            this.region[this.curindex][2] = tempx - this.region[this.curindex][0];
            this.region[this.curindex][3] = tempy - this.region[this.curindex][1];
            this.startdraw = false;
            if(this.curindex >= 3){
                return;
            }
            this.curindex++;
        },
        onChange(){
            this.enable = !this.enable;
            this.setEnable();
        },
        setEnable(){
            if(this.enable){
                if(!this.isie){
                    this.draw();
                }
                if(this.obj != null){
                    this.obj.SetEnableDraw(1);
                }
            }else{
                if(!this.isie){
                    this.ctx_canvas.clearRect(0,0,640,360);
                }
                if(this.obj != null){
                    this.obj.ClearDrawItems();
                    this.obj.SetEnableDraw(0);
                }
            }
        },
        onAllrect(){
            if(this.obj!=null){
                this.obj.SetRectangePoints('0,0,640,360,0,0,0,0,0,0,0,0,0,0,0,0');
            }else{
                this.region[this.curindex] = [0,0,640,360];
                this.draw();
            }
        },
        onClear(){
            if(!this.isie){
                this.curindex = 0;
                this.region = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
                this.ctx_canvas.clearRect(0,0,640,360);
            }
            if(this.obj!=null){
                this.obj.ClearDrawItems();
            }
        },
        restore(){
            this.enable = false;
            this.sensitivity = 5;
            this.threshold = 20;
            this.setEnable();
        },
        secRestore(){
            this.radioValue = '0';
            this.duration = 10;
        },
        actionRestore(){
            this.outmask = 0;
        },
        getMotionParam(){
            this.$getAPI('/action/get?subject=motion').then((res)=>{
                this.enable = res.response.motion.active==1 ? true:false;
                this.sensitivity = res.response.motion.sensitivity;
                this.threshold = res.response.motion.threshold;
                let rectarr = res.response.motion.rect;
                if(!this.isie){
                    for(let i = 0; i<rectarr.length; i++){
                        let pointarr = rectarr[i].split(',');
                        this.region[i] = pointarr;
                    }
                }
                if(this.obj!=null){
                    this.obj.SetRectangePoints(rectarr[0] + ',' + rectarr[1] + ',' + rectarr[2] + ',' + rectarr[3]);
                }
                this.setEnable();
            })
        },
        getAlarmParam(){
            this.$getAPI('/action/get?subject=alarm&type=2').then((res)=>{
                this.radioValue = res.response.alarmevt.active;
                this.duration = parseInt(res.response.alarmevt.duration);
                this.outmask = parseInt(res.response.alarmevt.outmask);
                this.secData = res.response.alarmevt.schedule.day;
            });
        },
        saveAlarm(){
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
            this.$postAPI("/action/set?subject=alarm&type=2", object, true);
        },
        saveparam(){
            let active = this.enable ? '1':'0';
            let rectarr = [];
            if(this.obj!=null){
                let rects = this.obj.GetRectangleValue();
                let arr = rects.split(',');
                rectarr[0] = arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + arr[3];
                rectarr[1] = arr[4] + ',' + arr[5] + ',' + arr[6] + ',' + arr[7];
                rectarr[2] = arr[8] + ',' + arr[9] + ',' + arr[10] + ',' + arr[11];
                rectarr[3] = arr[12] + ',' + arr[13] + ',' + arr[14] + ',' + arr[15];
            }
            if(!this.isie){
                for(let i=0; i<4; i++){
                    let x = Math.floor(parseInt(this.region[i][0]) / 32) * 32;
                    let y = Math.floor(parseInt(this.region[i][1]) / 32) * 32;
                    let w = Math.ceil(parseInt(this.region[i][2]) / 32) * 32;
                    let h = Math.ceil(parseInt(this.region[i][3]) / 32) * 32;
                    rectarr[i] = x + ',' + y + ',' + w + ',' + h ;
                }
            }
            let object = {
                request:{
                    motion:{
                        active: active,
                        resolution: "640x360",
                        sensitivity: this.sensitivity,
                        threshold: this.threshold,
                        rect: rectarr
                    }
                }
            }
            this.$postAPI("/action/set?subject=motion", object, true);
        }
    },
    destroyed(){
        if(this.bv!=null){
            this.bv.destroy(true);
        }
        if(this.T!=null){
            clearInterval(this.T);
        }
        if(this.T1!=null){
            clearInterval(this.T1);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
.sliderbox{
    width: 100%;
    height: 30px;
    display: flex;
    align-items:center;
    .text{
        width: 100px;
        display: inline-block;
    }
    .slider{
        width: 150px;
        display: inline-block;
    }
}
</style>