<template>
  <div class="sideContent">
    <div class="navTitle">SNMP</div>
    <div class="commonTitle">SNMP V1/V2</div>
    <div>
      <div style="margin:6px 0 6px 30px;">
        <input id="snmpv1" type="checkbox" :checked="enable1" @change="onChange1">
        <label for="snmpv1">SNMPv1 </label>
        <input id="snmpv2" type="checkbox" :checked="enable2" @change="onChange2">
        <label for="snmpv2">SNMPv2c</label>
      </div>
      <div class="smallLineSpacing">
        <div class="textWidth1">{{$t('snmp.rcommunity')}}</div>
        <input class="commonWidth" v-model="rcommunity" :disabled="!enable1 && !enable2" v-pwd>
      </div>
      <div class="smallLineSpacing">
        <div class="textWidth1">{{$t('snmp.wcommunity')}}</div>
        <input class="commonWidth" v-model="wcommunity" :disabled="!enable1 && !enable2" v-pwd>
      </div>
      <div class="smallLineSpacing">
        <div class="textWidth1">{{$t('snmp.trapaddr')}}</div>
        <ip-input v-model="trapip" @getIp="(res)=>{trapip=res}" :isDisabled="!enable1 && !enable2"></ip-input>
      </div>
      <div class="smallLineSpacing">
        <div class="textWidth1">{{$t('snmp.trapport')}}</div>
        <input class="commonWidth" v-model="trapport" maxlength="5" :disabled="!enable1 && !enable2" v-num>
      </div>
      <div class="smallLineSpacing">
        <div class="textWidth1">{{$t('snmp.rtapname')}}</div>
        <input class="commonWidth" v-model="tcommunity" :disabled="!enable1 && !enable2" v-pwd>
      </div>
    </div>
    <div class="commonTitle">SNMP V3</div>
    <div style="margin:6px 0 6px 30px;">
      <input id="snmpv3" type="checkbox" :checked="enable3" @change="onChange3">
      <label for="snmpv3">SNMPv3</label>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.rusername')}}</div>
      <input class="commonWidth" v-model="rname" :disabled="!enable3" v-pwd>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.securityl')}}</div>
      <select class="commonWidth" v-model="readsecurity" :disabled="!enable3">
          <option value="0">no auth,no priv</option>
          <option value="1">auth,no priv</option>
          <option value="2">auth,priv</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.authalgorithm')}}</div>
      <select class="commonWidth" v-model="rauthtype" :disabled="!enable3 || (readsecurity & 3)==0">
          <option value="0">MD5</option>
          <option value="1">SHA</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.authpwd')}}</div>
      <pwd-input style="width: 184px;" v-model="rauthpwd" :isDisabled="!enable3 || (readsecurity & 3)==0" @getPwd="(res)=>{rauthpwd=res}"></pwd-input>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.privatealgorithm')}}</div>
      <select class="commonWidth" v-model="rprivatetype" :disabled="!enable3 || (readsecurity & 2)==0">
          <option value="0">DES</option>
          <option value="1">AES</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.privatepwd')}}</div>
      <pwd-input style="width: 184px;" v-model="rprivatepwd" :isDisabled="!enable3  || (readsecurity & 2)==0" @getPwd="(res)=>{rprivatepwd=res}"></pwd-input>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.wusername')}}</div>
      <input class="commonWidth" v-model="wname" :disabled="!enable3" v-pwd>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.securityl')}}</div>
      <select class="commonWidth" v-model="writesecurity" :disabled="!enable3">
          <option value="0">no auth,no priv</option>
          <option value="1">auth,no priv</option>
          <option value="2">auth,priv</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.authalgorithm')}}</div>
      <select class="commonWidth" v-model="wauthtype" :disabled="!enable3 || (writesecurity & 3)==0">
          <option value="0">MD5</option>
          <option value="1">SHA</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.authpwd')}}</div>
      <pwd-input style="width: 184px;" v-model="wauthpwd" :isDisabled="!enable3 || (writesecurity & 3)==0" @getPwd="(res)=>{wauthpwd=res}"></pwd-input>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.privatealgorithm')}}</div>
      <select class="commonWidth" v-model="wprivatetype" :disabled="!enable3 || (writesecurity & 2)==0">
          <option value="0">DES</option>
          <option value="1">AES</option>
      </select>
    </div>
    <div class="smallLineSpacing">
      <div class="textWidth1">{{$t('snmp.privatepwd')}}</div>
      <pwd-input style="width: 184px;" v-model="wprivatepwd" :isDisabled="!enable3 || (writesecurity & 2)==0" @getPwd="(res)=>{wprivatepwd=res}"></pwd-input>
    </div>
    <div class="commonTitle">{{$t('snmp.snmpextend')}}</div>
    <div class="smallLineSpacing" style="margin-top:5px;">
      <div class="textWidth1">{{$t('snmp.snmpport')}}</div>
      <input class="commonWidth" v-model="servport" maxlength="5" v-num>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import IpInput from '../components/Ipinput'
