<template>
  <a-layout-sider :style="{ minWidth:0,flexBasis:'2.2rem'}">
    <a-menu mode="inline" :open-keys="openKeys" style="width: 2.2rem" @openChange="onOpenChange">
      <a-menu-item key="1">
        <router-link to="/configuration">
          <img class="siderImg" src="../assets/img/information.png" /><span>{{$t('configuration.basesetting')}}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="sub1">
         <template v-slot:title>
          <img class="siderImg" src="../assets/img/system.png" /><span>{{$t('configuration.system')}}</span>
        </template>
        <a-menu-item key="2"><router-link to="/configuration/general">{{$t('configuration.general')}}</router-link></a-menu-item>
        <a-menu-item key="3"><router-link to="/configuration/datetime">{{$t('configuration.datetime')}}</router-link></a-menu-item>
        <a-menu-item key="4"><router-link to="/configuration/maintain">{{$t('configuration.maintain')}}</router-link></a-menu-item>
        <a-menu-item key="5"><router-link to="/configuration/update">{{$t('configuration.upgrade')}}</router-link></a-menu-item>
        <a-menu-item key="6"><router-link to="/configuration/ptzconfig">{{$t('configuration.ptzconfigt')}}</router-link></a-menu-item>
        <a-menu-item key="7"><router-link to="/configuration/rs485">{{$t('configuration.rsconfigt')}}</router-link></a-menu-item>
        <a-menu-item key="8"><router-link to="/configuration/information">{{$t('configuration.information')}}</router-link></a-menu-item>
        <a-menu-item key="9"><router-link to="/configuration/log">{{$t('configuration.log')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/network.png" /><span>{{$t('configuration.network')}}</span>
        </template>
        <a-menu-item key="10"><router-link to="/configuration/tcpip">{{$t('configuration.tcpip')}}</router-link></a-menu-item>
        <a-menu-item key="11"><router-link to="/configuration/port">{{$t('guide.port')}}</router-link></a-menu-item>
        <a-menu-item key="12"><router-link to="/configuration/wifi">{{$t('configuration.wifi')}}</router-link></a-menu-item>
        <a-menu-item key="13"><router-link to="/configuration/pppoe">{{$t('configuration.pppoe')}}</router-link></a-menu-item>
        <a-menu-item key="14"><router-link to="/configuration/smtp">{{$t('configuration.smtp')}}</router-link></a-menu-item>
        <a-menu-item key="15"><router-link to="/configuration/upnp">{{$t('configuration.upnp')}}</router-link></a-menu-item>
        <a-menu-item key="16"><router-link to="/configuration/ddns">{{$t('configuration.ddns')}}</router-link></a-menu-item>
        <a-menu-item key="17"><router-link to="/configuration/rtsp">{{$t('configuration.rtsp')}}</router-link></a-menu-item>
        <a-menu-item key="18"><router-link to="/configuration/rtmp">{{$t('configuration.rtmp')}}</router-link></a-menu-item>
        <a-menu-item key="19"><router-link to="/configuration/snmp">SNMP</router-link></a-menu-item>
        <a-menu-item key="20"><router-link to="/configuration/ieee">IEEE 802.1x</router-link></a-menu-item>
        <a-menu-item key="21"><router-link to="/configuration/trcloud">Trassir Cloud</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/video.png" /><span>{{$t('configuration.avsetting')}}</span>
        </template>
        <a-menu-item key="22"><router-link to="/configuration/audio">{{$t('configuration.audio')}}</router-link></a-menu-item>
        <a-menu-item key="23"><router-link to="/configuration/video">{{$t('configuration.video')}}</router-link></a-menu-item>
        <a-menu-item key="24"><router-link to="/configuration/snapshot">{{$t('preview.snapshot')}}</router-link></a-menu-item>
        <a-menu-item key="25"><router-link to="/configuration/osd">{{$t('configuration.osd')}}</router-link></a-menu-item>
        <a-menu-item key="26"><router-link to="/configuration/imagesetting">{{$t('configuration.imagesetting')}}</router-link></a-menu-item>
        <a-menu-item key="27"><router-link to="/configuration/privacymask">{{$t('configuration.privacymask')}}</router-link></a-menu-item>
        <a-menu-item key="28"><router-link to="/configuration/roi">{{$t('configuration.roi')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/storage.png" /><span>{{$t('configuration.storage')}}</span>
        </template>
        <a-menu-item key="29"><router-link to="/configuration/localsetting">{{$t('configuration.localsetting')}}</router-link></a-menu-item>
        <a-menu-item key="30"><router-link to="/configuration/disk">{{$t('configuration.disk')}}</router-link></a-menu-item>
        <a-menu-item key="31"><router-link to="/configuration/ftp">{{$t('configuration.ftp')}}</router-link></a-menu-item>
        <a-menu-item key="32"><router-link to="/configuration/nfs">NFS</router-link></a-menu-item>
        <a-menu-item key="33"><router-link to="/configuration/schedule">{{$t('common.schedule')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub5">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/event.png" /><span>{{$t('configuration.event')}}</span>
        </template>
        <a-menu-item key="34"><router-link to="/configuration/motiondetect">{{$t('configuration.motion')}}</router-link></a-menu-item>
        <a-menu-item key="35"><router-link to="/configuration/ioalarm">{{$t('configuration.ioalarm')}}</router-link></a-menu-item>
        <a-menu-item key="36"><router-link to="/configuration/pir">{{$t('configuration.pir')}}</router-link></a-menu-item>
        <a-menu-item key="37"><router-link to="/configuration/abnormality">{{$t('configuration.abnormality')}}</router-link></a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub6">
        <template v-slot:title>
          <img class="siderImg" src="../assets/img/security.png" /><span>{{$t('configuration.security')}}</span>
        </template>
        <span slot="title"></span>
        <a-menu-item key="38"><router-link to="/configuration/user">{{$t('configuration.user')}}</router-link></a-menu-item>
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
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3','sub4', 'sub5', 'sub6','sub7'],
      openKeys: ['2'],
      collapsed:false
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
    setTimeout(()=>{
      this.collapsed = !this.collapsed
    },1000)
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