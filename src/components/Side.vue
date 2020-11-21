<template>
  <a-layout-sider breakpoint="lg" collapsed-width="0" theme="light">
    <a-menu mode="inline" :default-selected-keys="['1']" :open-keys="openKeys" @openChange="onOpenChange" >
      <a-menu-item key="1">
        <router-link to="/configuration">
          <img class="siderImg" src="../assets/img/information.png" /><span>{{$t('configuration.basesetting')}}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="sub1">
         <template v-slot:title>
          <img class="siderImg" src="../assets/img/system.png" /><span>{{$t('configuration.system')}}</span>
        </template>
        <a-menu-item key="2" v-if="!!(config&1)"><router-link to="/configuration/general">{{$t('configuration.general')}}</router-link></a-menu-item>
        <a-menu-item key="3" v-if="!!(config&1)"><router-link to="/configuration/datetime">{{$t('configuration.datetime')}}</router-link></a-menu-item>
        <a-menu-item key="4" v-if="!!(config&1)"><router-link to="/configuration/maintain">{{$t('configuration.maintain')}}</router-link></a-menu-item>
        <a-menu-item key="5" v-if="!!(operation&64)"><router-link to="/configuration/update">{{$t('configuration.upgrade')}}</router-link></a-menu-item>
        <a-menu-item key="6" v-if="showPtz"><router-link to="/configuration/ptzconfig">{{$t('configuration.ptzconfigt')}}</router-link></a-menu-item>
        <a-menu-item key="7" v-if="showRs485"><router-link to="/configuration/rs485">{{$t('configuration.rsconfigt')}}</router-link></a-menu-item>
        <a-menu-item key="8"><router-link to="/configuration/information">{{$t('configuration.information')}}</router-link></a-menu-item>
        <a-menu-item key="9"><router-link to="/configuration/log">{{$t('configuration.log')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/network.png" /><span>{{$t('configuration.network')}}</span>
        </template>
        <a-menu-item key="10" v-if="!!(config&2)"><router-link to="/configuration/tcpip">{{$t('configuration.tcpip')}}</router-link></a-menu-item>
        <a-menu-item key="11" v-if="!!(config&2)"><router-link to="/configuration/port">{{$t('guide.port')}}</router-link></a-menu-item>
        <a-menu-item key="12" v-if="!!(config&2)"><router-link to="/configuration/wifi">{{$t('configuration.wifi')}}</router-link></a-menu-item>
        <a-menu-item key="13" v-if="!!(config&2)"><router-link to="/configuration/pppoe">{{$t('configuration.pppoe')}}</router-link></a-menu-item>
        <a-menu-item key="14" v-if="!!(config&2)"><router-link to="/configuration/smtp">{{$t('configuration.smtp')}}</router-link></a-menu-item>
        <a-menu-item key="15" v-if="!!(config&2)"><router-link to="/configuration/upnp">{{$t('configuration.upnp')}}</router-link></a-menu-item>
        <a-menu-item key="16" v-if="!!(config&2)"><router-link to="/configuration/ddns">{{$t('configuration.ddns')}}</router-link></a-menu-item>
        <a-menu-item key="17" v-if="!!(config&2)"><router-link to="/configuration/rtsp">{{$t('configuration.rtsp')}}</router-link></a-menu-item>
        <a-menu-item key="18" v-if="!!(config&2)"><router-link to="/configuration/rtmp">{{$t('configuration.rtmp')}}</router-link></a-menu-item>
        <a-menu-item key="19" v-if="!!(config&2)"><router-link to="/configuration/snmp">SNMP</router-link></a-menu-item>
        <a-menu-item key="20" v-if="!!(config&2)"><router-link to="/configuration/ieee">IEEE 802.1x</router-link></a-menu-item>
        <a-menu-item key="21"><router-link to="/configuration/trcloud">Trassir Cloud</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/video.png" /><span>{{$t('configuration.avsetting')}}</span>
        </template>
        <a-menu-item key="22" v-if="!!(config&4)"><router-link to="/configuration/audio">{{$t('configuration.audio')}}</router-link></a-menu-item>
        <a-menu-item key="23" v-if="!!(config&8)"><router-link to="/configuration/video">{{$t('configuration.video')}}</router-link></a-menu-item>
        <a-menu-item key="24" v-if="!!(config&8)"><router-link to="/configuration/snapshot">{{$t('preview.snapshot')}}</router-link></a-menu-item>
        <a-menu-item key="25" v-if="!!(config&8)"><router-link to="/configuration/osd">{{$t('configuration.osd')}}</router-link></a-menu-item>
        <a-menu-item key="26" v-if="!!(config&8)"><router-link to="/configuration/imagesetting">{{$t('configuration.imagesetting')}}</router-link></a-menu-item>
        <a-menu-item key="27" v-if="!!(config&8)"><router-link to="/configuration/privacymask">{{$t('configuration.privacymask')}}</router-link></a-menu-item>
        <a-menu-item key="28" v-if="!!(config&8)"><router-link to="/configuration/roi">{{$t('configuration.roi')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/storage.png" /><span>{{$t('configuration.storage')}}</span>
        </template>
        <a-menu-item key="29" v-if="!!(operation&16)"><router-link to="/configuration/localsetting">{{$t('configuration.localsetting')}}</router-link></a-menu-item>
        <a-menu-item key="30" v-if="!!(operation&16)"><router-link to="/configuration/disk">{{$t('configuration.disk')}}</router-link></a-menu-item>
        <a-menu-item key="31" v-if="!!(config&2)"><router-link to="/configuration/ftp">{{$t('configuration.ftp')}}</router-link></a-menu-item>
        <a-menu-item key="32" v-if="!!(config&2)"><router-link to="/configuration/nfs">NFS</router-link></a-menu-item>
        <a-menu-item key="33" v-if="!!(config&32)"><router-link to="/configuration/schedule">{{$t('common.schedule')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub5">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/event.png" /><span>{{$t('configuration.event')}}</span>
        </template>
        <a-menu-item key="34" v-if="!!(config&16)"><router-link to="/configuration/motiondetect">{{$t('configuration.motion')}}</router-link></a-menu-item>
        <a-menu-item key="35" v-if="!!(config&16)"><router-link to="/configuration/ioalarm">{{$t('configuration.ioalarm')}}</router-link></a-menu-item>
        <a-menu-item key="36" v-if="!!(config&16)"><router-link to="/configuration/pir">{{$t('configuration.pir')}}</router-link></a-menu-item>
        <a-menu-item key="37" v-if="!!(config&16)"><router-link to="/configuration/abnormality">{{$t('configuration.abnormality')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub6">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/security.png" /><span>{{$t('configuration.security')}}</span>
        </template>
        <span slot="title"></span>
        <a-menu-item key="38" v-if="!!(config&64)"><router-link to="/configuration/user">{{$t('configuration.user')}}</router-link></a-menu-item>
        <a-menu-item key="39"><router-link to="/configuration/ipfilter">{{$t('configuration.ipfilter')}}</router-link></a-menu-item>
        <a-menu-item key="40"><router-link to="/configuration/telnet">Telnet</router-link></a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { Layout, Menu } from 'ant-design-vue';
const { SubMenu, Item } = Menu;
export default {
  data() {
    return {
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3','sub4', 'sub5', 'sub6'],
      openKeys: [],
      config: 0,
      operation: 0,
      showPtz: true,
      showRs485: true
    };
  },
  components:{ ASubMenu:SubMenu, AMenuItem:Item, ALayoutSider:Layout.Sider, AMenu:Menu},
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
  mounted(){
    let username = localStorage.getItem("user");
    if(username != null){
      this.$getAPI("/action/get?subject=user&name=" + username).then((res) => {
        this.config = parseInt(res.response.user.permit.config);
        this.operation = parseInt(res.response.user.permit.operation);
      });
    }
    this.$getAPI("/action/get?subject=devability").then((res) => {
      this.showPtz = (parseInt(res.response.devability.ptz) & 0x4) ? true:false;
      this.showRs485 = parseInt(res.response.devability.serial)<=0 ? false:true;
    });
  }
};
</script>
<style lang="scss" scoped>
.siderImg{
  width: 22px;
  height: 22px;
  margin: 0 20px 0 0;
}
</style>