import PwdInput from "../components/pwdinput"
export default {
  data() {
    return {
      enable1: false,
      enable2: false,
      enable3: false,
      rcommunity: '',
      wcommunity: '',
      trapip: '',
      trapport: '161',
      tcommunity: '',
      rname: '',
      readsecurity: '0',
      rauthtype: '0',
      rauthpwd: '',
      rprivatetype: '0',
      rprivatepwd: '',
      wname: '',
      writesecurity: '0',
      wauthtype: '0',
      wauthpwd: '',
      wprivatetype: '0',
      wprivatepwd: '',
      servport: '161'
    };
  },
  components: {
    PwdInput,
    IpInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable1 = false;
      this.enable2 = false;
      this.enable3 = false;
      this.rcommunity = '',
      this.wcommunity = '',
      this.trapip = '',
      this.trapport = '161',
      this.tcommunity = '',
      this.rname = '',
      this.readsecurity = '0',
      this.rauthtype = '0',
      this.rauthpwd = '',
      this.rprivatetype = '0',
      this.rprivatepwd = '',
      this.wname = '',
      this.writesecurity = '0',
      this.wauthtype = '0',
      this.wauthpwd = '',
      this.wprivatetype = '0',
      this.wprivatepwd = '',
      this.servport = '161'
    },
    getparam() {
      this.$getAPI("/action/get?subject=snmp").then(res=>{
        this.enable1 = res.response.snmp.v1active==1 ? true:false;
        this.enable2 = res.response.snmp.v2active==1 ? true:false;
        this.enable3 = res.response.snmp.v3active==1 ? true:false;
        this.servport = res.response.snmp.servport;
        this.rcommunity = res.response.snmp.rcommunity;
        this.wcommunity = res.response.snmp.wcommunity;
        this.trapip = res.response.snmp.trapip;
        this.trapport = res.response.snmp.trapport;
        this.tcommunity = res.response.snmp.tcommunity;
        this.rname = res.response.snmp.rouser.name;
        this.readsecurity = res.response.snmp.rouser.securty;
        this.rauthtype = res.response.snmp.rouser.authtype;
        this.rprivatetype = res.response.snmp.rouser.algtype;
        this.rauthpwd = res.response.snmp.rouser.authpwd;
        this.rprivatepwd = res.response.snmp.rouser.algpwd;
        this.wname = res.response.snmp.rwuser.name;
        this.writesecurity = res.response.snmp.rwuser.securty;
        this.wauthtype = res.response.snmp.rwuser.authtype;
        this.wprivatetype = res.response.snmp.rwuser.algtype;
        this.wauthpwd = res.response.snmp.rwuser.authpwd;
        this.wprivatepwd = res.response.snmp.rwuser.algpwd;
      });
    },
    saveparam() {
      if(this.servport < 1 || this.servport > 65535){
        this.servport = '';
        return;
      }
      let active1 = this.enable1 ? 1:0;
      let active2 = this.enable2 ? 1:0;
      let active3 = this.enable3 ? 1:0;
      let object = {
        request:{
          snmp:{
            v1active: active1,
            v2active: active2,
            servport: this.servport,
            rcommunity: this.rcommunity,
            wcommunity: this.wcommunity,
            trapip: this.trapip,
            trapport: this.trapport,
            tcommunity: this.tcommunity,
            v3active: active3,
            rouser:{
              name: this.rname,
              securty: this.readsecurity,
              authtype: this.rauthtype,
              algtype: this.rprivatetype,
              authpwd: this.rauthpwd,
              algpwd: this.rprivatepwd
            },
            rwuser:{
              name: this.wname,
              securty: this.writesecurity,
              authtype: this.wauthtype,
              algtype: this.wprivatetype,
              authpwd: this.wauthpwd,
              algpwd: this.wprivatepwd
            }
          }
        }
      };
      this.$postAPI("/action/set?subject=snmp", object, true);
    },
    onChange1(){
      this.enable1 = !this.enable1;
    },
    onChange2(){
      this.enable2 = !this.enable2;
    },
    onChange3(){
      this.enable3 = !this.enable3;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 184px;
  height: 23px;
  outline: none;
}
</style>