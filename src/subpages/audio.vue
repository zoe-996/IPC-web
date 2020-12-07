<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.audio')}}</div>
    <div style="color: red;font-size:12px;margin-top:10px;" v-if="ain">{{$t('tip.notesupport')}}</div>
    <div style="margin:8px 0 0 5px;">
      <input id="enaudio" type="checkbox" :checked="enable" @change="onChange" :disabled="ain">
      <label for="enaudio">{{$t("common.enable")}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('audio.codec')}}</div>
      <select v-model="curcodec" class="commonWidth" :disabled="!enable || ain" @change="selectCodec">
        <option v-for="(name,val) in codecs" :key="val" :value="val">{{name}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('audio.sample')}}</div>
      <select v-model="sample" class="commonWidth" :disabled="!enable || ain">
        <option v-for="(item,index) in samplearr" :key="index">{{item}}</option>
      </select>
    </div>
    <div class="lineSpacing" v-show="curcodec==='2'">
      <div class="textWidth">{{$t('audio.bitrates')}}</div>
      <select v-model="bitrate" class="commonWidth" :disabled="!enable || ain">
        <option v-for="(i,d) in bitratearr" :key="d">{{i}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('audio.audioin')}}</div>
      <select v-model="audioinput" class="commonWidth" :disabled="!enable || ain || isauto">
        <option value="0">{{$t('audio.linein')}}</option>
        <option value="1">{{$t('audio.micin')}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('audio.inputvol')}}</div>
      <a-slider class="slider" v-model="inputvol" :disabled="!enable || ain"></a-slider>
      <div class="lableStyle">{{inputvol}}</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('audio.outputvol')}}</div>
      <a-slider class="slider" v-model="outputvol" :disabled="!enable ||ain"></a-slider>
      <div class="lableStyle">{{outputvol}}</div>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore" :disabled="ain">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam" :disabled="ain">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam" :disabled="ain">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { Slider } from "ant-design-vue";
export default {
  data() {
    return {
      ain : false,
      enable: true,
      isauto: false,
      codecs: {},
      samplearr: [],
      bitratearr: [],
      curcodec: '',
      sample: '',
      bitrate: '',
      audioinput: '1',
      inputvol: 80,
      outputvol: 80,
      oldbitrate: ''
    };
  },
  components: {
    ASlider: Slider
  },
  mounted() {
    this.$getAPI("/action/get?subject=devability").then(res=>{
      this.isauto = res.response.devability.aimode == 1 ? true:false;
      if (parseInt(res.response.devability.ain) > 0) {
        this.ain = false;
        this.getparam();
      } else {
        this.ain = true;
      }
    });
  },
  methods: {
    restore() {
      this.enable = true;
      this.audioinput = "1";
      this.inputvol = 80;
      this.outputvol = 80;
      this.curcodec = Object.keys(this.codecs).sort()[0];
      this.sample = this.samplearr[0];
      this.bitrate = this.bitratearr[0];
    },
    getparam() {
      this.$getAPI("/action/get?subject=audioencability").then(res=>{
        this.codecs = {};
        this.samplearr = [];
        if(res.response.audioencability.g711u != undefined){
          this.codecs = {...this.codecs,'0':'G711U'};
          let option = res.response.audioencability.g711u.option;
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
        }
        if(res.response.audioencability.g711a != undefined){
          this.codecs = {...this.codecs,'1':'G711A'};
          let option = res.response.audioencability.g711a.option;
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
        }
        if(res.response.audioencability.aac != undefined){
          this.codecs = {...this.codecs,'2':'AAC'};
          let option = res.response.audioencability.aac.option;
          option = (option instanceof Array) ? option : [option];
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
          let arr = option[0].bitrate;
          this.bitratearr = (arr instanceof Array) ? arr : [arr];
        }
        if(res.response.audioencability.mp2 != undefined){
          this.codecs = {...this.codecs,'3':'MP2'};
          let option = res.response.audioencability.mp2.option;
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
        }
        if(res.response.audioencability.pcm != undefined){
          this.codecs = {...this.codecs,'4':'PCM'};
          let option = res.response.audioencability.pcm.option;
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
        }
        if(res.response.audioencability.g726 != undefined){
          this.codecs = {...this.codecs,'5':'G726'};
          let option = res.response.audioencability.g726.option;
          for(let i=0;i<option.length;i++){
            this.samplearr.push(option[i].sample);
          }
        }
        this.samplearr = Array.from(new Set(this.samplearr));
      });
      this.$getAPI("/action/get?subject=audiovolume").then(res=>{
        this.inputvol = parseInt(res.response.audiovolume.input);
        this.outputvol = parseInt(res.response.audiovolume.output);
      });
      this.$getAPI("/action/get?subject=audioenc").then(res=>{
        this.enable = res.response.audioenc.active == 1 ? true:false;
        this.sample = res.response.audioenc.sample;
        this.curcodec = res.response.audioenc.codec;
        this.audioinput = res.response.audioenc.input;
        this.bitrate = res.response.audioenc.bitrate;
        this.oldbitrate = res.response.audioenc.bitrate
      });
    },
    saveparam() {
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          audioenc: {
            active: active,
            codec: this.curcodec,
            sample: this.sample,
            bitrate: this.bitrate,
            input: this.audioinput
          }
        },
      };
      this.$postAPI("/action/set?subject=audioenc", object, true);
      this.$postAPI("/action/set?subject=audiovolume",{request:{audiovolume:{input: this.inputvol,output: this.outputvol}}}, true);
    },
    onChange(){
      this.enable = !this.enable;
    },
    selectCodec(){
      if (this.curcodec==='2') {
        this.bitrate = this.bitratearr[0];
      }else{
        this.bitrate = this.oldbitrate;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 216px;
}
.slider{
  width: 200px;
  display: inline-block;
  margin: 0 6px;
}
</style>