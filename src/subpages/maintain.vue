<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.maintain')}}</div>
    <div>
      <div class="commonTitle">{{$t('maintain.autoreboot')}}</div>
      <div style="margin:15px 0 0 30px;font-size:14px;">
        <a-checkbox :checked="rebootcheck" @change="onCheck">{{$t('maintain.autoreboot')}}</a-checkbox>
        <select v-model="selectValue" :disabled="!rebootcheck" style="width: 120px;margin:0 20px;">
          <option value="1">{{$t('maintain.everyday')}}</option>
          <option value="2">{{$t('dt.weekdays.monday')}}</option>
          <option value="3">{{$t('dt.weekdays.tuesday')}}</option>
          <option value="4">{{$t('dt.weekdays.wednesday')}}</option>
          <option value="5">{{$t('dt.weekdays.thursday')}}</option>
          <option value="6">{{$t('dt.weekdays.friday')}}</option>
          <option value="7">{{$t('dt.weekdays.saturday')}}</option>
          <option value="8">{{$t('dt.weekdays.sunday')}}</option>
        </select>
        <a-time-picker v-model="time" :disabled="!rebootcheck" size="small" style="width:100px" />
      </div>
      <div class="buttonGroup">
        <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
        <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
        <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
      </div>
      <div class="commonTitle">{{$t('maintain.devmaintain')}}</div>
      <div class="space">
        <button class="btn" @click="showModal(0)">{{$t('maintain.reboot')}}</button>
        <span style="font-size: 12px;color:#7f7f7f;">{{$t('maintain.notereboot')}}</span>
      </div>
      <div class="space">
        <button class="btn" @click="showModal(2)">{{$t('common.restore')}}</button>
        <span style="font-size: 12px;color:#7f7f7f;">{{$t('maintain.notedefault')}}</span>
      </div>
      <div class="space">
        <button class="btn" @click="showModal(1)">{{$t('maintain.factoryset')}}</button>
        <span style="font-size: 12px;color:#7f7f7f;">{{$t('maintain.noterestore')}}</span>
      </div>
      <div class="commonTitle">{{$t('maintain.import')}}/{{$t('maintain.export')}}</div>
      <div style="margin:10px 0 0 30px;font-size: 12px;color:#7f7f7f;">{{$t('maintain.cfgdeclare')}}</div>
      <div class="buttonGroup">
        <input id="importFile" type="file" @change="onImport" style="display:none;"/>
        <button class="commonBtn" @click="onBrowse">{{$t('maintain.import')}}</button>
        <button class="commonBtn" @click="onExport">{{$t('maintain.export')}}</button>
      </div>
    </div>
    <a id="link" style="visibility: hidden;"></a>
  </div>
</template>
<script>
import { Checkbox, TimePicker, Modal } from "ant-design-vue";
import moment from "moment";
export default {
  data() {
    return {
      rebootcheck: false,
      selectValue: "1",
      time: moment("02:00:00", "HH:mm:ss"),
    };
  },
  components: {
    ACheckbox: Checkbox,
    ATimePicker: TimePicker,
  },
  mounted() {
    this.getparam();
  },
  methods: {
    getStringTime(second) {
      let h = parseInt(second / 3600);
      let m = parseInt((second % 3600) / 60);
      let s = parseInt(second % 60);
      let strh = h > 9 ? String(h) : "0" + String(h);
      let strm = m > 9 ? String(m) : "0" + String(m);
      let strs = s > 9 ? String(s) : "0" + String(s);
      return strh + ":" + strm + ":" + strs;
    },
    onCheck() {
      this.rebootcheck = !this.rebootcheck;
      if (!this.rebootcheck) {
        this.selectValue = "1";
      }
    },
    restore() {
      this.rebootcheck = false;
      this.selectValue = "1";
      this.time = moment("02:00:00", "HH:mm:ss");
    },
    async getparam() {
      let result = await this.$getAPI("/action/get?subject=autoreboot");
      let mode = result.response.autoreboot.mode;
      let t = result.response.autoreboot.time;
      if (mode == 0) {
        this.rebootcheck = false;
        this.selectValue = "1";
      } else {
        this.rebootcheck = true;
        this.selectValue = mode;
      }
      this.time = moment(this.getStringTime(t), "HH:mm:ss");
    },
    saveparam() {
      let mode = this.selectValue;
      if (this.rebootcheck == false) {
        mode = 0;
      }
      let second = this.time.hour() * 3600 + this.time.minute() * 60 + this.time.second();
      let object = { request: { autoreboot: { mode: mode, time: second } } };
      this.$postAPI("/action/set?subject=autoreboot", object, true);
    },
    showModal(n) {
      let content = "";
      let object = { request: { maintain: { type: n } } };
      if (n == 0) {
        content = this.$t("maintain.manualreboot");
      } else if (n == 2) {
        content = this.$t("maintain.manualdefault");
      } else if (n == 1) {
        content = this.$t("maintain.manualrestore");
      }
      let that = this;
      Modal.confirm({
        centered: true,
        content: content,
        onOk() {
          that.$postAPI("/action/set?subject=maintain", object, true);
        },
        onCancel() {
          console.log(n);
        },
      });
    },
    onImport() {
      let file = document.getElementById("importFile").files[0];
      let param = new FormData();
      param.append("file", file);
      this.$uploadFile("/action/import", param);
    },
    onBrowse(){
      document.getElementById("importFile").click();
    },
    onExport() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        let targetwndname = "save export";
        let wnd = window.open("", targetwndname);
        let link = document.getElementById("link");
        link.target = targetwndname;
        link.href = "http://" + document.location.host + "/action/export";
        link.click();
        for (; wnd.document.readyState != "complete"; ) {
          if (wnd.document.readyState == "complete") {
            break;
          }
        }
        wnd.close();
      } else {
        let wnd = window.open(
          "http://" + document.location.host + "/action/export"
        );
        wnd.document.execCommand("saveAs", false, "export.bin");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.btn {
  width: 210px;
  height: 28px;
  background-color: #03547c;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-right: 0.08rem;
  border: 1px solid #2c3c4f;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.btn:hover {
  background-color: #a9403d;
  border: 1px solid #bb131a;
}
.space {
  margin: 10px 0 0 30px;
}
</style>