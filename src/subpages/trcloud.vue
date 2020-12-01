<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('upnp.trcloudtitle')}}</div>
    <div style="margin:10px 0 0 5px;">
      <input id="entrcloud" type="checkbox" :checked="enable" @change="onChange">
      <label for="entrcloud">{{$t("common.enable")}}</label>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('upnp.idletime')}}</div>
      <input class="commonWidth" maxlength="3" v-model="idletime" :disabled="!enable" v-num/>
      <div class="lableStyle">{{$t('dt.minute')}}</div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('dt.status')}}</div>
      <div class="lableStyle">{{status}}</div>
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
      idletime: '0',
      status: ''
    };
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.enable = false;
      this.idletime = "1440";
      this.status = "";
    },
    getparam() {
      this.$getAPI("/action/get?subject=dsslcloud").then(res=>{
        this.enable = res.response.dsslcloud.active==1 ? true:false;
        this.idletime = res.response.dsslcloud.idletime;
        this.status = res.response.dsslcloud.status;
      });
    },
    saveparam() {
      let active  = this.enable ? 1:0;
      let object = {
        request: {
          dsslcloud: {
            active: active,
            idletime: this.idletime,
            status: this.status
          }
        },
      };
      this.$postAPI("/action/set?subject=dsslcloud", object, true);
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