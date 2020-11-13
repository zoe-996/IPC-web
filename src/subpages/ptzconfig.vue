<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.ptzconfigt')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.protocol')}}</div>
      <select v-model="protocol" class="commonWidth">
        <option value="1">PELCO_D</option>
        <option value="2">PELCO_P</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.addressmask')}}</div>
      <a-input-number v-model="addrmask" size="small" :min="1" :max="255" class="commonWidth"></a-input-number>
      <div class="lableStyle">[1-255]</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.baudrate')}}</div>
      <select v-model="btrate" class="commonWidth">
        <option value="2400">2400</option>
        <option value="4800">4800</option>
        <option value="9600">9600</option>
        <option value="57600">57600</option>
        <option value="19200">19200</option>
        <option value="115200">115200</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.databits')}}</div>
      <select v-model="databit" class="commonWidth">
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.stopbits')}}</div>
      <select v-model="stopbit" class="commonWidth">
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.verifys')}}</div>
      <select v-model="verify" class="commonWidth">
        <option value="0">{{$t('common.none')}}</option>
        <option value="1">{{$t('ptzcfg.oddcheck')}}</option>
        <option value="2">{{$t('ptzcfg.evencheck')}}</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.datacontrol')}}</div>
      <select v-model="datactl" class="commonWidth">
        <option value="0">{{$t('common.disable')}}</option>
        <option value="1">{{$t('common.enable')}}</option>
      </select>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { InputNumber } from "ant-design-vue";
export default {
  data() {
    return {
      protocol: "1",
      addrmask: "1",
      btrate: "2400",
      databit: "8",
      stopbit: "1",
      verify: "0",
      datactl: "0",
      ptzdata: {},
    };
  },
  components: {
    AInputNumber: InputNumber 
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.protocol = "1";
      this.addrmask = "1";
      this.btrate = "2400";
      this.databit = "8";
      this.stopbit = "1";
      this.verify = "0";
      this.datactl = "0";
    },
    async getparam() {
      let res = await this.$getAPI("/action/get?subject=ptz");
      this.ptzdata = res.response.ptz;
      this.protocol = res.response.ptz.protocol;
      this.addrmask = res.response.ptz.addr;
      this.btrate = res.response.ptz.serial.baudrate;
      this.databit = res.response.ptz.serial.databit;
      this.stopbit = res.response.ptz.serial.stopbits;
      this.verify = res.response.ptz.serial.parity;
      this.datactl = res.response.ptz.serial.flowctrl;
    },
    saveparam() {
      if(this.addrmask==null){
        return;
      }
      this.ptzdata.protocol = this.protocol;
      this.ptzdata.addr = this.addrmask;
      this.ptzdata.serial.baudrate = this.btrate;
      this.ptzdata.serial.databit = this.databit;
      this.ptzdata.serial.stopbits = this.stopbit;
      this.ptzdata.serial.parity = this.verify;
      this.ptzdata.serial.flowctrl = this.datactl;
      let object = {
        request: {
          ptz: this.ptzdata,
        },
      };
      this.$postAPI("/action/set?subject=ptz", object, true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 216px;
}
</style>