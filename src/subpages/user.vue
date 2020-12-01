<template>
  <div class="sideContent">
    <div class="navTitle">{{ $t("user.usertitle") }}</div>
    <div style="margin-top:10px;">
      <table class="tbheader" style="width:540px;">
        <tbody>
          <tr>
            <th class="listItem rightline">{{$t('wifi.number')}}</th>
            <th class="listItem rightline">{{$t('common.username')}}</th>
            <th class="listItem">{{$t('user.group')}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tbcon" style="width:540px;height: 188px;">
      <table>
        <tbody>
          <tr v-for="(val,index) in list" :key="index" class="listRow" :class="{'selectRow':index===currow}" @click="selectRow(index)">
            <td class="listItem">{{index+1}}</td>
            <td class="listItem">{{val.name}}</td>
            <td class="listItem">{{val.group==='0' ? $t('user.admin') : (val.group==='1' ? $t('user.operator') : $t('user.viewer')) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="showModal(0)">{{ $t("common.add") }}</button>
      <button class="commonBtn" @click="showModal(1)" :disabled="dismodify">{{ $t("common.modify") }}</button>
      <button class="commonBtn" @click="deleteItem" :disabled="disdelete">{{ $t("common.delete") }}</button>
    </div>
    <a-modal v-model="visible" :title="$t('user.usertitle')" centered>
      <template slot="footer">
        <button class="commonBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
        <button class="commonBtn" @click="handleOk">{{ $t("common.save") }}</button>
      </template>
      <div class="linespace">
        <span class="textstyle">{{$t('common.username')}}</span>
        <input v-model="username" maxlength="32" style="width:174px;height:23px;outline: none;" v-pwd :disabled="addormod==1">
        <span style="padding-left:6px;color:#999;font-size:13px;">[{{$t('common.maximum')}}32{{$t('common.char')}}]</span>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('common.password')}}</span>
        <pwd-input style="width:174px;" v-model="password" :length="'15'" @getPwd="(res)=>{password=res}"></pwd-input>
        <span style="padding-left:6px;color:#999;font-size:13px;">[{{$t('common.maximum')}}15{{$t('common.char')}}]</span>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('user.confirmpwd')}}</span>
        <pwd-input style="width:174px;" v-model="confirmpwd" :length="'15'" @getPwd="(res)=>{confirmpwd=res}"></pwd-input>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('user.group')}}</span>
        <select v-model="group" style="width:174px;outline: none;" :disabled="disall" @change="onChangeGroup">
          <option value="0">{{$t('user.admin')}}</option>
          <option value="1">{{$t('user.operator')}}</option>
          <option value="2">{{$t('user.viewer')}}</option>
        </select>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('user.authlist')}}</span>
        <div>
          <input id="ckall" type="checkbox" :checked="enableall" @change="onChange" :disabled="disall">
          <label for="ckall">{{$t("common.selall")}}</label>
        </div>
      </div>
      <div style="margin-left:180px;">
        <div class="ckleft">
          <input id="ckpreview" type="checkbox" @change="()=>{optionmask=(optionmask&1)?optionmask-1:optionmask+1}" :checked="!!(optionmask & 1)" :disabled="disall">
          <label for="ckpreview">{{$t("user.preview")}}</label>
        </div>
        <div class="ckright">
          <input id="ckplayback" type="checkbox" @change="()=>{optionmask=(optionmask&2)?optionmask-2:optionmask+2}" :checked="!!(optionmask & 2)" :disabled="disall">
          <label for="ckplayback">{{$t("user.playback")}}</label>
        </div>
        <div class="ckleft">
          <input id="ckintercom" type="checkbox" @change="()=>{optionmask=(optionmask&4)?optionmask-4:optionmask+4}" :checked="!!(optionmask & 4)" :disabled="disall">
          <label for="ckintercom">{{$t("user.intercom")}}</label>
        </div>
        <div class="ckright">
          <input id="ckmaintain" type="checkbox" @change="()=>{optionmask=(optionmask&8)?optionmask-8:optionmask+8}" :checked="!!(optionmask & 8)" :disabled="group==='2' || group==='1' || disall">
          <label for="ckmaintain">{{$t("user.maintain")}}</label>
        </div>
        <div class="ckleft">
          <input id="ckstorage" type="checkbox" @change="()=>{optionmask=(optionmask&16)?optionmask-16:optionmask+16}" :checked="!!(optionmask & 16)" :disabled="group==='2' || group==='1' || disall">
          <label for="ckstorage">{{$t("user.storage")}}</label>
        </div>
        <div class="ckright">
          <input id="ckptz" type="checkbox" @change="()=>{optionmask=(optionmask&32)?optionmask-32:optionmask+32}" :checked="!!(optionmask & 32)" :disabled="disall">
          <label for="ckptz">{{$t("user.ptzcontrol")}}</label>
        </div>
        <div class="ckleft">
          <input id="ckupgrade" type="checkbox" @change="()=>{optionmask=(optionmask&64)?optionmask-64:optionmask+64}" :checked="!!(optionmask & 64)" :disabled="group==='2' || group==='1' || disall">
          <label for="ckupgrade">{{$t("user.upgrade")}}</label>
        </div>
        <div class="ckright">
          <input id="cksystem" type="checkbox" @change="()=>{configmask=(configmask&1)?configmask-1:configmask+1}" :checked="!!(configmask & 1)" :disabled="group==='2' || group==='1' || disall">
          <label for="cksystem">{{$t("user.system")}}</label>
        </div>
        <div class="ckleft">
          <input id="cknetwork" type="checkbox" @change="()=>{configmask=(configmask&2)?configmask-2:configmask+2}" :checked="!!(configmask & 2)" :disabled="group==='2' || disall">
          <label for="cknetwork">{{$t("user.network")}}</label>
        </div>
        <div class="ckright">
          <input id="ckaudio" type="checkbox" @change="()=>{configmask=(configmask&4)?configmask-4:configmask+4}" :checked="!!(configmask & 4)" :disabled="group==='2' || disall">
          <label for="ckaudio">{{$t("user.audio")}}</label>
        </div>
        <div class="ckleft">
          <input id="ckvideo" type="checkbox" @change="()=>{configmask=(configmask&8)?configmask-8:configmask+8}" :checked="!!(configmask & 8)" :disabled="group==='2' || disall">
          <label for="ckvideo">{{$t("user.video")}}</label>
        </div>
        <div class="ckright">
          <input id="ckevent" type="checkbox" @change="()=>{configmask=(configmask&16)?configmask-16:configmask+16}" :checked="!!(configmask & 16)" :disabled="group==='2' || disall">
          <label for="ckevent">{{$t("user.event")}}</label>
        </div>
        <div class="ckleft">
          <input id="ckrecord" type="checkbox" @change="()=>{configmask=(configmask&32)?configmask-32:configmask+32}" :checked="!!(configmask & 32)" :disabled="group==='2' || disall">
          <label for="ckrecord">{{$t("user.record")}}</label>
        </div>
        <div class="ckright">
          <input id="ckusermgr" type="checkbox" @change="()=>{configmask=(configmask&64)?configmask-64:configmask+64}" :checked="!!(configmask & 64)" :disabled="group==='2' || group==='1' || disall">
          <label for="ckusermgr">{{$t("user.usermgr")}}</label>
        </div>
        <div>
          <input id="ckav" type="checkbox" @change="()=>{configmask=(configmask&128)?configmask-128:configmask+128}" :checked="!!(configmask & 128)" :disabled="group==='2' || disall">
          <label for="ckav">{{$t("user.smartav")}}</label>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Modal, message } from "ant-design-vue";
