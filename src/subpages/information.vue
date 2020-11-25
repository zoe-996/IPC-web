<template>
  <div style="margin-left: 40px; width: 100%; height: 100%">
    <div class="navTitle">{{ $t("configuration.information") }}</div>
    <div style="float: left; margin: 8px">
      <div class="commonTitle">{{ $t("information.sysoverview") }}</div>
      <div>
        <div class="item">
          <div class="name">{{ $t("information.firmver") }}</div>
          <div class="value">{{ firmver }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.hardver") }}</div>
          <div class="value">{{ hardver }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.onvifver") }}</div>
          <div class="value">V2.6</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.mac") }}</div>
          <div class="value">{{ mac }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.sn") }}</div>
          <div class="value">{{ sn }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("tcpip.ipaddr") }}</div>
          <div class="value">{{ ipaddr }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.datetime") }}</div>
          <div class="value">{{ datetime }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.uptime") }}</div>
          <div class="value">{{ uptime }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.timemode") }}</div>
          <div class="value">{{ timemode }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.cpu") }}</div>
          <div class="value">{{ cpu }}</div>
        </div>
      </div>
    </div>
    <div style="float: left; margin: 8px">
      <div class="commonTitle">{{ $t("information.sysstatus") }}</div>
      <div>
        <div class="item">
          <div class="name">{{ $t("information.video") }}</div>
          <div class="value">{{ video }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.audio") }}</div>
          <div class="value">{{ audio }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.ftp") }}</div>
          <div class="value">{{ ftp }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.upnp") }}</div>
          <div class="value">{{ upnp }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.rtsp") }}</div>
          <div class="value">{{ rtsp }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.recording") }}</div>
          <div class="value">{{ record }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.snapshot") }}</div>
          <div class="value">{{ snapshot }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.tcp") }}</div>
          <div class="value">{{ tcp }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.ddns") }}</div>
          <div class="value">{{ ddns }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t("information.onvif") }}</div>
          <div class="value">{{ onvif }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firmver: "",
      hardver: "",
      mac: "",
      sn: "",
      ipaddr: "",
      datetime: "",
      uptime: "",
      timemode: "",
      cpu: "",
      video: "",
      audio: "",
      ftp: "",
      upnp: "",
      rtsp: "",
      record: "",
      snapshot: "",
      tcp: "",
      ddns: "",
      onvif: "",
      T: null,
      second: ""
    };
  },
  mounted() {
    let datefmt;
    let timefmt;
    this.$getAPI("/action/get?subject=devpara").then((res) => {
      datefmt = res.response.devpara.datefmt;
      timefmt = res.response.devpara.timefmt;
    });
    this.$getAPI("/action/get?subject=devinfo").then((res) => {
      this.firmver = res.response.devinfo.softver;
      this.hardver = res.response.devinfo.hardver;
      this.sn = res.response.devinfo.seqno;
    });
    this.$getAPI("/action/get?subject=network&adapter=0").then((res) => {
      this.mac = res.response.network.mac;
      this.ipaddr = res.response.network.ipv4.ip;
    });
    this.$getAPI("/action/get?subject=systime").then((res) => {
      this.datetime = res.response.systime.datetime;
      let arrdate = this.datetime.split("T")[0].split("-");
      let arrtime = this.datetime.split("T")[1].split(":");
      this.second = parseInt(arrtime[0]) * 3600 + parseInt(arrtime[1]) * 60 + parseInt(arrtime[2]);
      if (res.response.systime.mode == "0") {
        this.timemode = this.$t("information.timemanual");
      } else {
        this.timemode = this.$t("information.timesyncntp");
      }
      this.T = setInterval(() => {
        this.sync(arrdate, datefmt, timefmt);
      }, 1000);
    });
    this.$getAPI("/action/get?subject=sysstatus").then((res) => {
      this.cpu = res.response.systemstat.cpu + "%";
      let runtime = res.response.systemstat.uptime;
      this.uptime = parseInt(runtime / 3600) + ":" + parseInt((runtime % 3600) / 60) + ":" + parseInt(runtime % 60);
      let en = this.$t("common.enabled");
      let ds = this.$t("common.disabled");
      if (res.response.systemstat.video == 1) {
        this.video = en;
      } else {
        this.video = ds;
      }
      if (res.response.systemstat.audio == 1) {
        this.audio = en;
      } else {
        this.audio = ds;
      }
      if (res.response.systemstat.ftp == 1) {
        this.ftp = en;
      } else {
        this.ftp = ds;
      }
      if (res.response.systemstat.upnp == 1) {
        this.upnp = en;
      } else {
        this.upnp = ds;
      }
      if (res.response.systemstat.rtsp == 1) {
        this.rtsp = en;
      } else {
        this.rtsp = ds;
      }
      if (res.response.systemstat.record == 1) {
        this.record = en;
      } else {
        this.record = ds;
      }
      if (res.response.systemstat.snap == 1) {
        this.snapshot = en;
      } else {
        this.snapshot = ds;
      }
      if (res.response.systemstat.tcp == 1) {
        this.tcp = en;
      } else {
        this.tcp = ds;
      }
      if (res.response.systemstat.ddns == 1) {
        this.ddns = en;
      } else {
        this.ddns = ds;
      }
      if (res.response.systemstat.onvif == 1) {
        this.onvif = en;
      } else {
        this.onvif = ds;
      }
    });
  },
  methods: {
    sync(date, datefmt, timefmt) {
      this.$getAPI("/action/get?subject=sysstatus").then((res) => {
        this.cpu = res.response.systemstat.cpu + "%";
        let runtime = res.response.systemstat.uptime;
        this.uptime = parseInt(runtime / 3600) + ":" + parseInt((runtime % 3600) / 60) + ":" + parseInt(runtime % 60);
      });
      this.second++;
      let strdate;
      let strtime;
      let h = parseInt(this.second / 3600);
      let m = parseInt((this.second % 3600) / 60);
      let s = parseInt(this.second % 60);
      let strh = h > 9 ? String(h) : "0" + String(h);
      let strm = m > 9 ? String(m) : "0" + String(m);
      let strs = s > 9 ? String(s) : "0" + String(s);
      if (datefmt == 0) {
        strdate = date[0] + "-" + date[1] + "-" + date[2];
      } else if (datefmt == 1) {
        strdate = date[1] + "-" + date[2] + "-" + date[0];
      } else if (datefmt == 2) {
        strdate = date[2] + "-" + date[1] + "-" + date[0];
      }
      if (timefmt == 0) {
        strtime = strh + ":" + strm + ":" + strs;
      } else {
        if (h >= 12) {
          strh = h - 12 > 9 ? String(h - 12) : "0" + String(h - 12);
          strtime = strh + ":" + strm + ":" + strs + "PM";
        } else {
          strtime = strh + ":" + strm + ":" + strs + "AM";
        }
      }
      this.datetime = strdate + " T " + strtime;
    },
  },
  destroyed() {
    if (this.T != null) {
      clearInterval(this.T);
    }
  },
};
</script>
<style lang="scss" scoped>
.navTitle {
  width: 870px;
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
  background: #c9c9c9;
  color: #428eb4;
  font-weight: bold;
  font-size: 14px;
}
.commonTitle {
  width: 420px;
  height: 28px;
  line-height: 28px;
  background-color: #c9c9c9;
  font-size: 14px;
  padding-left: 10px;
  color: black;
}
.item {
  width: 420px;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  .name {
    color: black;
    width: 170px;
    display: inline-block;
    padding-left: 10px;
  }
  .value {
    color: #7f7f7f;
    display: inline-block;
  }
}
</style>