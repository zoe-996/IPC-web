<template>
    <div class="sideContent">
        <div class="navTitle">Telnet</div>
        <div class="maxrect">{{$t('tip.notesecurity')}}</div>
        <div style="padding-left:20px;">
            <input id="entelent" type="checkbox" :checked="enable" @change="()=>{enable=!enable}">
            <label for="entelent">{{$t("common.enable")}}</label>
        </div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
            <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
            <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            enable: false,
            data: {}
        }
    },
    mounted(){
        this.getparam();
    },
    methods:{
        restore(){
            this.enable = false;
        },
        getparam(){
            this.$getAPI('/action/get?subject=devpara').then((res)=>{
                this.data = res.response.devpara;
                this.enable = res.response.devpara.telnet == 1 ? true : false;
            })
        },
        saveparam(){
            this.data.telnet = this.enable ? 1:0;
            let object = {
                request: {
                    devpara: this.data
                }
            }
            this.$postAPI("/action/set?subject=devpara", object, true);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/hasvideo.scss';
</style>