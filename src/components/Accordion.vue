<template>
  <div>
    <a-collapse default-active-key="2" accordion :bordered="false">
      <a-collapse-panel key="1" :header="$t('preview.ptzcontrol')" :showArrow="false" v-if="showPtz">
        <div>
          <div class="direction">
            <span class="ptzBox" @mousedown="ptzView(3, 0, 0)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position:   0px   0px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(2, 0, 0)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position: -30px   0px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(3, 1, 0)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position: -60px   0px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(1, 0, 0)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position:   0px -30px"></i>
            </span>
            <span class="ptzBox" @click="PtzAjust">
              <i class="ptzButton" style="background-position: -30px -30px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(1, 1, 0)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position: -60px -30px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(3, 0, 1)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position:   0px -60px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(2, 0, 1)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position: -30px -60px"></i>
            </span>
            <span class="ptzBox" @mousedown="ptzView(3, 1, 1)" @mouseup="ptzView(0, 0, 0)">
              <i class="ptzButton" style="background-position: -60px -60px"></i>
            </span>
          </div>
          <div class="extend">
            <span :title="$t('preview.zoomsub')"  class="ptzBox" @mousedown="PtzZoomOut" @mouseup="PtzStop">
              <i class="ptzXButton" style="background-position:   0px   0px"></i>
            </span>
            <span :title="$t('preview.zoomadd')"  class="ptzBox" @mousedown="PtzZoomIn" @mouseup="PtzStop">
              <i class="ptzXButton" style="background-position: -30px   0px"></i>
            </span>
            <span :title="$t('preview.focussub')" class="ptzBox" @mousedown="PtzFocusNear" @mouseup="PtzStop">
              <i class="ptzXButton" style="background-position:   0px -30px"></i>
            </span>
            <span :title="$t('preview.focusadd')" class="ptzBox" @mousedown="PtzFocusFar" @mouseup="PtzStop">
              <i class="ptzXButton" style="background-position: -30px -30px"></i>
            </span>
            <span :title="$t('preview.irissub')"  class="ptzBox">
              <i class="ptzXButton" style="background-position:   0px -60px"></i>
            </span>
            <span :title="$t('preview.irisadd')"  class="ptzBox">
              <i class="ptzXButton" style="background-position: -30px -60px"></i>
            </span>
          </div>
          <div class="sliderItem" :title="$t('preview.ptzspeed')">
            <img class="imgIcon" src="../assets/img/speed.png" />
            <a-slider class="slider" :tooltipVisible="false" v-model="ptzspeed" :max="6" :min="1" @change="setSpeed"></a-slider>
            <div class="sliderValue">{{ptzspeed}}</div>
          </div>
          <div style="margin-top:15px;">
            <div id="div_list_header">
              <div class="headItem" :class="{'headItemActive':showItem==1}" :title="$t('preview.preset')" @click="switchItem(1)">
                <img src="../assets/img/preset.png"/>
              </div>
              <div class="headItem" :class="{'headItemActive':showItem==2}" :title="$t('preview.cruise')" @click="switchItem(2)">
                <img src="../assets/img/cruise.png"/>
              </div>
              <div class="headItem" :class="{'headItemActive':showItem==3}" :title="$t('preview.linearscan')" @click="switchItem(3)">
                <img src="../assets/img/alternate.png"/>
              </div>
              <div class="headItem" :class="{'headItemActive':showItem==4}" :title="$t('preview.pattern')" @click="switchItem(4)">
                <img src="../assets/img/path.png"/>
              </div>
            </div>
            <div v-show="showItem==1">
              <div style="width: 100%;border: 1px solid #8f8f8f;overflow-y: auto;height: 480px;">
                <div v-for="count in 128" :key="count.id" @click="onSelected(count)" class="presetItem" :class="{'presetItemAct':count==bcount}">
                  <span style="display: inline-block;width:30px;padding-left:5px;">{{count >= 100 ? count : (count >= 10 ? '0'+count : '00'+count)}}</span>
                  <span style="display: inline-block;width:92px;text-align:center;" v-show="count!=aCount">{{ pname[count-1] == '' ? $t('preview.preset') + count : pname[count-1] }}</span>
                  <input v-show="count==aCount" style="width:92px;height:25px;color:#000;" :value="pname[count-1] == '' ? $t('preview.preset') + count : pname[count-1]" @blur="setPresetName" maxlength="7">
                  <span>{{ pname[count-1] == '' ? $t('preview.unset') : $t('preview.inset')}}</span>
                </div>
              </div>
              <div style="width:100%;heigth:32px;border:1px solid #8f8f8f;margin-top:3px;">
                <div class="presetButtonbox" @click="onCall" :title="$t('preview.calltag')">
                  <i class="presetButton" style="background-position: 0px 0px"></i>
                </div>
                <div class="presetButtonbox" @click="onEdit" :title="$t('preview.edittag')">
                  <i class="presetButton" style="background-position: -16px 0px"></i>
                </div>
                <div class="presetButtonbox" @click="onDelete" :title="$t('preview.deletetag')">
                  <i class="presetButton" style="background-position: -32px 0px"></i>
                </div>
              </div>
            </div>
            <div id="div_cruise_content" v-show="showItem==2">
              <span>{{$t('preview.cruise')}}</span>
              <select v-model="cruiseIndex" style="width: 94px;float:right;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <div id="div_cruise_point" style="width: 100%;height: 260px;border: 1px solid #8f8f8f;overflow-y: auto;margin-top:4px;"></div>
              <div style="width:100%;heigth:32px;border:1px solid #8f8f8f;margin-top:3px;">
                <div class="presetButtonbox" :title="$t('preview.calltag')">
                  <i class="presetButton" style="background-position:  0px 0px"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.deletetag')">
                  <i class="presetButton" style="background-position: -32px 0px"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.stoptag')">
                  <i class="presetButton" style="background-position: -48px 0px"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.addpoint')">
                  <i class="presetButton" style="background-position: -64px 0px"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.deletepoint')">
                  <i class="presetButton" style="background-position: -80px 0px"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.mvdown')">
                  <i class="presetButton" style="background-position: -112px 0px"></i>
                </div>
              </div>
            </div>
            <div id="div_cruise_point_add" v-show="showItem==3">
              <div style="width:100%;heigth:32px;border:1px solid #8f8f8f;margin-top:3px;">
                <div class="presetButtonbox" :title="$t('preview.startscan')">
                  <i class="startposIcon"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.stopscan')">
                  <i class="endposIcon"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.calltag')">
                  <i class="presetButton" style="background-position:   0px 0px;"></i>
                </div>
                <div class="presetButtonbox" :title="$t('preview.stoptag')">
                  <i class="presetButton" style="background-position: -48px 0px"></i>
                </div>
              </div>
            </div>
            <div id="div_trackpath_contect" v-show="showItem==4">
              <div style="width:100%;heigth:32px;border:1px solid #8f8f8f;margin-top:3px;">
                <span>{{$t('preview.pattern')}}</span>
                <select v-model="trackpathIndex" style="width: 94px;float:right;">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <div style="margin-top:10px;">
                  <div class="presetButtonbox" :title="$t('preview.startpattern')">
                    <i class="startposIcon"></i>
                  </div>
                  <div class="presetButtonbox" :title="$t('preview.stoppattern')">
                    <i class="endposIcon"></i>
                  </div>
                  <div class="presetButtonbox" :title="$t('preview.calltag')">
                    <i class="presetButton" style="background-position:   0px 0px;"></i>
                  </div>
                  <div class="presetButtonbox" :title="$t('preview.stoptag')">
                    <i class="presetButton" style="background-position: -48px 0px;"></i>
                  </div>
                  <div class="presetButtonbox" :title="$t('preview.deletetag')">
                    <i class="presetButton" style="background-position: -32px 0px"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" :header="$t('preview.imageset')" :showArrow="false">
        <div>
          <div class="imgMode">{{$t('imgsetting.imgmodel')}}</div>
          <select v-model="style" style="width: 100%;" @change="onChangeStyle">
            <option value="0">{{$t('imgsetting.normal')}}</option>
            <option value="1">{{$t('imgsetting.bright')}}</option>
            <option value="2">{{$t('imgsetting.colorful')}}</option>
            <option value="3">{{$t('imgsetting.pastel')}}</option>
            <option value="4">{{$t('imgsetting.custom')}}</option>
          </select>
        </div>
        <div>
          <div class="imgSetting">{{$t('imgsetting.display')}}</div>
          <div class="sliderItem" :title="$t('imgsetting.saturation')">
            <img class="imgIcon" src="../assets/img/saturation.png" />
            <a-slider class="slider" :tooltipVisible="false" v-model="saturation" :disabled="disabledSider" @afterChange="postVideoimage(1)"></a-slider>
            <div class="sliderValue">{{saturation}}</div>
          </div>
          <div class="sliderItem" :title="$t('imgsetting.brightness')">
            <img class="imgIcon" src="../assets/img/brightness.png" />
            <a-slider class="slider" :tooltipVisible="false" v-model="brightness" :disabled="disabledSider" @afterChange="postVideoimage(2)"></a-slider>
            <div class="sliderValue">{{brightness}}</div>
          </div>
          <div class="sliderItem" :title="$t('imgsetting.sharpness')">
            <img class="imgIcon" src="../assets/img/sharpness.png" />
            <a-slider class="slider" :tooltipVisible="false" v-model="sharpness" :disabled="disabledSider" @afterChange="postVideoimage(3)"></a-slider>
            <div class="sliderValue">{{sharpness}}</div>
          </div>
          <div class="sliderItem" :title="$t('imgsetting.contrast')">
            <img class="imgIcon" src="../assets/img/contrast.png" />
            <a-slider class="slider" :tooltipVisible="false" v-model="contrast" :disabled="disabledSider" @afterChange="postVideoimage(4)"></a-slider>
            <div class="sliderValue">{{contrast}}</div>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3" :header="$t('preview.fisheye')" :showArrow="false" v-if="showFisheye">
        <div class="fisheyeInstall">{{$t('preview.install')}}</div>
        <div style="width: 100%;height: 50px">
          <div class="boxButton" :class="{'boxButtonActive':activeInstall==1}" @click="onCell">
            <img class="imgIcon" src="../assets/img/celloff.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':activeInstall==0}" @click="onDesktop">
            <img class="imgIcon" src="../assets/img/tableoff.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':activeInstall==2}" @click="onWall">
            <img class="imgIcon" src="../assets/img/walloff.png" />
          </div>
        </div>
        <div class="displaymode">{{$t('preview.displaymode')}}</div>
        <div style="width: 100%;height: 150px">
          <div class="boxButton" :class="{'boxButtonActive':view==2}" @click="onDisplayMode(2)">
            <img class="imgIcon" src="../assets/img/fouroff.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':view==5}" v-show="show180" @click="onDisplayMode(5)">
            <img class="imgIcon" src="../assets/img/180off.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':view==1}" v-show="show360" @click="onDisplayMode(1)">
            <img class="imgIcon" src="../assets/img/360off.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':view==0}" @click="onDisplayMode(0)">
            <img class="imgIcon" src="../assets/img/originoff.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':view==3}" v-show="showSplit" @click="onDisplayMode(3)">
            <img class="imgIcon" src="../assets/img/splitoff.png" />
          </div>
          <div class="boxButton" :class="{'boxButtonActive':view==4}" @click="onDisplayMode(4)">
            <img class="imgIcon" src="../assets/img/wsplitoff.png" />
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import { Collapse, Slider } from "ant-design-vue";
export default {
  data() {
    return {
      showPtz: false,
      showFisheye:false,
      videoImage: {},
      style: 0,
      saturation: 50,
      brightness: 50,
      sharpness: 50,
      contrast: 50,
      disabledSider: true,
      fisheyeCount: 0,
      install: 0,
      activeInstall: 0,
      view: 0,
      show180: false,
      show360:false,
      showSplit:false,
      ptzspeed: 1,
      showItem: 1,
      pname: [],
      aCount: 0,
      bcount: 0,
      cruiseIndex: '1',
      trackpathIndex: '1'
    };
  },
  components: {
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    ASlider: Slider,
  },
  mounted(){
    for(let i = 0 ; i < 128; i++){
      this.pname.push('')
    }
    this.$getAPI('/action/get?subject=devability').then((res)=>{
      let ptz = res.response.devability.ptz;
      let fisheye = res.response.devability.fisheye;
      if(ptz == 1){
        this.showPtz = true;
        this.getPtzParam();
      }else{
        this.showPtz = false;
      }
      if (fisheye > 0) {
        this.showFisheye = true;
        if (fisheye & 1) {
            this.fisheyeCount += 1;
            this.install = 1;
        }
        if (fisheye & 1 << 1) {
            this.fisheyeCount += 1;
            this.install = 0;
        }
        if (fisheye & 1 << 2) {
            this.fisheyeCount += 1;
            this.install = 2;
        }
      } else {
        this.showFisheye = false;
      }
    });
    this.$getAPI('/action/get?subject=videoimage').then((res)=>{
      this.videoImage = res.response.videoimage;
      this.style = res.response.videoimage.imgstyle;
      this.saturation = res.response.videoimage.saturation;
      this.brightness = res.response.videoimage.brightness;
      this.sharpness = res.response.videoimage.sharpness;
      this.contrast = res.response.videoimage.contrast;
      if (this.style==4) {
        this.disabledSider = false;
      } else {
        this.disabledSider = true;
      }
    });
    this.$getAPI('/action/get?subject=fisheye').then((res)=>{
      let ins = res.response.fisheye.install;
      this.view = res.response.fisheye.view;
      if(this.fisheyeCount !== 3){
        ins = this.install;
      }
      this.initFisheye(ins);
    }).catch((err)=>{
      console.log(err)
    })
  },
  methods:{
    onChangeStyle(){
      if(this.style == 4){
        this.disabledSider = false;
      }else if(this.style == 0){
        this.disabledSider= true;
        this.saturation = 50;
        this.brightness = 50;
        this.sharpness = 50;
        this.contrast = 50;
      }else if (this.style == 1) {
        this.disabledSider= true;
        this.saturation = 50;
        this.brightness = 85;
        this.sharpness = 60;
        this.contrast = 50;
      } else if (this.style == 2) {
        this.disabledSider= true;
        this.saturation = 80;
        this.brightness = 67;
        this.sharpness = 60;
        this.contrast = 60;
      } else if (this.style == 3) {
        this.disabledSider= true;
        this.saturation = 48;
        this.brightness = 60;
        this.sharpness = 35;
        this.contrast = 50;
      }
      this.postVideoimage(0);
    },
    postVideoimage(n){
      if (n==1) {
        this.videoImage.saturation = this.saturation;
      } else if (n==2) {
        this.videoImage.brightness = this.brightness;
      } else if (n==3) {
        this.videoImage.sharpness = this.sharpness;
      } else if (n==4) {
        this.videoImage.contrast = this.contrast;
      } else if(n==0){
        this.videoImage.imgstyle = this.style;
        this.videoImage.saturation = this.saturation;
        this.videoImage.brightness = this.brightness;
        this.videoImage.sharpness = this.sharpness;
        this.videoImage.contrast = this.contrast;
      }
      let object = {request:{videoimage:this.videoImage}};
      this.$postAPI('/action/set?subject=videoimage',object,false);
    },
    switchItem(n){
      this.showItem = n;
    },
    initFisheye(install){
      if(install == 1){
        this.activeInstall = 1;
        this.show180 = true;
        this.show360 = true;
        this.showSplit = true;
      }else if (install == 0) {
        this.activeInstall = 0;
        this.show180 = true;
        this.show360 = false;
        this.showSplit = true;
      } else if(install == 2){
        this.activeInstall = 2;
        this.show180 = false;
        this.show360 = true;
        this.showSplit = false;
      }
    },
    onCell(){
      this.activeInstall = 1;
      if(this.fisheyeCount == 3){
        this.show180 = true;
        this.show360 = true;
        this.showSplit = true;
        this.install = 1;
      }
    },
    onDesktop(){
      this.activeInstall = 0;
      if(this.fisheyeCount == 3){
        this.show180 = true;
        this.show360 = false;
        this.showSplit = true;
        this.install = 2;
      }
    },
    onWall(){
      this.activeInstall = 2;
      if(this.fisheyeCount == 3){
        this.show180 = false;
        this.show360 = true;
        this.showSplit = false;
        this.install = 3;
      }
    },
    callFisheye(i,v){
      let object = {
        request:{
          fisheye:{
            install: i,
            view: v
          }
        }
      };
      this.$postAPI('/action/set?subject=fisheye',object,false);
    },
    onDisplayMode(n){
      if (n==0) {
        this.view = 0;
        this.callFisheye( this.install, 0);
      } else if (n==1) {
        this.view = 1;
        this.callFisheye( this.install, 1);
      } else if (n==2) {
        this.view = 2;
        if (this.install == 1 || this.install == 2) {
          this.callFisheye( this.install, 2);
        } else {
          this.callFisheye( this.install, 1);
        }
      } else if (n==3) {
        this.view = 3;
        if (this.install == 1 || this.install == 2) {
          this.callFisheye( this.install, 3);
        } else {
          this.callFisheye( this.install, 2);
        }
      } else if (n==4) {
        this.view = 4;
        if (this.install == 0 || this.install == 2) {
          this.callFisheye( this.install, 3);
        } else {
          this.callFisheye( this.install, 4);
        }
      } else if (n==5) {
        this.view = 5;
        if (this.install == 0) {
          this.callFisheye( this.install, 4);
        } else if(this.install == 1){
          this.callFisheye( this.install, 5);
        }
      }
    },
    getPtzParam(){
      this.$getAPI('/action/get?subject=ptz').then((res)=>{
        this.ptzspeed = parseInt(res.response.ptz.speed) + 1;
        this.pname = res.response.ptz.preset.pname;
      })
    },
    setSpeed(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptz ver="2.0"><speed>' + (this.ptzspeed-1) + '</speed></ptz></request>';
      this.$post("/action/set?subject=ptz", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    onSelected(count){
      this.bcount = count;
    },
    onCall(){
      if(this.bcount == 0){
        return;
      }
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>4097</cmd><preset><index>' + this.bcount + '</index></preset></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    onEdit(){
      this.aCount = this.bcount;
    },
    onDelete(){
      if(this.bcount == 0){
        return;
      }
      this.pname[this.bcount-1] = '';
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>4099</cmd><preset><index>' + this.bcount + '</index></preset></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    setPresetName(e){
      this.pname[this.bcount-1] = e.target.value;
      this.aCount = 0;
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>4098</cmd><preset><index>' + this.bcount + '</index><name>' + e.target.value + '</name></preset></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzAjust(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><protocol>0</protocol><cmd>20000001</cmd><addr>1</addr></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzZoomOut(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>8</cmd><addr>1</addr><zoom>0/zoom></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzZoomIn(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>8</cmd><addr>1</addr><zoom>1/zoom></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzFocusNear(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>4</cmd><addr>1</addr><focus>1/focus></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzFocusFar(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>4</cmd><addr>1</addr><focus>0</focus></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    PtzStop(){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><protocol>0</protocol><cmd>0</cmd><addr>1</addr></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    },
    ptzView(cmd, hori, vert){
      let xml = '<?xml version="1.0" encoding="utf-8"?><request><ptzcmd><cmd>' + cmd + '</cmd><move><hori>' + hori + '</hori><vert>' + vert + '</vert></move></ptzcmd></request>';
      this.$post("/action/ptz?subject=ctrl", xml).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    }
  }
};
</script>
<style lang="scss" scoped>
.direction{
  margin-top: 10px;
  width:113px;
  height: 113px;
  display: inline-block;
}
.extend{
  margin-top: 10px;
  width:75px;
  height: 113px;
  display: inline-block;
}
.ptzBox {
  margin-right: 3px;
  width: 34px;
  height: 34px;
  display: inline-block;
  border: 2px solid #03547c;
  border-radius: 3px;
  .ptzButton {
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: inline-block;
    background: url("../assets/img/ptzallbtns.png");
  }
  .ptzXButton {
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: inline-block;
    background: url("../assets/img/ptzbtnextend.png");
  }
}
.ptzBox:hover {
  border: 2px solid #bb131a;
}
.headItem{
  height:25px;
  width:47px;
  display: inline-block;
  border: 1px solid #8f8f8f;
  cursor: pointer;
  img{
    margin-left:14px;
  }
}
.headItem:hover{
  background: #bb131a;
}
.headItemActive{
  background: #bb131a;
}
.presetButton{
  width: 16px;
  height: 16px;
  margin: 3px;
  display: inline-block;
  background: url("../assets/img/presetctrl.png");
}
.startposIcon{
  width: 16px;
  height: 16px;
  margin: 3px;
  display: inline-block;
  background: url("../assets/img/startpos.png");
}
.endposIcon{
  width: 16px;
  height: 16px;
  margin: 3px;
  display: inline-block;
  background: url("../assets/img/endpos.png");
}
.presetButtonbox:hover{
  border: 2px solid #bb131a;
}
.presetButtonbox{
  display: inline-block;
  width: 26px;
  height: 26px;
  margin: 2px;
  border: 2px solid transparent;
  cursor: pointer;
}
.presetItem{
  height:25px;
  line-height:25px;
  font-size:12px;
}
.presetItem:hover{
  background-color: #bb131a;
  color: #fff;
}
.presetItemAct{
  background-color: #bb131a;
  color: #fff;
}
.imgMode,
.imgSetting,
.fisheyeInstall,
.displaymode {
  padding: 8px 0;
  font-size: 12px;
}
.sliderItem {
  width: 100%;
  height: 42px;
  line-height: 42px;
  .imgIcon {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
  .slider {
    display: inline-block;
    width: 120px;
    margin: 0;
    padding-top: 8px;
  }
  .sliderValue {
    display: inline-block;
    padding-left: 14px;
    font-size: 12px;
  }
}
.boxButton {
  width: 42px;
  height: 42px;
  display: inline-block;
  margin: 8px 0 0 8px;
  border: 2px solid #03547c;
  border-radius: 5px;
  cursor: pointer;
  .imgIcon {
    width: 18px;
    height: 18px;
    margin: 10px;
  }
}
.boxButton:hover {
  border: 2px solid #bb131a;
}
.boxButtonActive{
  border: 2px solid #bb131a;
}
</style>