<template>
    <div class="sideContent">
        <div class="navTitle">{{$t('configuration.upgrade')}}</div>
        <div>
            <div class="space">
                <span>{{$t('upgrade.devconfirm1')}}</span>
                <span style="color:red">{{devmode}}</span>
                <span> {{$t('upgrade.devconfirm2')}}</span>
            </div>
            <div class="space">
                <span>{{$t('upgrade.selectfile')}} </span>
                <input type="text" disabled="disabled" :value="filename" style="width:220px;color:#7f7f7f">
                <div style="display:inline-block;margin-left:8px;">
                    <input id="file" type="file" @change="onFileSelect" style="display:none;"/>
                    <button class="commonBtn" @click="onBrowse">{{$t('upgrade.browse')}}</button>
                    <button class="commonBtn" @click="onUpgrade">{{$t('upgrade.startupgrade')}}</button>
                </div>
                <a-modal
                    :title="$t('upgrade.upgradeprogress')"
                    :visible="visible"
                    :centered="true"
                    :footer="null"
                    :closable="false"
                    >
                    <a-progress :percent="provalue" status="active" :stroke-color="{from: '#03547c',to: '#bb131a',}"/>
                    <div style="width:100%;text-align: center;">{{countdown}}</div>
                    <div style="width:100%;text-align: center;">{{tip}}</div>
                </a-modal>
            </div>
            <div class="space">
                <div>
                    <img src="../assets/subimg/information2.png" width="20px" height="20px">
                </div>
                <div style="color:#7f7f7f;margin-top: 5px;font-size: 12px;">
                    {{$t('upgrade.upgradenote1')}}
                </div>
                <div style="color:#7f7f7f;margin-top: 5px;font-size: 12px;">
                    {{$t('upgrade.upgradenote2')}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Modal, Progress } from "ant-design-vue";
export default {
    data(){
        return{
            devmode: '',
            filename: '',
            visible: false,
            provalue: 0,
            tip: '',
            countdown:''
        }
    },
    components:{
        AModal: Modal,
        AProgress:Progress
    },
    mounted(){
        this.$getAPI("/action/get?subject=devinfo").then((res)=>{
            this.devmode = res.response.devinfo.model;
        });
    },
    methods:{
        onFileSelect(){
            this.filename = document.getElementById("file").value;
        },
        onBrowse(){
            document.getElementById("file").click();
        },
        onUpgrade(){
            if(this.filename==''){
                return;
            }
            this.countdown = '';
            this.tip = '';
            this.provalue = 0;
            this.visible = true;
            this.$post("/action/upgrade?op=prepare").then(()=>{
                let file = document.getElementById("file").files[0];
                let param = new FormData();
                param.append("file", file);
                let timecount = 300;
                let T = setInterval(()=>{
                    if(this.provalue == 100){
                        this.countdown = this.$t('upgrade.waitupgrade') + timecount-- + 's';
                    }
                },1000)
                this.$uploadFile("/action/upload?file=firmware", param,(evt)=>{this.provalue = Math.round((evt.loaded / evt.total) * 100);}).then((res)=>{
                    clearInterval(T);
                    if(res.status == 200){
                        this.countdown = '';
                        this.tip = this.$t('upgrade.upgradesuccess');
                    }
                    setTimeout(()=>{
                        this.visible = false;
                    },5000)
                }).catch((err)=>{
                    clearInterval(T);
                    if(err.response.status == 415){
                        this.tip = this.$t('upgrade.fileerror');
                    }else if(err.response.status == 416){
                        this.tip = this.$t('upgrade.hardnotmatch');
                    }else{
                        this.tip = this.$t('upgrade.upgradefailed');
                    }
                    setTimeout(()=>{
                        this.visible = false;
                    },5000)
                })
            }).catch(()=>{
                this.tip = this.$t('upgrade.uploaderror');
                setTimeout(()=>{
                    this.visible = false;
                },5000)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/style/common.scss";
.space {
  margin: 10px 0 0 30px;
  font-size: 14px;
}
</style>