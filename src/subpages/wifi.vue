<template>
  <div class="sideContent">
    <div class="navTitle">{{ $t("configuration.wifi") }}</div>
    <div style="color: red;font-size:12px;margin-top:10px;" v-if="netcard">{{$t('tip.notesupport')}}</div>
    <div class="checkstyle">
      <a-checkbox @change="onEnable" :checked="enable" :disabled="netcard">{{$t("common.enable")}}</a-checkbox>
      <button class="commonBtn" @click="searchItem" :disabled="!enable || netcard" style="float: right;">{{ $t("wifi.searchssid") }}</button>
      <button class="commonBtn" @click="addItem" :disabled="!enable || netcard" style="float: right;">{{ $t("wifi.addssid") }}</button>
    </div>
    <div>
      <table class="tbheader">
        <tbody>
          <tr>
            <th class="listItem rightline">{{$t('wifi.number')}}</th>
            <th class="listItem rightline">{{$t('wifi.ssid')}}</th>
            <th class="listItem rightline">{{$t('smtp.auth')}}</th>
            <th class="listItem rightline">{{$t('wifi.encrypt')}}</th>
            <th class="listItem">{{$t('wifi.signal')}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tbcon" style="height:238px;">
      <table>
        <tbody>
          <tr v-for="(val,index) in list" :key="index" class="listRow" :class="{'selectRow':index===currow}" @click="selectRow(index)">
            <td class="listItem">{{index}}</td>
            <td class="listItem">{{val.essid}}</td>
            <td class="listItem">{{val.auth}}</td>
            <td class="listItem">{{val.alg}}</td>
            <td class="listItem"><img :src="signalImg[index]" width="21px;"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="width:900px;height:122px;border: 1px solid black;font-size:12px;margin-top:10px;background-color:#eeeeee;">
      <div>
        <div class="text">{{$t('wifi.curnetwork')}}</div>
        <div class="value">{{essid}}</div>
        <span>{{isconn? $t('common.connected'):$t('common.disconnected')}}</span>
      </div>
      <div>
        <div class="text">{{$t('tcpip.ipaddr')}}</div>
        <div class="value">{{curip}}</div>
        <button class="commonBtn" @click="modifyIp" :disabled="!enable || netcard || !isconn">{{ $t("common.modify") }}</button>
      </div>
      <div>
        <div class="text">{{$t('tcpip.submask')}}</div>
        <div class="value">{{curmask}}</div>
      </div>
      <div>
        <div class="text">{{$t('wifi.defaultgateway')}}</div>
        <div class="value">{{curgateway}}</div>
      </div>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="refresh" :disabled="netcard">{{ $t("common.refresh") }}</button>
      <button class="commonBtn" :disabled="netcard">{{ $t("common.save") }}</button>
    </div>
    <a-modal v-model="visiblewifi" :title="$t('wifi.contowifi')" centered>
      <template slot="footer">
        <button class="commonBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
        <button class="commonBtn" @click="handleOk">{{ $t("wifi.connect") }}</button>
      </template>
      <div class="linespace">
        <span class="textstyle">{{$t('wifi.ssid')}}</span>
        <a-input size="small" style="width:200px;" v-pwd v-model="curessid"></a-input>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('wifi.authandenc')}}</span>
        <select v-model="encryption" style="width:200px;" :disabled="en">
          <option value="0">OPEN/NONE</option>
          <option value="1">WPAPSK/AES</option>
          <option value="2">WPAPSK/TKIP</option>
          <option value="3">WPA2PSK/TIKP</option>
          <option value="4">WPA2PSK/AES</option>
          <option value="5">SHARED/WEP</option>
          <option value="6">OPEN/WEP</option>
        </select>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('common.password')}}</span>
        <a-input-password v-model="password" size="small" style="width:200px;" v-pwd></a-input-password>
      </div>
    </a-modal>
    <a-modal v-model="visibleip" :title="$t('common.modify')" centered>
      <template slot="footer">
        <button class="commonBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
        <button class="commonBtn" @click="handleSave">{{ $t("common.save") }}</button>
      </template>
      <div class="divRadio">
        <div class="name">{{ $t("tcpip.mode") }}</div>
        <a-radio-group name="radioGroup" v-model="ipv4mode">
          <a-radio :style="radioStyle" value="1">{{ $t("tcpip.dhcp") }}</a-radio>
          <a-radio :style="radioStyle" value="0">{{ $t("tcpip.static") }}</a-radio>
        </a-radio-group>
      </div>
      <div class="line">
        <div class="name">{{ $t("tcpip.ipaddr") }}</div>
        <ip-input v-model="addr" @getIp="(res)=>{addr=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
      </div>
      <div class="line">
        <div class="name">{{ $t("tcpip.submask") }}</div>
        <ip-input v-model="mask" @getIp="(res)=>{mask=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
      </div>
      <div class="line">
        <div class="name">{{ $t("tcpip.gateway") }}</div>
        <ip-input v-model="gateway" @getIp="(res)=>{gateway=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
      </div>
      <div class="line">
        <div class="name">{{ $t("tcpip.primarydns") }}</div>
        <ip-input v-model="dns1" @getIp="(res)=>{dns1=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
      </div>
      <div class="line">
        <div class="name">{{ $t("tcpip.secondarydns") }}</div>
        <ip-input v-model="dns2" @getIp="(res)=>{dns2=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Checkbox, Modal, Input, Radio, message } from "ant-design-vue";
