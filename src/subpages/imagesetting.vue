<template>
  <div class="sideContent">
    <div class="navTitle" style="width: 1000px;">
      <div class="titleItem" :class="{ titleSelect: navnum==0 }" @click="onShowItem(0)">{{ $t("imgsetting.imgbase") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==1 }" @click="onShowItem(1)">{{ $t("common.schedule") }}</div>
      <div class="titleItem" :class="{ titleSelect: navnum==2 }" @click="onShowItem(2)">{{ $t("imgsetting.daynight") }}</div>
    </div>
    <div class="tabContext" v-show="navnum==0">
      <div class="box">
        <div id="iePlayer" v-if="isie">
          <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="460" height="288" align='center'></object>
        </div>
        <div id="h5Player" v-else></div>
      </div>
      <div style="float: left;margin-left:20px;">
        <div>
          <div class="smallGapline">
            <div class="name">{{ $t("imgsetting.standard") }}</div>
            <select class="commonWith" v-model="freq">
                <option value="0">50Hz</option>
                <option value="1">60Hz</option>
            </select>
          </div>
          <div class="smallGapline">
            <div class="name">{{ $t("imgsetting.mirror") }}</div>
            <select class="commonWith" v-model="mirror">
                <option value="0">{{ $t("common.none") }}</option>
                <option value="1">{{ $t("imgsetting.vertical") }}</option>
                <option value="2">{{ $t("imgsetting.horizontal") }}</option>
                <option value="3">{{ $t("imgsetting.verandhor") }}</option>
            </select>
          </div>
          <div class="smallGapline" v-if="showcorridor">
            <div class="name">{{ $t("imgsetting.corridor") }}</div>
            <select class="commonWith" v-model="rotate">
                <option value="0">{{ $t("common.disable") }}</option>
                <option value="1">{{ $t("common.enable") }}</option>
            </select>
          </div>
          <div style="font-size:13px;">{{ $t("imgsetting.imgprofile") }}</div>
          <div class="smallGapline">
            <div class="name">{{ $t("imgsetting.imgtemplate") }}</div>
            <select class="commonWith" v-model="curtemplate" @change="initimgScene">
                <option value="0">{{ $t("imgsetting.normal") }}</option>
                <option value="1">{{ $t("imgsetting.daymode") }}</option>
                <option value="2">{{ $t("imgsetting.nightmode") }}</option>
            </select>
          </div>
          <div>
            <div class="accordionTitle" @click="onAccordion(0)">
              <div class="accordionIcon" :class="{ itemOpen: accnum==0,itemClose: accnum!=0 }"></div>
              <div class="accordionText">{{ $t("imgsetting.imgadjust") }}</div>
            </div>
            <transition name="slide-fade">
            <div v-show="accnum==0">
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.imgmodel") }}</div>
                <select class="commonWith" v-model="imgstyle">
                  <option value="0">{{$t('imgsetting.normal')}}</option>
                  <option value="1">{{$t('imgsetting.bright')}}</option>
                  <option value="2">{{$t('imgsetting.colorful')}}</option>
                  <option value="3">{{$t('imgsetting.pastel')}}</option>
                  <option value="4">{{$t('imgsetting.custom')}}</option>
                </select>
              </div>
              <div v-show="imgstyle==='4'">
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.saturation") }}</div>
                  <a-slider style="width: 180px;" v-model="saturation"></a-slider>
                </div>
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.brightness") }}</div>
                  <a-slider style="width: 180px;" v-model="brightness"></a-slider>
                </div>
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.sharpness") }}</div>
                  <a-slider style="width: 180px;" v-model="sharpness"></a-slider>
                </div>
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.contrast") }}</div>
                  <a-slider style="width: 180px;" v-model="contrast"></a-slider>
                </div>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.blc") }}</div>
                <select class="commonWith" v-model="blc">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.hlc") }}</div>
                <select class="commonWith" v-model="hlc">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.wdr") }}</div>
                <select class="commonWith" v-model="wdr">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.wb") }}</div>
                <select class="commonWith" v-model="wbmode">
                  <option value="0">{{ $t("common.auto") }}</option>
                  <option value="1">{{ $t("imgsetting.outdoor") }}</option>
                  <option value="2">{{ $t("imgsetting.indoor") }}</option>
                  <option value="3">{{ $t("imgsetting.fluorescent") }}</option>
                  <option value="4">{{ $t("imgsetting.manual") }}</option>
                </select>
              </div>
              <div v-show="wbmode==='4'">
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.rgain") }}</div>
                  <a-slider style="width: 180px;" v-model="wbrgain"></a-slider>
                </div>
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.ggain") }}</div>
                  <a-slider style="width: 180px;" v-model="wbggain"></a-slider>
                </div>
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.bgain") }}</div>
                  <a-slider style="width: 180px;" v-model="wbbgain"></a-slider>
                </div>
              </div>
            </div>
            </transition>
          </div>
          <div>
            <div class="accordionTitle" @click="onAccordion(1)">
              <div class="accordionIcon" :class="{ itemOpen: accnum==1,itemClose: accnum!=1 }"></div>
              <div class="accordionText">{{ $t("imgsetting.expsettings") }}</div>
            </div>
            <transition name="slide-fade">
            <div v-show="accnum==1">
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.expmode") }}</div>
                <select class="commonWith" v-model="expmode">
                  <option value="0">{{$t('common.auto')}}</option>
                  <option value="1">{{$t('imgsetting.imgfixed')}}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.shutter") }}</div>
                <select class="commonWith" v-model="expshutter">
                  <option value="0">1/2</option>
                  <option value="1">1/4</option>
                  <option value="2">1/8</option>
                  <option value="3">1/10</option>
                  <option value="4">1/12</option>
                  <option value="5">1/15</option>
                  <option value="6">1/25(50Hz)1/30(60Hz)</option>
                  <option value="7">1/50(50Hz)1/60(60Hz)</option>
                  <option value="8">1/100(50Hz)1/120(60Hz)</option>
                  <option value="9">1/125</option>
                  <option value="10">1/200</option>
                  <option value="11">1/250</option>
                  <option value="12">1/500</option>
                  <option value="13">1/1000</option>
                </select>
              </div>
            </div>
            </transition>
          </div>
          <div>
            <div class="accordionTitle" @click="onAccordion(2)">
              <div class="accordionIcon" :class="{ itemOpen: accnum==2,itemClose: accnum!=2 }"></div>
              <div class="accordionText">{{ $t("imgsetting.imgenhancement") }}</div>
            </div>
            <transition name="slide-fade">
            <div v-show="accnum==2">
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.metering") }}</div>
                <select class="commonWith" v-model="metering">
                  <option value="0">{{$t('imgsetting.global')}}</option>
                  <option value="1">{{$t('imgsetting.middle')}}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.iris") }}</div>
                <select class="commonWith" v-model="iris">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.defog") }}</div>
                <select class="commonWith" v-model="defog">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div class="smallGapline">
                <div class="name">2D NR</div>
                <select class="commonWith" v-model="dnr2d">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
              <div v-show="dnr2d=='1'">
                <div class="smallGapline">
                  <div class="name">{{ $t("imgsetting.nr") }}</div>
                  <a-slider style="width: 180px;" v-model="noise"></a-slider>
                </div>
              </div>
              <div class="smallGapline">
                <div class="name">3D NR</div>
                <select class="commonWith" v-model="dnr3d">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
            </div>
            </transition>
          </div>
          <div>
            <div class="accordionTitle" @click="onAccordion(3)">
              <div class="accordionIcon" :class="{ itemOpen: accnum==3,itemClose: accnum!=3 }"></div>
              <div class="accordionText">{{ $t("imgsetting.imgadvance") }}</div>
            </div>
            <transition name="slide-fade">
            <div v-show="accnum==3">
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.ldc") }}</div>
                <a-slider style="width: 180px;" v-model="ldc"></a-slider>
              </div>
              <div class="smallGapline">
                <div class="name">{{ $t("imgsetting.smartir") }}</div>
                <select class="commonWith" v-model="smartir">
                  <option value="0">{{ $t("common.disable") }}</option>
                  <option value="1">{{ $t("common.enable") }}</option>
                </select>
              </div>
            </div>
            </transition>
          </div>
        </div>
        <div class="buttonGroup">
          <button class="commonBtn" @click="restore(0)">{{ $t("common.restore") }}</button>
          <button class="commonBtn" @click="getparam">{{ $t("common.refresh") }}</button>
          <button class="commonBtn" @click="saveparam(0)">{{ $t("common.save") }}</button>
        </div>
      </div>
    </div>
    <div class="tabContext" v-show="navnum==1">
      <div class="line">
        <div class="name">{{ $t("imgsetting.imgconf") }}</div>
        <select class="commonWith" v-model="workmode">
            <option value="0">{{ $t("imgsetting.normal") }}</option>
            <option value="1">{{ $t("imgsetting.daymode") }}</option>
            <option value="2">{{ $t("imgsetting.nightmode") }}</option>
            <option value="3">{{ $t("imgsetting.timing") }}</option>
            <option value="4">{{ $t("common.auto") }}</option>
        </select>
      </div>
      <div class="line" v-show="workmode==='3'">
        <div class="name">{{ $t("imgsetting.periodset") }}</div>
        <a-slider class="commonWith" :tip-formatter="formatter" range :min="0" :max="86400" v-model="daysect"></a-slider>
        <div class="timingNote">
          <div class="redCube"></div>
          <span>{{ $t("imgsetting.daymode") }}</span>
          <div class="greyCube"></div>
          <span>{{ $t("imgsetting.nightmode") }}</span>
        </div>
      </div>
      <div class="buttonGroup">
        <button class="commonBtn" @click="restore(1)">{{ $t("common.restore") }}</button>
        <button class="commonBtn" @click="getparam">{{ $t("common.refresh") }}</button>
        <button class="commonBtn" @click="saveparam(1)">{{ $t("common.save") }}</button>
      </div>
    </div>
    <div class="tabContext" v-show="navnum==2">
      <div class="line">
        <div class="name">{{ $t("imgsetting.daynightmod") }}</div>
        <select class="commonWith" v-model="dnmode">
            <option value="0">{{ $t("common.auto") }}</option>
            <option value="1">{{ $t("imgsetting.color") }}</option>
            <option value="2">{{ $t("imgsetting.bw") }}</option>
            <option value="3">{{ $t("imgsetting.timing") }}</option>
            <option value="4">{{ $t("imgsetting.intersync") }}</option>
        </select>
      </div>
      <div class="line" v-show="dnmode==='3'">
        <div class="name">{{ $t("imgsetting.periodset") }}</div>
        <a-slider class="commonWith" :tip-formatter="formatter" range :min="0" :max="86400" v-model="dndaysect"></a-slider>
        <div class="timingNote">
          <div class="redCube"></div>
          <span>{{ $t("imgsetting.color") }}</span>
          <div class="greyCube"></div>
          <span>{{ $t("imgsetting.bw") }}</span>
        </div>
      </div>
      <div v-show="dnmode==='4'">
        <div class="line">
          <div class="name">{{ $t("imgsetting.bwtocolor") }}</div>
          <a-slider class="commonWith" :min="1" :max="100" v-model="dncolor"></a-slider>
        </div>
        <div class="line">
          <div class="name">{{ $t("imgsetting.colortobw") }}</div>
          <a-slider class="commonWith" :min="0" :max="99" v-model="dngrey"></a-slider>
        </div>
      </div>
      <div class="line" v-if="showlight">
        <div class="name">{{ $t("imgsetting.supplementled") }}</div>
        <select class="commonWith" v-model="dnirled">
            <option value="0">{{ $t("common.auto") }}</option>
            <option value="1">{{ $t("common.opens") }}</option>
            <option value="2">{{ $t("common.closes") }}</option>
        </select>
      </div>
      <div class="line" v-if="showdblight">
        <div class="name">{{ $t("imgsetting.supplementled2") }}</div>
        <select class="commonWith" v-model="dnirled">
            <option value="0">{{ $t("imgsetting.smart") }}</option>
            <option value="1">{{ $t("imgsetting.infraredmode") }}</option>
            <option value="2">{{ $t("imgsetting.white") }}</option>
            <option value="3">{{ $t("imgsetting.turnoff") }}</option>
        </select>
      </div>
      <div v-show="showfullcolor && dnirled==0">
        <div class="line">
          <div class="name">{{ $t("imgsetting.ledlevel") }}</div>
          <a-slider class="commonWith" :min="0" :max="5" v-model="ledlevel"></a-slider>
        </div>
        <div class="accordionTitle">
          <div class="accordionIcon itemOpen"></div>
          <div class="accordionText">{{$t('imgsetting.blacklight')}}</div>
        </div>
        <div class="line">
          <div class="name">{{ $t("imgsetting.smartevt") }}</div>
          <select class="commonWith" v-model="smartevt">
              <option value="0">{{ $t("common.disable") }}</option>
              <option value="1">{{ $t("common.enable") }}</option>
          </select>
        </div>
        <div class="line">
          <div class="name">{{ $t("imgsetting.evtblink") }}</div>
          <select class="commonWith" v-model="evtblink">
              <option value="0">{{ $t("common.disable") }}</option>
              <option value="1">{{ $t("common.enable") }}</option>
          </select>
        </div>
      </div>
      <div class="line">
        <div class="name">{{ $t("imgsetting.ledonlevel") }}</div>
        <a-slider class="commonWith" v-model="ledonth"></a-slider>
      </div>
      <div class="line">
        <div class="name">{{ $t("imgsetting.ledofflevel") }}</div>
        <a-slider class="commonWith" v-model="ledoffth"></a-slider>
      </div>
      <div class="line">
        <div class="name">{{ $t("imgsetting.icut") }}</div>
        <a-slider class="commonWith" :tip-formatter="formatter" range :min="0" :max="86400" v-model="ircutsect"></a-slider>
        <div class="timingNote">
          <div class="redCube"></div>
          <span>{{ $t("common.auto") }}</span>
          <div class="greyCube"></div>
          <span>{{ $t("imgsetting.color") }}</span>
        </div>
      </div>
      <div class="buttonGroup">
        <button class="commonBtn" @click="restore(2)">{{ $t("common.restore") }}</button>
        <button class="commonBtn" @click="getparam">{{ $t("common.refresh") }}</button>
        <button class="commonBtn" @click="postdata">{{ $t("common.save") }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Slider } from "ant-design-vue";
export default {
  data() {
    return {
      navnum: 0,
      accnum: 0,
      T: null,
      bv:null,
      obj: null,
      isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
      showcorridor: true,
      showlight: true,
      showdblight: false,
      showfullcolor: false,
      freq: '0',
      rotate: '0',
      mirror: '0',
      workmode: '0',
      daysect: [21600,64800],
      dnmode: '0',
      dndaysect: [21600,64800],
      dncolor: 10,
      dngrey: 5,
      dnirled: '0',
      ledlevel: 5,
      smartevt: '0',
      evtblink: '0',
      ledonth: 50,
      ledoffth: 50,
      ircutsect: [0,86400],
      curtemplate: '0',
      imgstyle: '0',
      saturation: 50,
      sharpness: 50,
      contrast: 50,
      brightness: 50,
      noise: 50,
      ldc: 0,
      defog: '0',
      smartir: '0',
      dnr2d: '1',
      dnr3d: '1',
      blc: '0',
      hlc: '0',
      wdr: '0',
      wbmode: '0',
      wbrgain: 50,
      wbggain: 50,
      wbbgain: 50,
      expmode: '0',
      expshutter: '6',
      metering: '0',
      iris: '1',
      imagescene: [],
      ircutdata: {}
    };
  },
  components: {
    ASlider: Slider
  },
  mounted() {
    this.$getAPI("/action/get?subject=devability").then((res)=>{
      this.showcorridor = res.response.devability.porch>0 ? true:false;
      let irled = res.response.devability.irled;
      let fullcolor = res.response.devability.fullcolor;
      if (irled==1) {
        this.showlight = true;
        this.showdblight = false;
      } else if(irled==2){
        this.showlight = false;
        this.showdblight = true;
      } else {
        this.showlight = false;
        this.showdblight = false;
      }
      if(fullcolor==1 && irled==1){
        this.showfullcolor = true;
      }
    });
    this.getparam();
    if (this.isie) {
      this.initObject();
    } else {
      this.$getAPI("/action/get?subject=videoenc&stream=0").then((res)=>{
        if (res.response.videoenc.codec==1) {
          document.getElementById('h5Player').innerHTML = "<img id='imgVideo' src='/action/snap' style='width: 460px;height: 288px'/>";
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
              height: '288',
              width: '460'
          });
          if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
              return;
          }
          this.bv.on('ended',()=>{
              this.bv.src = '/action/stream?subject=flvlive&stream=0';
          })
        }
      });
    }
  },
  methods: {
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
        this.obj.UIMode = 3;
        this.obj.DeviceIp = document.location.hostname;
        this.obj.TcpPort = tcpport;
        this.obj.Play(username, password, 0);
      },0)
    },
    onShowItem(n) {
      this.navnum = n;
    },
    onAccordion(n){
      if(this.accnum != n){
        this.accnum = n;
      }
    },
    formatter(value) {
      let h = Math.floor(value / 3600);
      let m = Math.floor(value / 60) % 60;
      if(h < 10) {
        if(m < 10) {
          value = '0' + String(h) + ':0' + String(m);
        }else{
          value = '0' + String(h) + ':' + String(m);
        }
      }else{
        if(m < 10) {
          value = String(h) + ':0' + String(m);
        }else{
          value = String(h) + ':' + String(m);
        }
      }
      return value;
    },
    initimgScene(){
      let n = parseInt(this.curtemplate);
      this.imgstyle = this.imagescene[n].imgstyle;
      this.saturation = parseInt(this.imagescene[n].saturation);
      this.sharpness = parseInt(this.imagescene[n].sharpness);
      this.contrast = parseInt(this.imagescene[n].contrast);
      this.brightness = parseInt(this.imagescene[n].brightness);
      this.noise = parseInt(this.imagescene[n].noise);
      this.ldc = parseInt(this.imagescene[n].ldc);
      this.defog = this.imagescene[n].defog;
      this.smartir = this.imagescene[n].smartir;
      this.dnr2d = this.imagescene[n].dnr2d;
      this.dnr3d = this.imagescene[n].dnr3d;
      this.hlc = this.imagescene[n].widedynamic.highlight;
      this.wdr = this.imagescene[n].widedynamic.wdr;
      this.blc = this.imagescene[n].widedynamic.backlight;
      this.expmode = this.imagescene[n].autoexposure.mode;
      this.metering = this.imagescene[n].autoexposure.metter;
      this.expshutter = this.imagescene[n].autoexposure.shutter;
      this.iris = this.imagescene[n].autoexposure.iris;
      this.wbmode = this.imagescene[n].whitebalance.mode;
      this.wbrgain = parseInt(this.imagescene[n].whitebalance.rgain);
      this.wbggain = parseInt(this.imagescene[n].whitebalance.ggain);
      this.wbbgain = parseInt(this.imagescene[n].whitebalance.bgain);
    },
    restore(n) {
      if (n==0) {
        this.freq = '0';
        this.mirror = '0';
        this.rotate = '0';
        this.curtemplate = '0';
      } else if(n==1) {
        this.workmode = '0';
        this.daysect = [21600,64800];
      } else if(n==2){
        this.dnmode = '0';
        this.dnirled = '0';
        this.smartevt = '0';
        this.evtblink = '0';
        this.dndaysect = [21600,64800];
        this.dncolor = 10;
        this.dngrey = 5;
        this.ircutsect = [0,86400];
        this.ledonth = 50;
        this.ledoffth = 50;
      }
    },
    getparam() {
      this.$getAPI("/action/get?subject=cameraimage").then((res)=>{
        this.freq = res.response.cameraimage.freq;
        this.rotate = res.response.cameraimage.rotate;
        this.mirror = res.response.cameraimage.mirror;
        this.workmode = res.response.cameraimage.mode;
        let sectarr = res.response.cameraimage.daysect.split('-');
        this.daysect = [parseInt(sectarr[0]),parseInt(sectarr[1])];
        this.dnmode = res.response.cameraimage.daynight.mode;
        let sectarr1 = res.response.cameraimage.daynight.daysect.split('-');
        this.dndaysect = [parseInt(sectarr1[0]),parseInt(sectarr1[1])];
        this.dncolor = parseInt(res.response.cameraimage.daynight.color);
        this.dngrey = parseInt(res.response.cameraimage.daynight.grey);
        this.dnirled =  res.response.cameraimage.daynight.irled;
        this.ledlevel = parseInt(res.response.cameraimage.daynight.ledlevel);
        this.smartevt = res.response.cameraimage.daynight.smartevt;
        this.evtblink = res.response.cameraimage.daynight.evtblink;
        this.ledonth = parseInt(res.response.cameraimage.daynight.ledthreshonlevel);
        this.ledoffth = parseInt(res.response.cameraimage.daynight.ledthreshofflevel);
        this.imagescene = res.response.cameraimage.imagescene;
        this.curtemplate = '0';
        this.initimgScene();
      });
      this.$getAPI("/action/get?subject=ircut").then((res)=>{
        this.ircutdata = res.response.ircut;
        let autotime = res.response.ircut.autotime.split('-');
        this.ircutsect = [parseInt(autotime[0]),parseInt(autotime[1])];
      });
    },
    saveparam(i) {
      let daysectstr = this.daysect[0] + '-' + this.daysect[1];
      let dnsectstr = this.dndaysect[0] + '-' + this.dndaysect[1];
      if(i==0){
        let n = parseInt(this.curtemplate);
        this.imagescene[n].imgstyle = this.imgstyle;
        this.imagescene[n].saturation = this.saturation;
        this.imagescene[n].sharpness = this.sharpness;
        this.imagescene[n].contrast = this.contrast;
        this.imagescene[n].brightness = this.brightness;
        this.imagescene[n].noise = this.noise;
        this.imagescene[n].ldc = this.ldc;
        this.imagescene[n].defog = this.defog;
        this.imagescene[n].smartir = this.smartir;
        this.imagescene[n].dnr2d = this.dnr2d;
        this.imagescene[n].dnr3d = this.dnr3d;
        this.imagescene[n].widedynamic.highlight = this.hlc;
        this.imagescene[n].widedynamic.wdr = this.wdr;
        this.imagescene[n].widedynamic.backlight = this.blc;
        this.imagescene[n].autoexposure.mode = this.expmode;
        this.imagescene[n].autoexposure.metter = this.metering;
        this.imagescene[n].autoexposure.shutter = this.expshutter;
        this.imagescene[n].autoexposure.iris = this.iris;
        this.imagescene[n].whitebalance.mode = this.wbmode;
        this.imagescene[n].whitebalance.rgain=this.wbrgain;
        this.imagescene[n].whitebalance.ggain=this.wbggain;
        this.imagescene[n].whitebalance.bgain=this.wbbgain;
      }
      let object = {
        request: {
          cameraimage:{
            freq: this.freq,
            rotate: this.rotate,
            mirror: this.mirror,
            mode: this.workmode,
            daysect: daysectstr,
            imagescene: this.imagescene,
            daynight: {
              mode: this.dnmode,
              irled: this.dnirled,
              daysect: dnsectstr,
              color: this.dncolor,
              grey: this.dngrey,
              smartevt: this.smartevt,
              evtblink: this.evtblink,
              ledlevel: this.ledlevel,
              ledthreshonlevel: this.ledonth,
              ledthreshofflevel: this.ledoffth
            }
          }
        }
      };
      this.$postAPI("/action/set?subject=cameraimage", object, true);
    },
    postdata(){
      this.ircutdata.autotime = this.ircutsect[0] + '-' + this.ircutsect[1];
      this.$postAPI("/action/set?subject=ircut",{request: {ircut: this.ircutdata}}, true);
      this.saveparam(1);
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
};
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
.tabContext{
    width: 100%;
    height:auto;
    margin-top: 8px;
}
.box{
  float: left;
  width: 462px;
  height: 290px;
  border: 1px solid black;
}
.smallGapline{
  width: 420px;
  height: 28px;
  display: flex;
  align-items:center;
  font-size: 13px;
  .name {
    color: black;
    width: 145px;
    display: inline-block;
    padding-left: 20px;
  }
  .commonWith{
    width: 190px;
    height: 23px;
    outline: none;
  }
  .value {
    color: #7f7f7f;
    display: inline-block;
  }
}
.line{
  width: 100%;
  height: 28px;
  display: flex;
  align-items:center;
  font-size: 13px;
  .name {
    color: black;
    width: 205px;
    display: inline-block;
    padding-left: 10px;
  }
  .commonWith{
    width: 300px;
    outline: none;
    margin-left: 0;
  }
  .value {
    color: #7f7f7f;
    display: inline-block;
  }
  .timingNote{
    display:inline-block;
    display:flex;
    margin-left: 20px;
    .redCube{
      background-color: #bb131a;
      width:14px;
      height:14px;
      display:inline-block;
      margin:auto 10px;
    }
    .greyCube{
      background-color: #c4c4c4;
      width:14px;
      height:14px;
      display:inline-block;
      margin:auto 10px;
    }
  }
}
.accordionTitle{
  width: 420px;
  height: 27px;
  display: flex;
  align-items:center;
  cursor: pointer;
  .accordionIcon{
    width:20px;
    height:16px;
    display: inline-block;
  }
  .itemOpen{
    background: url("../assets/subimg/accordionopen.png") no-repeat;
  }
  .itemClose{
    background: url("../assets/subimg/accordionclose.png") no-repeat;
  }
  .accordionText{
    display: inline-block;
    font-size: 13px;
  }
}

.slide-fade-enter-active {
  transition: all .4s ease-out;
}
.slide-fade-enter{
  transform: translateY(-20px);
  opacity: 0;
}
</style>