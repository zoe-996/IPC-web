<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('general.regular')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('general.devname')}}</div>
      <a-input v-model="deviceName" size="small" style="width:250px;"></a-input>
    </div>
    <div class="lineSpacing" v-if="ptzSupport">
      <div class="textWidth">{{$t('general.aflenschk')}}</div>
      <a-select default-value="0" size="small" style="width:250px;" v-model="enable">
        <a-select-option value="0">{{$t('common.disable')}}</a-select-option>
        <a-select-option value="1">{{$t('common.enable')}}</a-select-option>
      </a-select>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
    <div v-if="p2pSupport">
      <div class="commonTitle">{{$t('general.qrcode')}}</div>
      <div class="lineSpacing">
        <div style="padding-left: 0.3rem;">{{$t('common.enable')}}</div>
        <a-select default-value="0" size="small" style="width:88px;margin:0 10px 0 40px;">
          <a-select-option value="0">{{$t('common.enable')}}</a-select-option>
          <a-select-option value="1">{{$t('common.disable')}}</a-select-option>
        </a-select>
        <div style="color: #1baafb;">{{$t('general.notep2pcode')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Input, Select } from "ant-design-vue";
export default {
  data() {
    return {
      deviceName: "",
      ptzSupport: false,
      p2pSupport: false,
      enable:"0"
    };
  },
  components: {
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  mounted() {
    this.getparam();
  },
  methods:{
    async getparam(){
      let resultDevpara = await this.$getAPI("/action/get?subject=devpara");
      this.deviceName = resultDevpara.response.devpara.name;
      let resultDevability = await this.$getAPI("/action/get?subject=devability");
      if(resultDevability.response.devability.ptz & 3){
        this.ptzSupport = true
      }
      this.enable = resultDevability.response.devability.refocus;
    },
    saveparam(){
      let object = {
        request:{
          devpara:{
            name:this.deviceName
          }
        }
      };
      this.$postAPI("/action/set?subject=devpara",object,true);
      if(this.ptzSupport){
        this.$postAPI("/action/set?subject=ptz",{request:{ptz:{refocus:this.enable}}},true);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/style/common.scss';
</style>