<template>
  <div style="margin-left: 40px">
    <div class="navTitle">{{ $t("configuration.log") }}</div>
    <div class="subcontent">
      <p v-for="val in arr" :key="val.id">{{ val }}</p>
    </div>
    <div style="margin: 10px 0 0 12px">
      <button class="commonBtn" @click="getparam">
        {{ $t("common.refresh") }}
      </button>
      <button class="commonBtn" @click="download">
        {{ $t("common.download") }}
      </button>
    </div>
    <a id="link" style="visibility: hidden"></a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [],
    };
  },
  mounted() {
    this.getparam();
  },
  methods: {
    getparam() {
      this.$get("/action/log").then((res) => {
        this.arr = res.data.split("\n");
      });
    },
    download() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        let targetwndname = "savelogfile";
        let wnd = window.open("", targetwndname);
        let link = document.getElementById("link");
        link.target = targetwndname;
        link.href = "http://" + document.location.host + "/action/log";
        link.click();
        wnd.document.onreadystatechange(this.show(wnd));
      } else {
        let wnd = window.open(
          "http://" + document.location.host + "/action/log"
        );
        wnd.document.execCommand("SaveAs", false, "ipclog.txt");
      }
    },
    show(wnd){
        if (wnd.document.readyState == "complete") {
            wnd.document.execCommand("SaveAs", true, "ipclog.txt");
            wnd.close();
        } else {
            setTimeout(this.show(wnd), 500);
        }
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
.subcontent {
  color: #7f7f7f;
  margin: 8px 0 0 12px;
  padding-left: 12px;
  font-size: 12px;
  width: 840px;
  height: 550px;
  overflow-y: auto;
  background-color: #f1f1f1;
  p {
    margin: 0;
  }
}
.commonBtn {
  width: 170px;
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
.commonBtn:hover {
  background-color: #a9403d;
  border: 1px solid #bb131a;
}
</style>