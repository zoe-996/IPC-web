<template>
    <div class="sideContent">
        <div class="navTitle">{{$t('configuration.osd')}}</div>
        <div style="width:642px;height:362px;border:1px solid black;margin-top:10px;position: relative;">
            <div id="iePlayer" v-if="isie">
                <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="640" height="360" align='center'></object>
            </div>
            <div id="h5Player" v-else></div>
            <div style="width:640px;height:360px;position: absolute;left:0;top:0;" v-if="!isie">
                <canvas id="canvas"></canvas>
            </div>
        </div>
        <div>
            <a-checkbox @change="()=>{showdevinfo=!showdevinfo}" :checked="showdevinfo" style="color:#cd3333;font-size:13px;">{{$t('osd.devinfo')}}</a-checkbox>
        </div>
        <div>
            <a-checkbox @change="()=>{showdevtime=!showdevtime}" :checked="showdevtime" style="color:#9932cc;font-size:13px;">{{$t('osd.devtime')}}</a-checkbox>
        </div>
        <div style="display: flex;align-items:center;">
            <a-checkbox @change="()=>{showcustom=!showcustom}" :checked="showcustom" style="color:#b3ee3a;font-size:13px;width:180px;">{{$t('osd.devcustom')}}</a-checkbox>
            <input style="width:160px;height:23px;outline: none;font-size:13px;" maxlength="10" v-model="customtext" v-pwd/>
        </div>
        <div style="display: flex;align-items:center;">
            <a-checkbox @change="()=>{showpic=!showpic}" :checked="showpic" style="color:#63b8ff;font-size:13px;width:180px;">{{$t('osd.devpicture')}}</a-checkbox>
            <input style="width:160px;height:23px;outline: none;color:#7f7f7f;font-size:13px;" :value="filename" disabled />
            <div style="display:inline-block;margin-left:8px;">
                <input id="file" type="file" @change="onFileSelect" style="display:none;"/>
                <button class="commonBtn" @click="onBrowse">{{$t('upgrade.browse')}}</button>
                <button class="commonBtn" @click="onUpload">{{$t('osd.upload')}}</button>
            </div>
        </div>
        <div id="tip" style="color: red;font-size:12px;margin-top:8px;"></div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
            <button class="commonBtn" @click="saveparam(true)">{{$t('common.save')}}</button>
        </div>
    </div>
