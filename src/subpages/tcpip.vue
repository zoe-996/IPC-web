<template>
  <div class="sideContent">
    <div class="navTitle">
      <div class="titleItem" :class="{ titleSelect: !showTcp }" @click="onShowItem(!showTcp)">
        {{ $t("tcpip.networksta") }}
      </div>
      <div class="titleItem" :class="{ titleSelect: showTcp }" @click="onShowItem(showTcp)">
        {{ $t("configuration.tcpip") }}
      </div>
    </div>
    <div v-show="!showTcp">
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{ $t("tcpip.wiredsta") }}</div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipv4addr") }}</div>
          <div class="value">{{ ipv4addr }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipv4mask") }}</div>
          <div class="value">{{ ipv4mask }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipv4gateway") }}</div>
          <div class="value">{{ ipv4gateway }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipv6addr") }}</div>
          <div class="value">{{ ipv6addr }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipv6gateway") }}</div>
          <div class="value">{{ ipv6gateway }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.domain") }}</div>
          <div class="value"></div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.primarydns") }}</div>
          <div class="value">{{ primarydns }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.secondarydns") }}</div>
          <div class="value">{{ seconddns }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ntpserver") }}</div>
          <div class="value">{{ ntpserver }}</div>
        </div>
      </div>
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{ $t("tcpip.wifista") }}</div>
        <div class="item">
          <div class="name">{{ $t("tcpip.wificonnect") }}</div>
          <div class="value">{{ wificonnect }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.wifiipaddr") }}</div>
          <div class="value">{{ wifiipaddr }}</div>
        </div>
      </div>
    </div>
    <div v-show="showTcp">
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{ $t("tcpip.ipv4set") }}</div>
        <div class="divRadio">
          <div class="name">{{ $t("tcpip.mode") }}</div>
          <a-radio-group name="radioGroup" v-model="ipv4mode">
            <a-radio :style="radioStyle" value="1">{{ $t("tcpip.dhcp") }}</a-radio>
            <a-radio :style="radioStyle" value="0">{{ $t("tcpip.static") }}</a-radio>
          </a-radio-group>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipaddr") }}</div>
          <ip-input v-model="addr" @getIp="(res)=>{addr=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.submask") }}</div>
          <ip-input v-model="mask" @getIp="(res)=>{mask=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.gateway") }}</div>
          <ip-input v-model="gateway" @getIp="(res)=>{gateway=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.primarydns") }}</div>
          <ip-input v-model="dns1" @getIp="(res)=>{dns1=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.secondarydns") }}</div>
          <ip-input v-model="dns2" @getIp="(res)=>{dns2=res}" :isDisabled="ipv4mode=='1'?true:false"></ip-input>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.mtu") }}</div>
          <input v-model="ipv4mtu" maxlength="4" class="commonInput" v-num/>
          <label style="color:#7f7f7f;font-size:12px;padding-left:2px;">[500-1500]</label>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.networktype") }}</div>
          <select v-model="ipv4type" class="commonInput">
            <option value="0">{{ $t("common.auto") }}</option>
            <option value="1">{{ $t("tcpip.tenmilhalf") }}</option>
            <option value="2">{{ $t("tcpip.tenmilfull") }}</option>
            <option value="3">{{ $t("tcpip.hunmilhalf") }}</option>
            <option value="4">{{ $t("tcpip.hummilfull") }}</option>
          </select>
        </div>
      </div>
      <div style="float: left; margin: 8px">
        <div class="commonTitle">{{ $t("tcpip.ipv6set") }}</div>
        <div class="divRadio">
          <div class="name">{{ $t("tcpip.mode") }}</div>
          <a-radio-group v-model="ipv6mode" :disabled="disableIpv6">
            <a-radio :style="radioStyle" value="1">{{ $t("tcpip.dhcp") }}</a-radio>
            <a-radio :style="radioStyle" value="0">{{ $t("tcpip.static") }}</a-radio>
          </a-radio-group>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipaddr") }}</div>
          <input class="commonInput" :disabled="disableIpv6 || ipv6mode==='1'" v-model="ipv6addr" @keyup="ipv6addr=ipv6addr.replace(/[^0-9abcdefABCDEF:]/g,'')">
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.submask") }}</div>
          <input class="commonInput" :disabled="disableIpv6 || ipv6mode==='1'" v-model="ipv6prefix" maxlength="3" v-num/>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.gateway") }}</div>
          <input class="commonInput" :disabled="disableIpv6 || ipv6mode==='1'" v-model="ipv6gateway" @keyup="ipv6gateway=ipv6gateway.replace(/[^0-9abcdefABCDEF:]/g,'')">
        </div>
      </div>
    </div>
    <div class="buttonGroup" v-show="showTcp">
      <button class="commonBtn" @click="restore">
        {{ $t("common.restore") }}
      </button>
      <button class="commonBtn" @click="getparam">
        {{ $t("common.refresh") }}
      </button>
      <button class="commonBtn" @click="saveparam">
        {{ $t("common.save") }}
      </button>
    </div>
  </div>