import PwdInput from "../components/pwdinput"
export default {
  data() {
    return {
      visible: false,
      list: [],
      currow: '',
      g_config: '',
      g_operation: '',
      username: '',
      password: '',
      confirmpwd: '',
      group: '0',
      disall: false,
      addormod: -1,
      dismodify: false,
      disdelete: false,
      configmask: 0,
      optionmask: 0,
      enableall: false
    };
  },
  components: {
    AModal: Modal,
    PwdInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    onChange(){
      this.enableall = !this.enableall;
      if (this.enableall) {
        if (this.group==='0') {
          this.configmask = 255;
          this.optionmask = 127;
        } else if (this.group==='1') {
          this.configmask = 190;
          this.optionmask = 39;
        } else if (this.group==='2') {
          this.configmask = 0;
          this.optionmask = 39;
        }
      } else {
        this.configmask = 0;
        this.optionmask = 0;
      }
    },
    onChangeGroup(){
      this.enableall = false;
      this.configmask = 0;
      this.optionmask = 0;
    },
    selectRow(index){
      this.currow = index;
      let g_user = 'admin';
      let curname = this.list[index].name;
      if(curname == g_user){
        this.disdelete = true;
      }else{
        this.disdelete = false;
      }
      if(curname == 'admin' && curname != g_user){
        this.dismodify = true
      }else{
        this.dismodify = false;
      }
    },
    showModal(n) {
      if (n==0) {
        this.disall = false;
        this.username = '';
        this.password = '';
        this.confirmpwd = '';
        this.group = '0';
        this.enableall = false;
        this.configmask = 0;
        this.optionmask = 0;
      } else if (n==1) {
        if(this.currow===''){
          return
        }
        let index = parseInt(this.currow);
        let curname = this.list[index].name
        this.username = curname;
        this.password = '';
        this.confirmpwd = '';
        this.group = this.list[index].group;
        this.optionmask = this.list[index].permit.operation;
        this.configmask = this.list[index].permit.config;
        if (curname == 'admin') {
          this.disall = true;
          this.enableall = true;
        } else {
          this.disall = false;
        }
      }
      this.visible = true;
      this.addormod = n;
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk(){
      if(this.password != this.confirmpwd){
        message.error(this.$t('tip.pwdnomach'));
        return;
      }
      if(this.password=='' || this.username==''){
        message.error(this.$t('common.errinput'));
        return;
      }
      let pwd = window.btoa(this.password);
      let str = '<?xml version="1.0" encoding="utf-8"?><request><user><name>' + this.username.trim() + '</name><password>' + pwd + '</password><group>' + this.group + '</group><permit><config>' + this.configmask + '</config><operation>' + this.optionmask + '</operation></permit></user></request>';
      if (this.addormod==0) {
        this.$post("/action/set?subject=user&do=add", str).then(()=>{
          message.success(this.$t('tip.addsuc'));
          this.getparam();
          this.visible = false;
        }).catch((err) => {
          if (err.response.status==409) {
            message.error(this.$t('tip.uexist'));
          } else {
            message.error(this.$t('tip.addfai'));
          }
        });
      } else if(this.addormod==1) {
        this.$post("/action/set?subject=user&do=modify", str).then(()=>{
          message.success(this.$t('tip.modifysuc'));
          this.getparam();
          this.visible = false;
          if(this.disdelete){
            window.location.href = '/login.html';
          }
        }).catch(() => {
          message.error(this.$t('tip.modifyfai'));
        });
      }
    },
    getparam() {
      this.$getAPI("/action/get?subject=user").then((res) => {
        let arr = res.response.user;
        if (arr instanceof Array) {
          this.list = arr; 
        } else {
          this.list = [arr];
        }
      });
    },
    deleteItem(){
      let index = this.currow;
      let curname = this.list[index].name;
      if(index===''){
        return
      }
      if(curname==='admin'){
        message.error(this.$t('tip.erradmin'));
        return;
      }
      let str = '<?xml version="1.0" encoding="utf-8"?><request><user><name>' + curname + '</name></user></request>';
      this.$post("/action/set?subject=user&do=del", str).then(()=>{
        message.success(this.$t('tip.delsuc'));
        this.getparam();
      }).catch(() => {
        message.error(this.$t('tip.delerr'));
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/table.scss";
.ckleft{
  width:119px;
  display:inline-block;
}
.ckright{
  width:170px;
  display:inline-block;
}
</style>