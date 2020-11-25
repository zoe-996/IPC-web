<template>
    <div class="sideContent">
        <div class="navTitle">{{$t('configuration.roi')}}</div>
        <div>
            <a-checkbox @change="onChange" :checked="enable">{{$t('osd.enableroi')}}</a-checkbox>
            <span class="maxrect">{{$t('tip.maxrect')}}</span>
        </div>
        <div style="width:642px;height:362px;border:1px solid black;margin-top:10px;position: relative;">
            <div id="iePlayer" v-if="isie">
                <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="640" height="360" align='center'></object>
            </div>
            <div id="h5Player" v-else></div>
            <div style="width:640px;height:360px;position: absolute;left:0;top:0;" v-if="!isie">
                <canvas id="canvas"></canvas>
            </div>
        </div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="onClear">{{$t('common.clear')}}</button>
            <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
        </div>
    </div>
</template>
<script>
import { Checkbox } from "ant-design-vue";
export default {
    data(){
        return{
          enable: false,
          T: null,
          bv:null,
          obj: null,
          isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
          region: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
          ctx_canvas: null,
          curindex: 0,
          startdraw: false
        }
    },
    components:{
        ACheckbox: Checkbox
    },
    mounted(){
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
                    if(!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))){
                        this.bv.on('ended',()=>{
                            this.bv.src = '/action/stream?subject=flvlive&stream=0';
                        })
                    }
                }
                this.getparam();
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
    },
    methods:{
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
                this.getparam();
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
        getparam(){
            this.$getAPI('/action/get?subject=videorio').then((res)=>{
                this.enable = res.response.videorio.active==1 ? true:false;
                let rectarr = res.response.videorio.rect;
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
                    videorio:{
                        active: active,
                        resolution: "640x360",
                        rect: rectarr
                    }
                }
            }
            this.$postAPI("/action/set?subject=videorio", object, true);
        }
    },
    destroyed(){
        if(this.bv!=null){
            this.bv.destroy(true);
        }
        if(this.T!=null){
            clearInterval(this.T);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/style/hasvideo.scss';
</style>