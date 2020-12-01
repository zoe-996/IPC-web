<template>
<div class="box" :class="{'bkcolor':isDisabled}">
  <input class="inputStyle" :type="inputType" :placeholder="text" :maxlength="length" :disabled="isDisabled" v-model="val" @input="onFilter" @keyup="getValue">
  <img class="icon" src="../assets/subimg/eyeclose.png" v-show="eyeclose" @click="onSwitch(0)">
  <img class="icon" src="../assets/subimg/eye.png" v-show="!eyeclose" @click="onSwitch(1)">
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    length: {
      type: String,
      default: '32'
    },
    isDisabled:{
      type: Boolean,
      default: false
    },
    text:{
      type: String,
      default: ''
    }
  },
  watch: {
    value:  {
      immediate: true,
      handler (value) {
        this.val = value;
      }
    }
  },
  data(){
    return {
      eyeclose: true,
      inputType: "password",
      val: ''
    }
  },
  methods: {
    onSwitch(n){
      if(this.$props.isDisabled){
        return;
      }
      this.eyeclose = !this.eyeclose;
      if (n===0) {
        this.inputType = "text";
      } else {
        this.inputType = "password";
      }
    },
    onFilter(){
      this.val = this.val.replace(/[^0-9a-zA-Z~!@&#%$^*()}{=+_;:?"',\][.|/\\-]/g, "");
    },
    getValue(){
      this.$emit('getPwd', this.val);
    }
  },
};
</script>
<style type="text/css" scoped>
.bkcolor{
  background-color: #f1f1f1 !important;
  border: 1px solid #dbdbdb !important;
}
.box{
  display:inline-block;
  height: 23px;
  padding: 0 3px;
  display:flex;
  width: 216px;
  border: 1px solid #303030;
  background-color: #fff;
}
.inputStyle{
  border: none;
  flex:1;
  outline: none;
}
.icon{
  width: 16px;
  height: 10px;
  margin: auto;
  cursor: pointer;
}
</style>
