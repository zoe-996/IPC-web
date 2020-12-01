<template>
  <div class="sideContent">
    <div class="navTitle">{{ $t("configuration.upnp") }}</div>
    <div class="checkstyle">
      <input id="enupnp" type="checkbox" :checked="enable" @change="onEnable">
      <label for="enupnp">{{$t('common.enable')}}</label>
    </div>
    <div>
      <table class="tbheader">
        <tbody>
          <tr>
            <th class="listItem rightline">{{$t('upnp.interport')}}</th>
            <th class="listItem rightline">{{$t('upnp.exterport')}}</th>
            <th class="listItem rightline">{{$t('upnp.protocol')}}</th>
            <th class="listItem rightline">{{$t('common.enable')}}</th>
            <th class="listItem">{{$t('dt.status')}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tbcon" style="height: 188px;">
      <table>
        <tbody>
          <tr v-for="(val,index) in list" :key="index" class="listRow" :class="{'selectRow':index===currow}" @click="selectRow(index)">
            <td class="listItem">{{val.interport}}</td>
            <td class="listItem">{{val.exterport}}</td>
            <td class="listItem">{{val.protocol==0 ? 'TCP':'UDP'}}</td>
            <td class="listItem">{{val.active==0 ? $t('common.disabled') : $t('common.enabled')}}</td>
            <td class="listItem">{{val.status==1 ? $t('upnp.mapsuccess') : $t('upnp.mapfail')}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="showModal(0)" :disabled="!enable||five">{{ $t("common.add") }}</button>
      <button class="commonBtn" @click="showModal(1)" :disabled="!enable">{{ $t("common.modify") }}</button>
      <button class="commonBtn" @click="deleteItem" :disabled="!enable">{{ $t("common.delete") }}</button>
    </div>
    <a-modal v-model="visible" title="UPnP" centered>
      <template slot="footer">
        <button class="commonBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
        <button class="commonBtn" @click="handleOk">{{ $t("common.save") }}</button>
      </template>
      <div class="linespace">
        <span class="textstyle">{{$t('common.enable')}}</span>
        <select v-model="active" class="commonWidth">
          <option value="0">{{ $t("common.no") }}</option>
          <option value="1">{{ $t("common.yes") }}</option>
        </select>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('upnp.protocol')}}</span>
        <select v-model="proto" class="commonWidth">
          <option value="0">TCP</option>
          <option value="1">UDP</option>
        </select>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('upnp.interport')}}</span>
        <input v-model="inport" maxlength="5" class="commonWidth" v-num/>
      </div>
      <div class="linespace">
        <span class="textstyle">{{$t('upnp.exterport')}}</span>
        <input v-model="eport" maxlength="5" class="commonWidth" v-num/>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Modal, message } from "ant-design-vue";
export default {
  data() {
    return {
      enable: false,
      visible: false,
      list: [],
      currow: '',
      active: '',
      proto: '',
      inport: '',
      eport: '',
      five: false,
      addormod: ''
    };
  },
  components: {
    AModal: Modal
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
      this.saveparam();
    },
    showModal(n) {
      if (n==0) {
        this.active = '0';
        this.proto = '0';
        this.inport = '';
        this.eport = '';
      } else {
        if(this.currow===''){
          return
        }
        let index = parseInt(this.currow);
        this.active = this.list[index].active;
        this.proto = this.list[index].protocol;
        this.inport = this.list[index].interport;
        this.eport = this.list[index].exterport;
      }
      this.visible = true;
      this.addormod = n;
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk(){
      if(this.inport==this.eport || this.inport == '' || this.eport == '' || this.inport < 1 || this.eport < 1 || this.inport > 65535 || this.eport > 65535 ){
        message.error(this.$t('common.errinput'));
        return;
      }
      if(this.addormod == 1){
        this.list[parseInt(this.currow)].active = this.active;
        this.list[parseInt(this.currow)].protocol = this.proto;
        this.list[parseInt(this.currow)].interport = this.inport;
        this.list[parseInt(this.currow)].exterport = this.eport;
      }else{
        for(let i=0; i < this.list.length; i++){
          if(this.inport == this.list[i].interport || this.eport == this.list[i].exterport){
            this.visible = false;
            message.error(this.$t('common.errexist'));
            return;
          }
        }
        this.list.push({active:this.active,protocol:this.proto,interport:this.inport,exterport:this.eport});
      }
      this.saveparam();
      this.visible = false;
    },
    getparam() {
      this.$getAPI("/action/get?subject=upnp").then((res) => {
        this.enable = res.response.upnp.active==0 ? false : true;
        let arr = res.response.upnp.pmap;
        for(let i = arr.length - 1; i >= 0; i--){
          if(arr[i].interport === '0' && arr[i].exterport === '0'){
            arr.splice(i,1);
          }
        }
        this.list = arr;
      });
    },
    saveparam() {
      let active = this.enable ? 1 : 0;
      let object = {
        request: {
          upnp: {
            active: active,
            pmap: this.list
          },
        },
      };
      this.$postAPI("/action/set?subject=upnp", object, true);
      this.five = this.list.length >= 4 ? true : false;
    },
    deleteItem(){
      let index = this.currow;
      if(index===''){
        return
      }
      this.list.splice(index,1);
      this.saveparam();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/table.scss";
.commonWidth {
  width: 150px;
  height: 23px;
  outline: none;
}
</style>