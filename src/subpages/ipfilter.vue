<template>
  <div class="sideContent">
    <div class="navTitle">{{ $t("configuration.ipfilter") }}</div>
    <div class="checkstyle">
      <input id="enipfilter" type="checkbox" :checked="enable" @change="onEnable">
      <label for="enipfilter">{{$t("common.enable")}}</label>
    </div>
    <div class="linespace">
      <span>{{$t("ipfilter.ipfmode")}} </span>
      <select v-model="mode" style="width:150px;outline: none;" :disabled="!enable" @change="onChange">
        <option value="0">{{ $t("ipfilter.allows") }}</option>
        <option value="1">{{ $t("ipfilter.forbidden") }}</option>
      </select>
    </div>
    <div>
      <table class="tbheader" style="width:540px;">
        <tbody>
          <tr>
            <th class="listItem rightline">{{$t('ipfilter.startip')}}</th>
            <th class="listItem rightline">{{$t('ipfilter.endip')}}</th>
            <th class="listItem">{{$t('ipfilter.alias')}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tbcon" style="width:540px;height: 188px;">
      <table>
        <tbody>
          <tr v-for="(val,index) in list" :key="index" class="listRow" :class="{'selectRow':index===currow}" @click="selectRow(index)">
            <td class="listItem">{{val.start}}</td>
            <td class="listItem">{{val.end}}</td>
            <td class="listItem">{{val.name}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="showModal(0)" :disabled="!enable || four">{{ $t("common.add") }}</button>
      <button class="commonBtn" @click="showModal(1)" :disabled="!enable">{{ $t("common.modify") }}</button>
      <button class="commonBtn" @click="deleteItem" :disabled="!enable">{{ $t("common.delete") }}</button>
    </div>
    <a-modal v-model="visible" :title="$t('configuration.ipfilter')" centered>
      <template slot="footer">
        <button class="commonBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
        <button class="commonBtn" @click="handleOk">{{ $t("common.save") }}</button>
      </template>
      <div class="linespace">
        <span class="textstyle">{{$t('ipfilter.alias')}}</span>
        <input v-model="name" style="width:184px;height:23px;outline: none;border:1px solid #c9c9c9;" v-pwd>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('ipfilter.startip')}}</span>
        <ip-input v-model="startip" @getIp="(res)=>{startip=res}"></ip-input>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('ipfilter.endip')}}</span>
        <ip-input v-model="endip" @getIp="(res)=>{endip=res}"></ip-input>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('tcpip.submask')}}</span>
        <ip-input v-model="submask" @getIp="(res)=>{submask=res}"></ip-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Modal, message } from "ant-design-vue";
import IpInput from '../components/Ipinput'
export default {
  data() {
    return {
      enable: false,
      four: false,
      mode: '0',
      visible: false,
      list: [],
      allowlist: [],
      denylist: [],
      currow: '',
      addormod: '',
      name: '',
      startip: '0.0.0.0',
      endip: '0.0.0.0',
      submask: '255.255.255.0'
    };
  },
  components: {
    AModal: Modal,
    IpInput: IpInput
  },
  mounted() {
    this.getparam();
  },
  methods: {
    selectRow(index){
      this.currow = index;
    },
    onEnable() {
      this.enable = !this.enable;
      this.saveparam(false);
    },
    onChange(){
      if (this.mode==='0') {
        this.list = this.allowlist;
      } else {
        this.list = this.denylist;
      }
      if (this.list.length >= 4) {
        this.four = true;
      } else {
        this.four = false;
      }
    },
    showModal(n) {
      if (n==0) {
        this.name = '';
        this.startip = '0.0.0.0';
        this.endip = '0.0.0.0';
        this.submask = '255.255.255.0';
      } else {
        if(this.currow===''){
          return
        }
        let index = parseInt(this.currow);
        this.name = this.list[index].name;
        this.startip = this.list[index].start;
        this.endip = this.list[index].end;
        this.submask = this.list[index].mask;
      }
      this.visible = true;
      this.addormod = n;
    },
    handleCancel() {
      this.visible = false;
    },
    ntohl(ipaddr){
      let arr = ipaddr.split('.');
      if(arr.length !== 4){
        return 0;
      }
      let sec1 = parseInt(arr[0]) << 24;
      let sec2 = parseInt(arr[1]) << 16;
      let sec3 = parseInt(arr[2]) << 8;
      let sec4 = parseInt(arr[3]);
      return (sec1 + sec2 + sec3 + sec4);
    },
    handleOk(){
      let lip1 = this.ntohl(this.startip);
      let lip2 = this.ntohl(this.endip);
      if(this.name.length <= 0 || this.startip == this.endip || lip1 >= lip2){
        message.error(this.$t('common.errinput'));
        return;
      }
      if(this.addormod == 1){
        let index = parseInt(this.currow);
        if (this.mode=='0') {
          this.allowlist[index].name = this.name;
          this.allowlist[index].start = this.startip;
          this.allowlist[index].end = this.endip;
          this.allowlist[index].mask = this.submask;
        } else {
          this.denylist[index].name = this.name;
          this.denylist[index].start = this.startip;
          this.denylist[index].end = this.endip;
          this.denylist[index].mask = this.submask;
        }
      }else{
        if (this.mode=='0') {
          this.allowlist.push({name:this.name,start:this.startip,end:this.endip,mask:this.submask});
        } else {
          this.denylist.push({name:this.name,start:this.startip,end:this.endip,mask:this.submask});
        }
      }
      this.saveparam(true);
      this.visible = false;
    },
    getparam() {
      this.$getAPI("/action/get?subject=ipfilter").then((res) => {
        this.enable = res.response.ipfilter.active==0 ? false : true;
        this.mode = res.response.ipfilter.filter;
        let allowarr = res.response.ipfilter.allow.iprule;
        let denyarr = res.response.ipfilter.deny.iprule;
        for(let i = allowarr.length-1; i >= 0 ; i--){
          if(allowarr[i].name == '' && allowarr[i].start == ''){
            allowarr.splice(i,1);
          }
        }
        for(let j = denyarr.length-1; j >= 0 ; j--){
          if(denyarr[j].name == '' && denyarr[j].start == ''){
            denyarr.splice(j,1);
          }
        }
        this.allowlist = allowarr;
        this.denylist = denyarr;
        this.onChange();
      });
    },
    saveparam(flag) {
      let active = this.enable ? 1 : 0;
      let object = {
        request: {
          ipfilter: {
            active: active,
            filter: this.mode,
            allow: {
              iprule: this.allowlist
            },
            deny: {
              iprule: this.denylist
            }
          },
        },
      };
      this.$postAPI("/action/set?subject=ipfilter", object, flag);
      this.getparam();
    },
    deleteItem(){
      let index = this.currow;
      if(index===''){
        return
      }
      if (this.mode==='0') {
        this.allowlist.splice(index,1);
      } else {
        this.denylist.splice(index,1);
      }
      this.saveparam(true);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/table.scss";
</style>