<template>
    <div class="loginMain">
        <div class="loginPanel">
            <div class="logo"></div>
            <div class="item">
                <input style="width:100%;height:100%;border:none;outline:none;padding:0 3px;" :placeholder="$t('common.username')" maxLength="32" v-pwd v-model="username"/>
            </div>
            <div class="item">
                <pwd-input style="width:100%;height:100%;border:none;" v-model="password" :length="'15'" :text="$t('common.password')" @getPwd="(res)=>{password=res}"></pwd-input>
            </div>
            <div class="item">
                <select v-model="language" style="width:100%;height:100%;border:none;outline:none;" @change="switchLang">
                    <option value="9">English</option>
                    <option value="25">Русский</option>
                    <option value="4">简体中文</option>
                </select>
            </div>
            <button class="loginbtn" @click="onLogin">{{$t('common.login')}}</button>
            <div class="logintips">{{tip}}</div>
            <div class="resetpwd" @click="onShowModal">{{$t('common.rstpwd')}}</div>
        </div>
        <div class="loginDecl">Copyright &copy; TRASSIR 2020-2025 All rights reserved.</div>
        <a-modal v-model="visible" :title="$t('common.rstpwd')" :footer="null" centered width="590px">
            <div class="rstItem">
                <div class="name">{{$t('common.devicecode')}}</div>
                <div class="value" style="width:320px">{{devcode}}</div>
            </div>
            <div class="rstItem">
                <div class="name">{{$t('common.expiretime')}}</div>
                <div class="value">{{expiretime}}</div>
                <button class="btn" @click="onRefresh">{{$t('common.refresh')}}</button>
            </div>
            <div class="rstItem">
                <div class="name">{{$t('common.authcode')}}</div>
                <input style="width:250px;height:23px;outline:none;" v-model="authcode" maxLength="32"/>
            </div>
            <div class="rstItem">
                <div class="name">{{$t('common.newpas')}}</div>
                <pwd-input style="width:250px;" v-model="pwd" :length="'15'" @getPwd="(res)=>{pwd=res}"></pwd-input>
            </div>
            <div class="rstItem">
                <div class="name">{{$t('user.confirmpwd')}}</div>
                <pwd-input style="width:250px;" v-model="confpwd" :length="'15'" @getPwd="(res)=>{confpwd=res}"></pwd-input>
                <button class="btn" @click="onReset">{{$t('common.rstpwd')}}</button>
            </div>
            <div style="width:100%;height:18px;color: red;font-size: 12px;text-align:center;">{{rsttip}}</div>
            <div>
                <img src="../assets/subimg/information2.png" width="20px" height="20px" style="margin-right: 6px;">
                <span style="color: #03547c;font-size: 12px;height: 16px;line-height: 16px;">{{$t('common.getpwdtips')}}</span>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { Modal } from "ant-design-vue";
