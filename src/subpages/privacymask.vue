<template>
    <div class="sideContent">
        <div class="navTitle">{{$t('configuration.privacymask')}}</div>
        <div>
            <a-checkbox @change="onChange" :checked="enable">{{$t('osd.enableprivacy')}}</a-checkbox>
            <span style="font-size:14px;color:red;padding-left:30px;">{{$t('tip.maxrect')}}</span>
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
            region: [],
            regions: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
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
                this.obj.UIMode = 13;
                this.obj.DeviceIp = document.location.hostname;
                this.obj.TcpPort = tcpport;
                this.obj.Play(username, password, 0);
                this.obj.StretchVideo(1);
                this.obj.SetPieceMaskFormat(12,20);
                this.addEvent(this.obj,'OnDrawItemChange',this.activexChange);
                this.getparam();
            },0)
        },
        addEvent(el, type, handler){
            if (el.attachEvent) {
                el.attachEvent(type, handler);
            } else if (el.addEventListener) {
                el.addEventListener(type, handler, false);
            }
        },
        activexChange(strpts){
            let ptsarr = strpts.split(',');
            if(ptsarr.length === 16){
                this.region = [[ptsarr[0],ptsarr[1],ptsarr[2],ptsarr[3]],[ptsarr[4],ptsarr[5],ptsarr[6],ptsarr[7]],[ptsarr[8],ptsarr[9],ptsarr[10],ptsarr[11]],[ptsarr[12],ptsarr[13],ptsarr[14],ptsarr[15]]];
            }
        },
        draw(){
            this.ctx_canvas.fillStyle = "#171717";
            for(let i=0; i<4;i++){
                if(this.regions[i][0]>=0 && this.regions[i][1]>=0){
                    this.ctx_canvas.fillRect(this.regions[i][0],this.regions[i][1],this.regions[i][2],this.regions[i][3]);
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
            this.regions[this.curindex][0] = Math.floor(tempx / 32) * 32;
            this.regions[this.curindex][1] = Math.floor(tempy / 32) * 32;
            this.regions[this.curindex][2] = 32;
            this.regions[this.curindex][3] = 32;
            this.startdraw = true;
        },
        movinggrid(e){
            if(!this.enable || !this.startdraw){
                return;
            }
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            if(this.regions[this.curindex][0] >= tempx || this.regions[this.curindex][1] >= tempy){
                return;
            }
            this.regions[this.curindex][2] = Math.ceil((tempx - this.regions[this.curindex][0]) / 32) * 32;
            this.regions[this.curindex][3] = Math.ceil((tempy - this.regions[this.curindex][1]) / 32) * 32;
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
            if(this.regions[this.curindex][0] >= tempx || this.regions[this.curindex][1] >= tempy){
                return;
            }
            this.regions[this.curindex][2] = Math.ceil((tempx - this.regions[this.curindex][0]) / 32) * 32;
            this.regions[this.curindex][3] = Math.ceil((tempy - this.regions[this.curindex][1]) / 32) * 32;
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
                this.clearData();
            }
        },
        clearData(){
            this.curindex = 0;
            this.regions = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
            this.region = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        },
        onClear(){
            if(this.obj!=null){
                this.obj.ClearDrawItems();
            }
            this.clearData();
            this.saveparam();
        },
        getparam(){
            this.$getAPI('/action/get?subject=privacy').then((res)=>{
                this.enable = res.response.privacy.active==1 ? true:false;
                let rectarr = res.response.privacy.rect;
                for(let i = 0; i<rectarr.length; i++){
                    let pointarr = rectarr[i].split(',');
                    this.region[i] = pointarr;
                }
                this.setEnable();
            })
        },
        saveparam(){
            if(!this.isie){
                this.region = this.regions;
            }
            let active = this.enable ? '1':'0';
            let rectarr = [];
            for(let i=0; i<4; i++){
                let x = Math.floor(parseInt(this.region[i][0]) / 32) * 32;
                let y = Math.floor(parseInt(this.region[i][1]) / 32) * 32;
                let w = Math.ceil(parseInt(this.region[i][2]) / 32) * 32;
                let h = Math.ceil(parseInt(this.region[i][3]) / 32) * 32;
                rectarr[i] = x + ',' + y + ',' + w + ',' + h ;
            }
            let object = {
                request:{
                    privacy:{
                        active: active,
                        resolution: "640x360",
                        rect: rectarr
                    }
                }
            }
            this.$postAPI("/action/set?subject=privacy", object, true);
            if(this.obj!=null){
                this.obj.ClearDrawItems();
            }
            if(!this.isie){
                this.ctx_canvas.clearRect(0,0,640,360);
                this.curindex = 0;
                this.regions = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
            }
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