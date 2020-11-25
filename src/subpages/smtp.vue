<template>
  <div class="sideContent">
    <div class="navTitle">{{$t('configuration.smtp')}}</div>
    <div style="margin:10px 0 0 14px;">
      <div class="smtpButton" @click="onMail(0)">
          <img src="../assets/subimg/gmail.png" class="smtpImg">
      </div>
      <div class="smtpButton" @click="onMail(1)">
          <img src="../assets/subimg/outlook.png" class="smtpImg">
      </div>
      <div class="smtpButton" @click="onMail(2)">
          <img src="../assets/subimg/yahoo.png" class="smtpImg">
      </div>
      <div class="smtpButton" @click="onMail(3)">
          <img src="../assets/subimg/omail.png" class="smtpImg">
      </div>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.smtpserver')}}</div>
      <input class="commonWidth" v-model="host" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.auth')}}</div>
      <select v-model="ssl" class="commonWidth" @change="onChange">
        <option value="0">{{$t('common.none')}}</option>
        <option value="1">SSL/TLS</option>
        <option value="2">STARTTLS</option>
      </select>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('guide.port')}}</div>
      <input v-model="port" maxlength="5" class="commonWidth" v-num/>
    </div>
    <hr width="560px" align="left" style="margin:10px 0 0 20px;"/>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.username')}}</div>
      <input class="commonWidth" v-model="username" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('common.password')}}</div>
      <a-input-password style="width: 216px;" size="small" v-model="password" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.sender')}}</div>
      <input class="commonWidth" v-model="sender" v-pwd/>
    </div>
    <hr width="560px" align="left" style="margin:10px 0 0 20px;"/>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.receiver')}} 1</div>
      <input class="commonWidth" v-model="recipient[0]" v-pwd/>
      <button class="commonBtn" style="margin-left:10px;" @click="onTest">{{$t('smtp.test')}}</button>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.receiver')}} 2</div>
      <input class="commonWidth" v-model="recipient[1]" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.receiver')}} 3</div>
      <input class="commonWidth" v-model="recipient[2]" v-pwd/>
    </div>
    <div class="lineSpacing">
      <div class="textWidth">{{$t('smtp.receiver')}} 4</div>
      <input class="commonWidth" v-model="recipient[3]" v-pwd/>
    </div>
    <div class="buttonGroup">
      <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
      <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
      <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
    </div>
  </div>
</template>
<script>
import { Input } from "ant-design-vue";
export default {
  data() {
    return {
      host: "",
      ssl: "0",
      port: "25",
      username: "",
      password: "",
      sender: "",
      recipient: ['','','','']
    };
  },
  components: {
    AInputPassword: Input.Password
  },
  mounted() {
    this.getparam();
  },
  methods: {
    restore() {
      this.host = "";
      this.ssl = "0";
      this.port = "25";
      this.username = "";
      this.password = "";
      this.sender = "";
      this.recipient = ['','','',''];
    },
    async getparam() {
      let res = await this.$getAPI("/action/get?subject=smtp");
      this.host = res.response.smtp.host;
      this.port = res.response.smtp.port;
      this.username = res.response.smtp.username;
      this.password = res.response.smtp.password;
      this.ssl = res.response.smtp.ssl;
      this.sender = res.response.smtp.sender;
      this.recipient = res.response.smtp.recipient;
    },
    saveparam() {
      let object = {
        request: {
          smtp: {
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            ssl: this.ssl,
            sender: this.sender,
            recipient: this.recipient
          }
        },
      };
      this.$postAPI("/action/set?subject=smtp", object, true);
    },
    onMail(n){
      if (n==0) {
        this.host = "smtp.gmail.com";
        this.port = "465";
        this.ssl = "1";
      } else if(n==1){
        this.host = "smtp.live.com";
        this.port = "465";
        this.ssl = "1";
      } else if(n==2){
        this.host = "smtp.mail.yahoo.com";
        this.port = "465";
        this.ssl = "1";
      } else if(n==3){
        this.host = "";
        this.port = "465";
        this.ssl = "1";
      }
    },
    onChange(){
      if (this.ssl == '0') {
        this.port = '25';
      } else if(this.ssl == '1'){
        this.port = '465'
      } else {
        this.port = '587'
      }
    },
    onTest(){
      let object = {
        request: {
          smtp: {
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            ssl: this.ssl,
            sender: this.sender,
            recipient: this.recipient[0]
          }
        },
      };
      this.$postAPI("/action/test?subject=smtp", object, true);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.commonWidth {
  width: 216px;
  height: 23px;
  border-radius: 2px;
  border:1px solid #c9c9c9;
  outline: none;
}
.smtpButton{
  width: 136px;
  height: 38px;
  background-color: #fafafa;
  border: 1px solid #242424;
  border-radius: 6px;
  outline: none;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin-left: 6px;
}
.smtpButton:hover{
  background-color: #bb131a;
  border: 1px solid #03547c;
}
.smtpImg{
  width:110px;
  height:26px;
  margin: 5px 0 0 0;
}
</style>