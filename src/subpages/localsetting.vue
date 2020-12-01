<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.localsetting')}}</div>
    <div style="color: red;font-size:12px;margin-top:10px;" v-if="!isie">{{$t('localsetting.supportinie')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('localsetting.liverecord')}}</div>
      <input class="commonWidth" v-model="recordpath" disabled/>
      <button class="commonBtn" @click="selectRpath" :disabled="!isie">{{$t('upgrade.browse')}}</button>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('localsetting.livesnapshot')}}</div>
      <input class="commonWidth" v-model="snappath" disabled/>
      <button class="commonBtn" @click="selectSpath" :disabled="!isie">{{$t('upgrade.browse')}}</button>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('localsetting.picturetype')}}</div>
      <a-radio-group name="radioGroup" v-model="snaptype" :disabled="!isie">
        <a-radio value="1">BMP</a-radio>
        <a-radio value="2">JPG</a-radio>
      </a-radio-group>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore" :disabled="!isie">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="saveparam" :disabled="!isie">{{$t('common.save')}}</button>
    </div>
    <div id="ipcocx" style="display: none;">
      <object id="activex" classid="clsid:FEB29125-2FEA-403E-985B-8E4930ABBA56" width="1" height="1" align='center'></object>
    </div>
  </div>
</template>
<script>
import { Radio, message } from "ant-design-vue";
export default {
  data() {
    return {
      isie:(!!window.ActiveXObject) || ("ActiveXObject" in window),
      obj: null,
      recordpath: "",
      snappath: "",
      snaptype: "2"
    };
  },
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group
  },
  mounted() {
    if (this.isie) {
      this.init()
    }
  },
  methods: {
    init(){
      var _obj = document.getElementById("ipcocx");
      var scriptStr = document.createElement('script');
      scriptStr.setAttribute('for', 'activex');
      scriptStr.event = 'OnLoad';
      _obj.appendChild(scriptStr);
      setTimeout(()=>{
        this.obj = document.getElementById('activex');
        this.recordpath = this.obj.GetRecordPath();
        this.snappath = this.obj.GetSnapshotPath();
        this.snaptype = String(this.obj.GetSnapshotType());
      },0)
    },
    selectRpath(){
      let path = this.obj.GetSelectFolder();
      if(path.length > 0){
        this.recordpath = path;
      }
    },
    selectSpath(){
      let path = this.obj.GetSelectFolder();
      if(path.length > 0){
        this.snappath = path;
      }
    },
    restore() {
      this.recordpath = "C:\\Users\\Public\\Pictures";
      this.snappath = "C:\\Users\\Public\\Videos";
      this.snaptype = "2";
    },
    saveparam() {
      if(this.recordpath==null || this.snappath==null){
        message.error(this.$t('common.errinput'));
        return;
      }
      let ret = this.obj.SetLocalParamenters(this.recordpath,this.snappath,parseInt(this.snaptype));
      if (ret==0) {
        message.success(this.$t('tip.infosave'));
      } else {
        message.error(this.$t('tip.errset'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 200px;
  height: 25px;
  margin-right:10px;
  font-size: 12px;
}
</style>