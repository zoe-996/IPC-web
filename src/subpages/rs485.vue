<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.rsconfigt')}}</div>
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
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ptzcfg.send')}}</div>
      <input v-model="sendValue" maxlength="128" class="commonWidth" v-pwd>
    </div>
    <div class="lineSpacing">
      <div style="margin-left:200px;">
        <a-radio-group name="radioGroup" v-model="radioValue">
          <a-radio value="0">{{$t('ptzcfg.text')}}</a-radio>
          <a-radio value="1">{{$t('ptzcfg.hexadecimal')}}</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="lineSpacing">
      <div style="margin-left:200px;">
        <img src="../assets/subimg/information2.png" width="19px" height="19px" style="margin:0 4px 4px 0;">
        <span>{{$t('ptzcfg.sendtips')}}</span>
      </div>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { Radio } from "ant-design-vue";
export default {
  data() {
    return {
      radioValue: "0",
      sendValue: "",
      btrate: "2400",
      databit: "8",
      stopbit: "1",
      verify: "0",
      datactl: "0",
      data: {},
    };
  },
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.radioValue = "0";
      this.sendValue = "";
      this.btrate = "2400";
      this.databit = "8";
      this.stopbit = "1";
      this.verify = "0";
      this.datactl = "0";
    },
    async getparam() {
      let res = await this.$getAPI("/action/get?subject=serial");
      this.data = res.response.serial_para;
      this.sendValue = res.response.serial_para.cmd;
      this.radioValue = res.response.serial_para.cmd_type;
      this.btrate = res.response.serial_para.baudrate;
      this.databit = res.response.serial_para.databit;
      this.stopbit = res.response.serial_para.stopbit;
      this.verify = res.response.serial_para.parity;
      this.datactl = res.response.serial_para.flowctrl;
    },
    saveparam() {
      if(this.sendValue==null){
        return;
      }
      this.data.cmd = this.sendValue;
      this.data.cmd_type = this.radioValue;
      this.data.baudrate = this.btrate;
      this.data.databit = this.databit;
      this.data.stopbits = this.stopbit;
      this.data.parity = this.verify;
      this.data.flowctrl = this.datactl;
      let object = {
        request: {
          serial_para: this.data,
        },
      };
      this.$postAPI("/action/set?subject=serial", object, true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 216px;
  height: 23px;
  outline: none;
}
</style>