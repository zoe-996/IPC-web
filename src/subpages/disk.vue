<template>
  <div style="margin-left:30px;">
    <div class="navTitle">{{$t('configuration.disk')}}</div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('dt.status')}}</div>
      <div class="lableStyle" id="statusvalue"></div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('disk.formatted')}}</div>
      <div class="lableStyle" id="formatvalue"></div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('disk.usage')}}</div>
      <div class="canvasBox">
        <div style="width: 320px;height: 320px;">
          <canvas id="canvas"></canvas>
        </div>
        <div style="margin:35px 0 0 35px;display: flex;align-items:center;">
          <div style="width: 14px;height: 14px;background-color: #97b9e0;display:inline-block;margin:0 4px 0 0;"></div>
          <span>{{usagestr}}</span>
          <div style="width: 14px;height: 14px;background-color: #5089bc;display:inline-block;margin:0 4px 0 50px;"></div>
          <span>{{totalstr}}</span>
        </div>
      </div>
    </div>
    <a-modal v-model="visible" :title="$t('disk.formatting')" :closable="false" :maskClosable="false" centered :footer="null" :keyboard="false">
      <div style="width:100%;height:100%;display:flex;">
        <img src="../assets/subimg/wait.gif" style="margin:0 auto;">
      </div>
    </a-modal>
    <div>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam" :disabled="disformat">{{$t('disk.format')}}</button>
    </div>
  </div>
</template>
<script>
import { Modal, message } from "ant-design-vue";
export default {
  data() {
    return {
      canvasctx: null,
      usagePercent: 10,
      disformat: false,
      usagestr: '',
      totalstr: '',
      visible: false
    };
  },
  components:{
    AModal:Modal
  },
  mounted() {
    let canvas_obj = document.getElementById("canvas");
    this.canvasctx = canvas_obj.getContext("2d");
    canvas_obj.width = 320;
    canvas_obj.height = 320;
    this.canvasctx.lineWidth = 1;
    this.getparam();
  },
  methods: {
    draw(){
      this.canvasctx.clearRect(0,0,320,320);
      this.canvasctx.beginPath();
      this.canvasctx.arc(160,160,160,0,2*Math.PI);
      this.canvasctx.closePath();
      this.canvasctx.fillStyle = "#5089bc";
      this.canvasctx.fill();
      this.canvasctx.beginPath();
      this.canvasctx.moveTo(160,160);
      this.canvasctx.arc(160,160,160,Math.PI,((Math.PI*2)/100)*(this.usagePercent+50));
      this.canvasctx.closePath();
      this.canvasctx.fillStyle = "#97b9e0";
      this.canvasctx.fill();
      this.canvasctx.strokeStyle = "black";
      this.canvasctx.stroke();
    },
    getparam() {
      this.$getAPI("/action/get?subject=diskinfo&id=0").then(res=>{
        let status = parseInt(res.response.diskinfo.status);
        if (status & 1) {
          if ((status&2) && !(status&4) && !(status&8)) {
            document.getElementById("statusvalue").innerText = this.$t('disk.normal');
            document.getElementById("formatvalue").innerText = this.$t('common.yes');
          } else if ((status&2) && !(status&4) && (status&8)) {
            document.getElementById("statusvalue").innerText = this.$t('disk.abnormal');
            document.getElementById("formatvalue").innerText = this.$t('common.yes');
          } else if ((status&2) && (status&4)) {
            document.getElementById("statusvalue").innerText = this.$t('disk.full');
            document.getElementById("formatvalue").innerText = this.$t('common.yes');
          } else if (!(status&2)) {
            document.getElementById("statusvalue").innerText = this.$t('disk.installed');
            document.getElementById("formatvalue").innerText = this.$t('common.no');
          }
        } else {
          document.getElementById("statusvalue").innerText = this.$t('disk.nodisk');
          document.getElementById("formatvalue").innerText = this.$t('common.no');
          this.disformat = true;
        }
        let total = res.response.diskinfo.size;
        let usage = res.response.diskinfo.free;
        let strused = this.$t('disk.usedsize');
        let strtotal = this.$t('disk.unusedsize');
        if (total > 0) {
          this.usagePercent = parseInt(((total - usage) * 100) / total);
          this.usagestr = String(((total - usage) / 1073741824).toFixed(2)) + "GB(" + String(this.usagePercent) + "%) " + strused;
          this.totalstr = String((usage / 1073741824).toFixed(2)) + "GB(" + String(100 - this.usagePercent) + "%) " + strtotal;
        } else {
          this.usagePercent = 0;
          this.usagestr = "0GB(0%) " + strused;
          this.totalstr = "0GB(0%) " + strtotal;
        }
        this.draw();
      });
    },
    saveparam() {
      let that = this;
      Modal.confirm({
        centered: true,
        content: this.$t('disk.formatips'),
        onOk() {
          that.postData()
        },
        onCancel() {},
      });
    },
    postData(){
      let tagxml = '<?xml version="1.0" encoding="utf-8"?>' + '<request>' + '    <diskfmt>' + '         <disk>0</disk>' + '         <fmt>0</fmt>' + '    </diskfmt>' + '</request>';
      this.visible = true;
      this.$post("/action/set?subject=diskfmt", tagxml).then(()=>{
        this.visible = false;
        message.success(this.$t('disk.formatsuc'));
      }).catch(()=>{
        message.error(this.$t('disk.formatfai'));
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.navTitle {
  width: 700px;
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
  background: #c9c9c9;
  color: #428eb4;
  font-weight: bold;
  font-size: 15px;
}
.lineSpacing{
  padding-top: 8px;
  width: 100%;
  font-size: 13px;
  .textWidth{
    width: 108px;
    display: inline-block;
  }
  .lableStyle{
    color:#7f7f7f;
    font-size: 13px;
    display: inline-block;
  }
}
.canvasBox{
  width: 660px;
  height: 460px;
  margin: 10px 0;
  padding: 50px 0 0 168px;
  background-color: #eeeeee;
}
.commonBtn{
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
.commonBtn:hover{
  background-color: #a9403d;
  border: 1px solid #bb131a;
}
.commonBtn:disabled{
  background-color: #949494;
  border: 1px solid #949494;
  color: #2c2c2c;
  cursor: default;
}
</style>