</template>
<script>
import { Checkbox, message } from "ant-design-vue"
export default {
    data(){
        return{
            bv:null,
            obj: null,
            isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
            showdevinfo: true,
            showdevtime: true,
            showcustom: false,
            showpic: false,
            filename: '',
            customtext: '',
            T: null,
            ctx_canvas: null,
            offsetpoint: {x:'',y:''},
            curindex: -1,
            region: [],
            picwidth: '',
            picheight: ''
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
            })
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
                this.obj.UIMode = 12;
                this.obj.DeviceIp = document.location.hostname;
                this.obj.TcpPort = tcpport;
                this.obj.Play(username, password, 0);
                this.obj.StretchVideo(1);
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
        activexChange(){
            let strpts = this.obj.GetRectanglePoints();
            let ptsarr = strpts.split(',');
            if(ptsarr.length === 16){
                this.region = [ptsarr[0],ptsarr[1],ptsarr[4],ptsarr[5],ptsarr[12],ptsarr[13],ptsarr[8],ptsarr[9]];
            }
            this.saveparam(false);
        },
        getparam(){
            this.$getAPI('/action/get?subject=osd').then((res)=>{
                this.showdevinfo = res.response.osd.system.osditem.active==1 ? true:false;
                let xpos1 = res.response.osd.system.osditem.xpos;
                let ypos1 = res.response.osd.system.osditem.ypos;
                this.showdevtime = res.response.osd.datetime.osditem.active==1 ? true:false;
                let xpos2 = res.response.osd.datetime.osditem.xpos;
                let ypos2 = res.response.osd.datetime.osditem.ypos;
                this.showpic = res.response.osd.picture.osditem.active==1 ? true:false;
                let xpos3 = res.response.osd.picture.osditem.xpos;
                let ypos3 = res.response.osd.picture.osditem.ypos;
                this.showcustom = res.response.osd.custom.osditem.active==1 ? true:false;
                let xpos4 = res.response.osd.custom.osditem.xpos;
                let ypos4 = res.response.osd.custom.osditem.ypos;
                this.customtext = res.response.osd.custom.ctext;
                xpos1 = parseInt(xpos1 * 640 / 1000) > 3 ? parseInt(xpos1 * 640 / 1000) - 3 : 0;
                ypos1 = parseInt(ypos1 * 360 / 1000) > 3 ? parseInt(ypos1 * 360 / 1000) - 3 : 0;
                xpos2 = parseInt(xpos2 * 640 / 1000) > 3 ? parseInt(xpos2 * 640 / 1000) - 3 : 0;
                ypos2 = parseInt(ypos2 * 360 / 1000) > 3 ? parseInt(ypos2 * 360 / 1000) - 3 : 0;
                xpos3 = parseInt(xpos3 * 640 / 1000) > 3 ? parseInt(xpos3 * 640 / 1000) - 3 : 0;
                ypos3 = parseInt(ypos3 * 360 / 1000) > 3 ? parseInt(ypos3 * 360 / 1000) - 3 : 0;
                xpos4 = parseInt(xpos4 * 640 / 1000) > 3 ? parseInt(xpos4 * 640 / 1000) - 3 : 0;
                ypos4 = parseInt(ypos4 * 360 / 1000) > 3 ? parseInt(ypos4 * 360 / 1000) - 3 : 0;
                if (this.isie) {
                    let tagstr = xpos1 + ',' + ypos1 + ',' + xpos2 + ',' + ypos2+ ',' + xpos4 + ',' + ypos4+ ',' + xpos3 + ',' + ypos3;
                    this.obj.SetOSDPoints(tagstr);
                } else {
                    this.region = [xpos1,ypos1,xpos2,ypos2,xpos3,ypos3,xpos4,ypos4];
                    let obj_canvas = document.getElementById("canvas");
                    obj_canvas.width = 640;
                    obj_canvas.height = 360;
                    this.ctx_canvas = obj_canvas.getContext("2d");
                    this.ctx_canvas.lineWidth = 2;
                    obj_canvas.onmousedown = this.startdrawgrid;
                    obj_canvas.onmouseup = this.stopdrawgrid;
                    obj_canvas.onmousemove = this.movinggrid;
                    obj_canvas.onmouseout = ()=>{this.curindex == -1};
                    this.draw();
                }
            })
        },
        draw(){
            this.ctx_canvas.strokeStyle = "#cd3333";
            this.ctx_canvas.strokeRect(this.region[0] + 0.5, this.region[1] + 0.5, 180, 22);
            this.ctx_canvas.strokeStyle = "#9932cc";
            this.ctx_canvas.strokeRect(this.region[2] + 0.5, this.region[3] + 0.5, 180, 22);
            this.ctx_canvas.strokeStyle = "#63b8ff";
            this.ctx_canvas.strokeRect(this.region[4] + 0.5, this.region[5] + 0.5, 30, 30);
            this.ctx_canvas.strokeStyle = "#b3ee3a";
            this.ctx_canvas.strokeRect(this.region[6] + 0.5, this.region[7] + 0.5, 200, 22);
        },
        startdrawgrid(e){
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            if (tempx >= this.region[0] && tempx <= this.region[0] + 180 && tempy >= this.region[1] && tempy <= this.region[1] + 22) {
                this.curindex = 0;
                this.offsetpoint.x = tempx - this.region[0];
                this.offsetpoint.y = tempy - this.region[1];
            } else if (tempx >= this.region[2] && tempx <= this.region[2] + 180 && tempy >= this.region[3] && tempy <= this.region[3] + 22) {
                this.curindex = 2;
                this.offsetpoint.x = tempx - this.region[2];
                this.offsetpoint.y = tempy - this.region[3];
            } else if (tempx >= this.region[4] && tempx <= this.region[4] + 30 && tempy >= this.region[5] && tempy <= this.region[5] + 30) {
                this.curindex = 4;
                this.offsetpoint.x = tempx - this.region[4];
                this.offsetpoint.y = tempy - this.region[5];
            } else if (tempx >= this.region[6] && tempx <= this.region[6] + 200 && tempy >= this.region[7] && tempy <= this.region[7] + 22) {
                this.curindex = 6;
                this.offsetpoint.x = tempx - this.region[6];
                this.offsetpoint.y = tempy - this.region[7];
            }
        },
        stopdrawgrid(){
            if (this.curindex == -1){
                return;
            }
            this.saveparam(false);
            this.curindex = -1;
        },
        movinggrid(e){
            if (this.curindex == -1){
                return;
            }
            let evt = e || window.event;
            let tempx = evt.offsetX;
            let tempy = evt.offsetY;
            let currenty = this.curindex + 1;
            this.region[this.curindex] = tempx - this.offsetpoint.x;
            this.region[currenty] = tempy - this.offsetpoint.y;
            this.ctx_canvas.clearRect(0, 0, 640, 360);
            this.draw();
        },
        restore(){
            this.showdevinfo = true;
            this.showdevtime = true;
            this.showcustom = false;
            this.showpic = false;
            this.customtext = '';
        },
        onFileSelect(e){
            this.filename = document.getElementById("file").value;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (ev)=>{
                let image = new Image();
                image.src = ev.target.result;
                image.onload = ()=>{
                    this.picwidth = image.width;
                    this.picheight = image.height;
                }
            }
            reader.readAsDataURL(file);
        },
        onBrowse(){
            document.getElementById("file").click();
        },
        onUpload(){
            let arr = this.filename.split('.');
            if(this.picwidth>250 || this.picheight>150 || arr[arr.length-1]!="jpg"){
                document.getElementById("tip").innerText = this.$t('osd.picturenote');
                return;
            }
            let file = document.getElementById("file").files[0];
            let param = new FormData();
            param.append("file", file);
            this.$uploadFile("/action/upload?file=logo", param).then((res)=>{
                if(res.status==200){
                    message.success(this.$t('tip.uploadsuc'));
                }
            }).catch(()=>{
                message.error(this.$t('tip.uploadfai'));
            });
        },
        saveparam(hasinfo){
            let regions = [];
            regions[0] = parseInt((parseInt(this.region[0]) + 6) * 1000 / 640);
            regions[1] = parseInt((parseInt(this.region[1]) + 6) * 1000 / 360);
            regions[2] = parseInt((parseInt(this.region[2]) + 6) * 1000 / 640);
            regions[3] = parseInt((parseInt(this.region[3]) + 6) * 1000 / 360);
            regions[4] = parseInt((parseInt(this.region[4]) + 6) * 1000 / 640);
            regions[5] = parseInt((parseInt(this.region[5]) + 6) * 1000 / 360);
            regions[6] = parseInt((parseInt(this.region[6]) + 6) * 1000 / 640);
            regions[7] = parseInt((parseInt(this.region[7]) + 6) * 1000 / 360);
            let sysinfoen = this.showdevinfo ? '1':'0';
            let systimeen = this.showdevtime ? '1':'0';
            let picen = this.showpic ? '1':'0';
            let customen = this.showcustom ? '1':'0';
            let xmlstr = '<?xml version="1.0" encoding="utf-8"?>' + '<request>' + '<osd ver="2.0">' + '<system>' + '<osditem>' + '<active>' + sysinfoen + '</active>' + '<xpos>' + regions[0] + '</xpos>' + '<ypos>' + regions[1] + '</ypos>' + '</osditem>' + '</system>' + '<datetime>' + '<osditem>' + '<active>' + systimeen + '</active>' + '<xpos>' + regions[2] + '</xpos>' + '<ypos>' + regions[3] + '</ypos>' + '</osditem>' + '</datetime>' + '<picture>' + '<osditem>' + '<active>' + picen + '</active>' + '<xpos>' + regions[4] + '</xpos>' + '<ypos>' + regions[5] + '</ypos>' + '</osditem>' + '</picture>' + '<custom>' + '<osditem>' + '<active>' + customen + '</active>' + '<xpos>' + regions[6] + '</xpos>' + '<ypos>' + regions[7] + '</ypos>' + '</osditem>' + '<ctext>' + this.customtext + '</ctext>' + '</custom>' + '</osd>' + '</request>';
            this.$post("/action/set?subject=osd", xmlstr).then(()=>{
                if(hasinfo){
                    message.success(this.$t('tip.infosave'));
                }
            }).catch(()=>{
                if(hasinfo){
                    message.error(this.$t('tip.errset'));
                }
            });
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