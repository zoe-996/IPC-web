<template>
<div style="display:inline-block;margin:0 6px;">
  <ul class="box">
    <li>
      <input ref="input1" class="inputClass" :disabled="isDisabled" type="text" :maxlength="2" v-model="hour" @input="checkHourVal" @blur="getHourValue" @keyup="turnFocus(1)">
      <div>:</div>
    </li>
    <li>
      <input ref="input2" class="inputClass" :disabled="isDisabled" type="text" :maxlength="2" v-model="minute" @input="checkMinuteVal" @blur="getMinuteValue" @keyup="turnFocus(2)">
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    isDisabled:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      hour: '',
      minute: ''
    }
  },
  watch: {
    value:  {
      immediate: true,
      handler (val) {
        let h = parseInt(val / 3600);
        let m = parseInt((val % 3600) / 60);
        this.hour = h > 9 ? h : ("0" + String(h));
        this.minute = m > 9 ? m : ("0" + String(m));
      }
    }
  },
  methods: {
    checkHourVal() {
      let value = this.hour.toString().replace(/[^0-9]/g, "");
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = 0;
      }
      this.hour = value >= 24 ? 23 : value;
    },
    checkMinuteVal() {
      let value = this.minute.toString().replace(/[^0-9]/g, "");
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = 0;
      }
      this.minute = value > 59 ? 59 : value;
    },
    getHourValue(){
      let value = parseInt(this.hour, 10);
      this.hour = value < 10 ? "0" + value : value;
      this.returnTime();
    },
    getMinuteValue(){
      let value = parseInt(this.minute, 10);
      this.minute = value < 10 ? "0" + value : value;
      this.returnTime();
    },
    turnFocus(n) {
      if (n===1 && String(this.hour).length >= 2) {
        this.$refs.input2.focus();
        this.$refs.input2.select();
      }
      if (n===2 && String(this.minute).length >= 2) {
        this.$refs.input1.focus();
        this.$refs.input1.select();
      }
    },
    returnTime() {
      let h = parseInt(this.hour, 10);
      let m = parseInt(this.minute, 10);
      let seconds = h * 3600 + m * 60;
      this.$emit('getTime', seconds);
    },
  },
};
</script>
<style type="text/css" scoped>
.box {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  width: 100px;
  height: 24px;
  padding-inline-start: 0px;
  margin:0;
}
.box li {
  position: relative;
  height: 23px;
  margin: 0;
  list-style-type: none;
}
.inputClass {
  border: none;
  width: 49px;
  height: 22px;
  color:black;
  font-size: 14px;
  text-align: center;
  background: transparent;
}
.inputClass:disabled{
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
.box li div {
  position: absolute;
  bottom: 2px;
  right: 0;
}
.box input:focus {
  outline: none;
}
</style>