import PwdInput from "../components/pwdinput"
import md5 from 'js-md5'
export default {
    data() {
        return {
            language: '9',
            username: '',
            password: '',
            tip: '',
            visible: false,
            devcode: '',
            expiretime: '',
            confpwd: '',
            pwd: '',
            authcode: '',
            rsttip: ''
        }
    },
    components: {
        AModal: Modal,
        PwdInput
    },
    mounted(){
        this.$i18n.locale = "en";
        window.addEventListener('keydown',this.handleKeydown);
        String.prototype.format = function (args) {
            if (arguments.length > 0) {
                let result = this;
                if (arguments.length == 1 && typeof(args) == "object") {
                    for (let key in args) {
                        let reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                } else {
                    for (let i = 0; i < arguments.length; i++) {
                        if (arguments[i] == undefined) {
                            return "";
                        } else {
                            let reg = new RegExp("({[" + i + "]})", "g");
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
                return result;
            } else {
                return this;
            }
        }
    },
    methods:{
        handleKeydown(event){
            if (event.keyCode == 13 || event.keyCode == 108) {
                this.onLogin();
            }
        },
        switchLang(){
            if (this.language === '4') {
                this.$i18n.locale = "zh";
            } else if (this.language === '9') {
                this.$i18n.locale = "en";
            } else if (this.language === '25') {
                this.$i18n.locale = "ru";
            }
        },
        getQueryString(name){
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        },
        hideTip(str){
            this.tip = str;
            setTimeout(()=>{
                this.tip = '';
            },10000)
        },
        setCookie(nvalue,exday,lvalue,exdays,pwd){
            if (lvalue === '4') {
                lvalue = '简体中文';
            } else if (lvalue === '9') {
                lvalue = 'English';
            } else if (lvalue === '25') {
                lvalue = 'Русский';
            }
            let username = window.encodeURIComponent(String(nvalue));
            let language = window.encodeURIComponent(String(lvalue));
            let d = new Date();
            let l = new Date();
            d.setDate(d.getDate() + exday);
            l.setDate(l.getDate() + exdays);
            document.cookie = encodeURIComponent("username")+ "=" + username + "; expires=" + d.toUTCString();
            document.cookie = encodeURIComponent("language")+ "=" + language + "; expires=" + l.toUTCString();
            document.cookie = encodeURIComponent("password")+ "=" + encodeURIComponent(String(pwd));
        },
        onLogin(){
            if(this.username.length <= 0 || this.password.length <= 0){
                let str = this.$t('tip.errlogin');
                this.hideTip(str);
                return;
            }
            let tid = this.getQueryString("t");
            let str = tid + ":" + this.password;
            let access = md5(str);
            let name = this.username.trim();
            let param = "username=" + name + "&tid=" + tid + "&access=" + access;
            this.$post("/goform/formLogin",param).then(()=>{
                let pwd = md5(this.password);
                localStorage.setItem("user",name);
                localStorage.setItem("pwd",pwd);
                localStorage.setItem("lang",this.language);
                this.setCookie(name,60,this.language,365,pwd);
                this.$router.push('/preview');
            }).catch((err)=>{
                if (err.response.status == 403) {
                    let restring = err.response.data.split(' ');
                    let tipstr = this.$t('tip.logintimes');
                    let tagstr = tipstr.format({times: restring[restring.length-1]});
                    this.hideTip(tagstr);
                } else if (err.response.status == 423) {
                    let restring = err.response.data.split(' ');
                    let tipstr = this.$t('tip.loginwait');
                    let tagstr = tipstr.format({time: restring[restring.length-1]});
                    this.hideTip(tagstr);
                } else {
                    let str = this.$t('tip.errlogin');
                    this.hideTip(str);
                }
            })
        },
        onShowModal(){
            this.onRefresh();
            this.visible = true;
        },
        onRefresh(){
            this.$getAPI("/action/get?subject=changepasswd").then((res)=>{
                this.devcode = res.response.changepasswd.key;
                let time = parseInt(res.response.changepasswd.time);
                let h = Math.floor(time / 3600) < 10 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600);
                let m = Math.floor((time / 60 % 60)) < 10 ? '0' + Math.floor((time / 60 % 60)) : Math.floor((time / 60 % 60));
                let s = Math.floor((time % 60)) < 10 ? '0' + Math.floor((time % 60)) : Math.floor((time % 60));
                this.expiretime = h + " " + ":" + " " + m + " " + ":" + " " + s;
            })
        },
        onReset(){
            if(this.pwd != this.confpwd){
                this.rsttip = this.$t('tip.pwdnomach');
                setTimeout(()=>{
                    this.rsttip = '';
                },2000)
                return;
            }
            if(this.pwd == '' || this.authcode == ''){
                this.rsttip = this.$t('common.errinput');
                setTimeout(()=>{
                    this.rsttip = '';
                },2000)
                return;
            }
            let encryptstr = window.btoa(this.pwd);
            let xml = '<?xml version="1.0" encoding="utf-8"?><request><changepasswd ver="2.0"><key>'+ this.authcode +'</key><newpwd>'+ encryptstr +'</newpwd></changepasswd></request>';
            this.$post("/action/set?subject=changepasswd",xml).then(()=>{
                this.rsttip = this.$t('tip.infosave');
                setTimeout(()=>{
                    this.rsttip = '';
                    this.visible = false;
                },2000)
            }).catch(()=>{
                this.rsttip = this.$t('tip.errset');
                setTimeout(()=>{
                    this.rsttip = '';
                },2000)
            })
        }
    },
    destroyed () {
        window.removeEventListener('keydown',this.handleKeydown);
    }
}
</script>
<style lang="scss" scoped>
.loginMain{
    width: 100%;
    height: 100%;
    background-color: #f3f2f2;
    display: flex;
    flex-direction: column;
    .loginPanel{
        width: 580px;
        height: 360px;
        border:2px solid #e0e0e0;
        border-radius: 6px;
        margin: auto;
        background-color: #ebebed;
        position: relative;
        font-size: 14px;
        .logo{
            width: 552px;
            height: 108px;
            margin-left: 14px;
            margin-top: 10px;
            background-image: url("../assets/img/loginlogo.png");
        }
        .item{
            width: 304px;
            height: 36px;
            border: 2px solid #03547c;
            border-radius: 4px;
            margin: 10px 0 0 137px;
            select::-ms-expand {
                display: none;
            }
        }
        .loginbtn{
            width: 304px;
            height: 36px;
            border-radius: 4px;
            margin: 10px 0 0 137px;
            background-color: #03547c;
            border: 1px solid #2c3c4f;
            color: white;
            outline: none;
        }
        .loginbtn:hover{
            background-color: #a9403d;
        }
        .logintips{
            width: 100%;
            text-align: center;
            color: red;
            margin-top:5px;
        }
        .resetpwd{
            position: absolute;
            right: 10px;
            bottom: 5px;
            cursor: pointer;
        }
    }
    .loginDecl{
        width: 100%;
        height: 58px;
        line-height: 58px;
        position: fixed;
        bottom: 0;
        background-color: #ebebed;
        color: #03547c;
        font-size: 14px;
        font-weight: bold;
        padding-left: 32px;
    }
}
.rstItem{
    width: 100%;
    font-size: 12px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .name{
        width: 155px;
        display: inline-block;
    }
    .value{
        width: 250px;
        display: inline-block;
    }
    .btn{
        width: 126px;
        height: 28px;
        background-color: #03547c;
        text-align: center;
        color: #fff;
        margin-left: 10px;
        border: 1px solid #2c3c4f;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        display: inline-block;
    }
    .btn:hover{
        background-color: #a9403d;
        border: 1px solid #bb131a;
    }
}
</style>