<template>
  <div class="sideContent">
    <div class="navTitle">NFS</div>
    <div style="margin:10px 0 0 5px;">
      <input id="ennfs" type="checkbox" :checked="enable" @change="onChange">
      <label for="ennfs">{{$t("common.enable")}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ftp.serveraddr')}}</div>
      <input class="commonWidth" v-model="host" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('ftp.remotepath')}}</div>
      <input class="commonWidth" v-model="rpath" :disabled="!enable" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('dt.status')}}</div>
      <div style="color:#7f7f7f;">{{status}}</div>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enable: false,
      host: '',
      rpath: '',
      status: ''
    };
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable = false;
      this.host = "";
      this.status = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=nfs").then(res=>{
        this.enable = res.response.nfs.active==1 ? true:false;
        this.host = res.response.nfs.host;
        this.rpath = res.response.nfs.path;
      });
      this.$getAPI("/action/get?subject=diskinfo&id=1").then(res=>{
        let mask = res.response.diskinfo.status;
        if (mask & 1) {
          if (mask & 2 && !(mask & 4) && !(mask & 8)) {
            this.status = this.$t('ftp.stamounted');
          } else if (mask & 2 && !(mask & 4) && (mask & 8)) {
            this.status = this.$t('disk.abnormal');
          } else if (mask & 2 && mask & 4) {
            this.status = this.$t('disk.full');
          } else if (!(mask & 2)) {
            this.status = this.$t('ftp.staumount');
          }
        } else {
          this.status = this.$t('ftp.staumount');
        }
      });
    },
    saveparam() {
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          nfs: {
            active: active,
            host: this.host,
            path: this.rpath
          }
        },
      };
      this.$postAPI("/action/set?subject=nfs", object, true);
    },
    onChange(){
      this.enable = !this.enable;
    }
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