</template>
<script>
import { Radio, Modal } from "ant-design-vue";
import IpInput from '../components/Ipinput'
export default {
  data() {
    return {
      showTcp: false,
      ipv4mode: '0',
      ipv4addr: '',
      ipv4mask: '',
      ipv4gateway: '',
      ipv4mtu: 500,
      ipv4type: '',
      ipv6mode: '0',
      ipv6addr: '',
      ipv6gateway: '',
      ipv6prefix: '',
      primarydns: '',
      seconddns: '',
      ntpserver: '',
      wificonnect: '',
      wifiipaddr: '',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      disableIpv6: false,
      addr: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
      ipv6: ''
    };
  },
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    IpInput: IpInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    onShowItem(flag) {
      if(!flag){
        this.showTcp = !this.showTcp;
      }
    },
    restore() {
      this.ipv4mode = '0';
      this.ipv6mode = '0';
      this.addr = '192.168.1.188';
      this.mask = '255.255.0.0';
      this.gateway = '192.168.1.1';
      this.dns1 = '192.168.1.1';
      this.dns2 = '223.6.6.6';
      this.ipv4mtu = 1500;
      this.ipv4type = '0';
    },
    async getparam() {
      let res = await this.$getAPI("/action/get?subject=netstat&adapter=0");
      this.ipv4addr = res.response.netstat.network.ipv4.ip;
      this.addr = res.response.netstat.network.ipv4.ip;
      this.ipv4mode = res.response.netstat.network.ipv4.mode;
      this.ipv4mask = res.response.netstat.network.ipv4.mask;
      this.mask = res.response.netstat.network.ipv4.mask;
      this.ipv4gateway = res.response.netstat.network.ipv4.gateway;
      this.gateway = res.response.netstat.network.ipv4.gateway;
      this.ipv4mtu = parseInt(res.response.netstat.network.mtu);
      this.ipv4type = res.response.netstat.network.type;
      this.primarydns = res.response.netstat.network.ipv4.dns[0];
      this.seconddns = res.response.netstat.network.ipv4.dns[1];
      this.dns1 = res.response.netstat.network.ipv4.dns[0];
      this.dns2 = res.response.netstat.network.ipv4.dns[1];
      if(res.response.netstat.network.ipv6!==undefined){
        this.disableIpv6 = false;
        this.ipv6mode = res.response.netstat.network.ipv6.mode;
        this.ipv6addr = res.response.netstat.network.ipv6.ip;
        this.ipv6prefix = res.response.netstat.network.ipv6.prefixlen;
        this.ipv6gateway = res.response.netstat.network.ipv6.gateway;
      }else{
        this.disableIpv6 = true
      }
      this.$getAPI("/action/get?subject=systime").then((re)=>{
        this.ntpserver = re.response.systime.ntp.host;
      });
      this.$getAPI("/action/get?subject=netstat&adapter=1").then((re)=>{
        if(re.response.netstat.link==0){
          this.wificonnect = this.$t('common.disconnected');
        }else{
          this.wificonnect = this.$t('common.connected');
          this.wifiipaddr = re.response.netstat.network.ipv4.ip;
        }
      });
    },
    saveparam() {
      let that = this;
      if(this.ipv4mtu == '' || this.ipv4mtu < 500 || this.ipv4mtu > 1500){
        this.ipv4mtu = '';
        return;
      }
      if(this.ipv4addr != this.addr || this.ipv6addr != this.ipv6){
        Modal.confirm({
          centered: true,
          content: this.$t("tcpip.tcpiptips"),
          onOk() {
            that.postdata();
            window.location.href = "http://" + that.addr + "/login.html"
          },
          onCancel() {},
        });
      }else{
        this.postdata()
      }
    },
    postdata(){
      let object = {
        request: {
          network: {
            mtu: this.ipv4mtu,
            type: this.ipv4type,
            ipv4: {
              mode:this.ipv4mode,
              ip: this.addr,
              mask: this.mask,
              gateway: this.gateway,
              dns: [this.dns1,this.dns2]
            },
            ipv6:{
              mode:this.ipv6mode,
              ip: this.ipv6addr,
              prefixlen:this.ipv6prefix,
              gateway : this.ipv6gateway
            }
          }
        }
      };
      this.$postAPI("/action/set?subject=network&adapter=0", object, true);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/navtitle.scss";
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
.commonInput{
  border-radius: 2px;
  border:1px solid #c9c9c9;
  width: 184px;
  height: 24px;
  outline: none;
}
.commonInput:disabled{
  cursor: not-allowed;
}
</style>