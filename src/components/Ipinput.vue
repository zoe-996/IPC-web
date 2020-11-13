<template>
<div style="display:inline-block;">
  <ul class="ipAdress">
    <li>
      <input ref="ipInput1" class="ipInputClass" :disabled="isDisabled" type="text" :maxlength="3" v-model="ipv1" @input="checkIpVal(1)" @keyup="turnIpPosition(1, $event)">
      <div></div>
    </li>
    <li>
      <input ref="ipInput2" class="ipInputClass" :disabled="isDisabled" type="text" :maxlength="3" v-model="ipv2" @input="checkIpVal(2)" @keyup="turnIpPosition(2, $event)">
      <div></div>
    </li>
    <li>
      <input ref="ipInput3" class="ipInputClass" :disabled="isDisabled" type="text" :maxlength="3" v-model="ipv3" @input="checkIpVal(3)" @keyup="turnIpPosition(3, $event)">
      <div></div>
    <li>
      <input ref="ipInput4" class="ipInputClass" :disabled="isDisabled" type="text" :maxlength="3" v-model="ipv4" @input="checkIpVal(4)" @keyup="turnIpPosition(4, $event)">
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    isDisabled:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      ipv1: '',
      ipv2: '',
      ipv3: '',
      ipv4: ''
    }
  },
  watch: {
    value:  {
      immediate: true,
      handler (val) {
        if(val && val.length > 0 && val.includes('.')){
          let valArr = val.split(".");
          this.ipv1 = valArr[0];
          this.ipv2 = valArr[1];
          this.ipv3 = valArr[2];
          this.ipv4 = valArr[3];
        }else{
          this.ipv1 = this.ipv2 = this.ipv3 = this.ipv4 = '';
        }
      }
    }
  },
  methods: {
    transform(val){
      let value = val.toString().replace(/[^0-9]/g, "");
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = "";
      } else {
        value = value < 0 ? 0 : value;
        value = value > 255 ? 255 : value;
      }
      return value
    },
    checkIpVal(n) {
      if(n==1){
        this.ipv1 = this.transform(this.ipv1);
      }else if(n==2){
        this.ipv2 = this.transform(this.ipv2);
      }else if(n==3){
        this.ipv3 = this.transform(this.ipv3);
      }else if(n==4){
        this.ipv4 = this.transform(this.ipv4);
      }
      this.returnIpInfo();
    },
    turnIpPosition(n, event) {
      let e = event || window.event;
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 190) {
        switch (n) {
          case 1:
              this.$refs.ipInput2.focus()
            break
          case 2:
              this.$refs.ipInput3.focus()
            break
          case 3:
              this.$refs.ipInput4.focus()
            break
          case 4:
              this.$refs.ipInput1.focus()
            break
        }
      }
    },
    returnIpInfo() {
      let ipInfo = this.ipv1 + '.'  + this.ipv2 + '.' + this.ipv3 + '.' + this.ipv4;
      if(this.ipv1=='' && this.ipv2=='' && this.ipv3=='' && this.ipv4==''){
        ipInfo = '';
      }
      this.$emit('getIp', ipInfo);
    },
  },
};
</script>
<style type="text/css" scoped>
.ipAdress {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  width: 184px;
  height: 24px;
  padding-inline-start: 0px;
  margin:0;
}
.ipAdress li {
  position: relative;
  height: 24px;
  margin: 0;
  list-style-type: none;
}
.ipInputClass {
  border: none;
  width: 46px;
  height: 23px;
  color:black;
  font-size: 14px;
  text-align: center;
  background: transparent;
}
.ipInputClass:disabled{
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
}
.ipAdress li div {
  position: absolute;
  bottom: 8px;
  right: 0;
  border-radius: 50%;
  background: #505050;
  width: 2px;
  height: 2px;
}
.ipAdress input:focus {
  outline: none;
}
</style>