import IpInput from '../components/Ipinput'
export default {
  data() {
    return {
      netcard: false,
      enable: false,
      visiblewifi: false,
      visibleip: false,
      list: [],
      signalImg: [],
      currow: '',
      curip: '',
      curmask: '',
      curgateway:'',
      ipv4mode: '',
      addr: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
      isconn: false,
      essid: '',
      password: '',
      encryption: '',
      curessid: '',
      en: false,
      radioStyle: {display: 'block',height: '30px',lineHeight: '30px',}
    };
  },
  components: {
    ACheckbox: Checkbox,
    AModal: Modal,
    AInput: Input,
    AInputPassword: Input.Password,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    IpInput: IpInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    onEnable() {
      this.enable = !this.enable;
      this.saveparam();
    },
    handleCancel() {
      this.visibleip = false;
      this.visiblewifi = false;
    },
    handleSave(){
      this.saveparam();
    },
    handleOk(){
      if(this.curessid=='' || this.password==''){
        message.error(this.$t('common.errinput'));
        return;
      }
      let auth = this.encryption;
      let strauth;
      let strenc;
      if (auth == 0) {
        strauth = "0";
        strenc = "0";
      } else if (auth == 1) {
        strauth = "2";
        strenc = "3";
      } else if (auth == 2) {
        strauth = "2";
        strenc = "2";
      } else if (auth == 3) {
        strauth = "3";
        strenc = "2";
      } else if (auth == 4) {
        strauth = "3";
        strenc = "3";
      } else if (auth == 5) {
        strauth = "1";
        strenc = "1";
      } else if (auth == 6) {
        strauth = "1";
        strenc = "0";
      }
      let object = {
        request: {
          wifi: {
            essid: this.curessid,
            auth: strauth,
            alg: strenc,
            password:this.password
          }
        },
      };
      this.$postAPI("/action/set?subject=network&adapter=1", object, true);
      this.visiblewifi = false;
    },
    getparam() {
      this.$getAPI("/action/get?subject=devability").then((res) => {
        if (res.response.devability.netcard & 2) {
          this.netcard = false;
        } else {
          this.netcard = true;
        }
      });
      this.$getAPI("/action/get?subject=network&adapter=1").then((res) => {
        if (res.response.network.active == 1) {
          this.enable = true;
          this.getWifiscan();
        } else {
          this.enable = false;
        }
        this.curip = res.response.network.ipv4.ip;
        this.curmask = res.response.network.ipv4.mask;
        this.curgateway = res.response.network.ipv4.gateway;
        this.addr = res.response.network.ipv4.ip;
        this.mask = res.response.network.ipv4.mask;
        this.gateway = res.response.network.ipv4.gateway;
        this.dns1 = res.response.network.ipv4.dns[0];
        this.dns2 = res.response.network.ipv4.dns[1];
        this.ipv4mode = res.response.network.ipv4.mode;
      });
      this.$getAPI("/action/get?subject=netstat&adapter=1").then((res) => {
          this.isconn = res.response.netstat.link==1 ? true:false;
      });
      this.$getAPI("/action/get?subject=wifi").then((res) => {
          this.essid = res.response.wifi.essid;
      })
    },
    saveparam() {
      if(this.addr==this.gateway){
        message.error(this.$t('common.errinput'));
        return;
      }
      let active = this.enable ? 1 : 0;
      let object = {
        request: {
          network: {
            active: active,
            mtu: '1500',
            type: '0',
            ipv4:{
              mode: this.ipv4mode,
              ip: this.addr,
              mask: this.mask,
              gateway: this.gateway,
              dns: [this.dns1,this.dns2]
            }
          },
        },
      };
      this.$postAPI("/action/set?subject=network&adapter=1", object, true);
    },
    getWifiscan(){
      this.$getAPI("/action/get?subject=wifiscan").then((res) => {
        let data = res.response.wifiap;
        this.list = (data instanceof Array) ? data : [data];
        for(let i = 0; i < this.list.length; i++){
          let s = parseInt(this.list[i].signal);
          if (s > -40) {
            this.signalImg[i] = require('@/assets/subimg/signal5.png');
          } else if (s > -50 && s <= -40) {
            this.signalImg[i] = require('@/assets/subimg/signal4.png');
          } else if (s > -60 && s <= -50) {
            this.signalImg[i] = require('@/assets/subimg/signal3.png');
          } else if (s > -80 && s <= -60) {
            this.signalImg[i] = require('@/assets/subimg/signal2.png');
          } else if (s <= -80) {
            this.signalImg[i] = require('@/assets/subimg/signal1.png');
          }
          if (this.list[i].auth == 0) {
            this.list[i].auth = "NONE";
          } else if (this.list[i].auth == 1) {
            this.list[i].auth = "WEP";
          } else if (this.list[i].auth == 2) {
            this.list[i].auth = "WPA";
          } else if (this.list[i].auth == 3) {
            this.list[i].auth = "WPA2";
          }
          if (this.list[i].alg == 0) {
            this.list[i].alg = "OPEN";
          } else if (this.list[i].alg == 1) {
            this.list[i].alg = "SHARED";
          } else if (this.list[i].alg == 2) {
            this.list[i].alg = "TKIP";
          } else if (this.list[i].alg == 3) {
            this.list[i].alg = "AES";
          }
        }
      })
    },
    addItem(){
      this.curessid = '';
      this.encryption = '4';
      this.en = false;
      this.password = '';
      this.visiblewifi = true;
    },
    selectRow(index){
      this.currow = index;
      this.curessid = this.list[index].essid;
      let targetauth = this.list[index].auth;
      let targetecn = this.list[index].alg;
      if (targetauth == "NONE" && targetecn == "OPEN") {
        this.encryption = '0';
      } else if (targetauth == "WEP" && targetecn == "OPEN") {
        this.encryption = '6';
      } else if (targetauth == "WPA" && targetecn == "AES") {
        this.encryption = '1';
      } else if (targetauth == "WPA" && targetecn == "TKIP") {
        this.encryption = '2';
      } else if (targetauth == "WPA2" && targetecn == "AES") {
        this.encryption = '4';
      } else if (targetauth == "WPA2" && targetecn == "TKIP") {
        this.encryption = '3';
      } else if (targetauth == "WEP" && targetecn == "SHARED") {
        this.encryption = '5';
      } else {
        this.encryption = '4';
      }
      this.en = true;
      this.password = '';
      this.visiblewifi = true;
    },
    searchItem(){
      this.list = [];
      this.getWifiscan();
    },
    modifyIp(){
      this.visibleip = true;
    },
    refresh(){
      this.list = [];
      this.getparam();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/table.scss";
.text{
  margin:8px 0 0 10px;
  width:140px;
  display:inline-block;
}
.value{
  width: 100px;
  color: #7f7f7f;
  display:inline-block;
}
.divRadio{
  width: 420px;
  height: 60px;
  font-size: 13px;
  display: flex;
  justify-items: center;
  .name {
    color: black;
    width: 170px;
    display: inline-block;
    padding-left: 10px;
  }
}
.line{
  width: 420px;
  height: 26px;
  display: flex;
  justify-items: center;
  font-size: 13px;
  margin-top:5px;
  .name {
    color: black;
    width: 170px;
    display: inline-block;
    padding-left: 10px;
  }
}
</style>