<template>
    <div style="width:100%;height:256px;font-size: 13px;">
        <div class="weekdayBox">
            <div class="weekdayItem">{{$t('dt.weekdays.sunday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.monday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.tuesday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.wednesday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.thursday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.friday')}}</div>
            <div class="weekdayItem">{{$t('dt.weekdays.saturday')}}</div>
        </div>
        <div class="scheduleBox">
            <div>
              <img src="../assets/subimg/schedule.png" width="734px" height="32px">
            </div>
            <div style="margin-left: 6px;">
              <canvas :id="'drawingBoard' + m" width="720px" height="224px"></canvas>
            </div>
        </div>
        <div class="btnBox">
            <button class="setupBtn" @click="showModal(0)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(1)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(2)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(3)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(4)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(5)">{{$t('common.setup')}}</button>
            <button class="setupBtn" @click="showModal(6)">{{$t('common.setup')}}</button>
        </div>
        <a-modal v-model="visible" :title="$t('common.schedule')" centered :style="{width:'700px'}">
            <template slot="footer">
                <button class="setupBtn" @click="handleCancel">{{ $t("common.cancel") }}</button>
                <button class="setupBtn" @click="handleOk">{{ $t("common.save") }}</button>
            </template>
            <div>
                <a-checkbox @change="()=>{ckvalue = ckvalue == 127 ? 0 : 127}" :checked="ckvalue==127">{{$t('common.selall')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<6) ? ckvalue-64 : ckvalue+64}" :checked="!!(ckvalue & 1<<6)">{{$t('dt.weekdays.sunday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1)    ? ckvalue-1  : ckvalue+1}"  :checked="!!(ckvalue & 1)"   >{{$t('dt.weekdays.monday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<1) ? ckvalue-2  : ckvalue+2}"  :checked="!!(ckvalue & 1<<1)">{{$t('dt.weekdays.tuesday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<2) ? ckvalue-4  : ckvalue+4}"  :checked="!!(ckvalue & 1<<2)">{{$t('dt.weekdays.wednesday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<3) ? ckvalue-8  : ckvalue+8}"  :checked="!!(ckvalue & 1<<3)">{{$t('dt.weekdays.thursday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<4) ? ckvalue-16 : ckvalue+16}" :checked="!!(ckvalue & 1<<4)">{{$t('dt.weekdays.friday')}}</a-checkbox>
                <a-checkbox @change="()=>{ckvalue = (ckvalue & 1<<5) ? ckvalue-32 : ckvalue+32}" :checked="!!(ckvalue & 1<<5)">{{$t('dt.weekdays.saturday')}}</a-checkbox>
            </div>
            <div>
                <div style="margin-top:10px;">{{$t('common.period')}}1 : <a-time-picker v-model="timearr[0]" size="small"/> ~ <a-time-picker v-model="timearr[1]" size="small"/></div>
                <div style="margin-top:10px;">{{$t('common.period')}}2 : <a-time-picker v-model="timearr[2]" size="small"/> ~ <a-time-picker v-model="timearr[3]" size="small"/></div>
                <div style="margin-top:10px;">{{$t('common.period')}}3 : <a-time-picker v-model="timearr[4]" size="small"/> ~ <a-time-picker v-model="timearr[5]" size="small"/></div>
                <div style="margin-top:10px;">{{$t('common.period')}}4 : <a-time-picker v-model="timearr[6]" size="small"/> ~ <a-time-picker v-model="timearr[7]" size="small"/></div>
                <div style="margin-top:10px;">{{$t('common.period')}}5 : <a-time-picker v-model="timearr[8]" size="small"/> ~ <a-time-picker v-model="timearr[9]" size="small"/></div>
                <div style="margin-top:10px;">{{$t('common.period')}}6 : <a-time-picker v-model="timearr[10]" size="small"/> ~ <a-time-picker v-model="timearr[11]" size="small"/></div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { Modal, Checkbox, TimePicker, message} from "ant-design-vue";
import moment from 'moment';
export default {
    props: {
        data: {
            type: Array
        },
        subject: {
            type: String
        },
        m: {
            type: Number
        }
    },
    data() {
        return {
            ctx:null,
            visible: false,
            ckvalue: 0,
            timearr: [],
            sec: []
        };
    },
    components: {
        ACheckbox: Checkbox,
        AModal: Modal,
        ATimePicker:TimePicker
    },
    watch: {
        data:  {
            immediate: true,
            handler (val) {
                let arr7 = []
                for(let i = 0;i < 6; i++){
                    let secarr = val[6].tsection[i].split('-');
                    arr7.push(parseInt(secarr[0]));
                    arr7.push(parseInt(secarr[1]));
                }
                this.sec[0] = arr7;
                for(let j = 0; j < 6; j++){
                    let arr = [];
                    for(let k= 0; k < 6; k++){
                        let secarr = val[j].tsection[k].split('-');
                        arr.push(parseInt(secarr[0]));
                        arr.push(parseInt(secarr[1]));
                    }
                    this.sec[j + 1] = arr;
                }
                this.draw();
            }
        }
    },
    mounted(){
        let idstr = "drawingBoard" + this.$props.m;
        let obj = document.getElementById(idstr);
        this.ctx = obj.getContext("2d");
        this.draw();
    },
    methods:{
        draw(){
            if(this.ctx==null){
                return;
            }
            this.ctx.clearRect(0, 0, 720, 224);
            let offset = parseInt(224/7);
            for(let i=0; i < 7; i++){
                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#363636';
                this.ctx.moveTo(0.5,offset * i + 32.5);
                this.ctx.lineTo(720,offset * i + 32.5);
                this.ctx.stroke();
                this.ctx.fillStyle = '#cd8500';
                if(this.sec.length===0){
                    return;
                }
                if (this.sec[i][1] - this.sec[i][0] > 0) {
                    let start = parseInt(this.sec[i][0] / 120);
                    let end = parseInt(this.sec[i][1] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
                if (this.sec[i][3] - this.sec[i][2] > 0) {
                    let start = parseInt(this.sec[i][2] / 120);
                    let end = parseInt(this.sec[i][3] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
                if (this.sec[i][5] - this.sec[i][4] > 0) {
                    let start = parseInt(this.sec[i][4] / 120);
                    let end = parseInt(this.sec[i][5] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
                if (this.sec[i][7] - this.sec[i][6] > 0) {
                    let start = parseInt(this.sec[i][6] / 120);
                    let end = parseInt(this.sec[i][7] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
                if (this.sec[i][9] - this.sec[i][8] > 0) {
                    let start = parseInt(this.sec[i][8] / 120);
                    let end = parseInt(this.sec[i][9] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
                if (this.sec[i][11] - this.sec[i][10] > 0) {
                    let start = parseInt(this.sec[i][10] / 120);
                    let end = parseInt(this.sec[i][11] / 120);
                    this.ctx.fillRect(start + 0.5, offset * i + 9.5, end - start, 14);
                }
            }
        },
        showModal(n){
            this.ckvalue=0;
            if (n==0) {
                this.ckvalue+=64;
            } else if (n==1) {
                this.ckvalue+=1;
            } else if (n==2) {
                this.ckvalue+=2;
            } else if (n==3) {
                this.ckvalue+=4;
            } else if (n==4) {
                this.ckvalue+=8;
            } else if (n==5) {
                this.ckvalue+=16;
            } else if (n==6) {
                this.ckvalue+=32;
            }
            for(let i = 0; i < 12; i++){
                let second = this.sec[n][i];
                this.timearr[i] = moment(this.getStringTime(second), 'HH:mm:ss');
            }
            this.visible = true;
        },
        handleCancel(){
            this.visible = false;
        },
        handleOk(){
            let inputerr = false;
            let dayarr = this.$props.data;
            let tsecarr = [];
            let drawarr = [];
            for(let i = 0; i < 12; i+=2){
                if(this.timearr[i]!=null && this.timearr[i+1]!=null){
                    let start = this.timearr[i].hour()*3600 + this.timearr[i].minute()*60 + this.timearr[i].second();
                    let end = this.timearr[i+1].hour()*3600 + this.timearr[i+1].minute()*60 + this.timearr[i+1].second();
                    if(start > end){
                        inputerr = true;
                    }
                    let secstr = start + '-' + end;
                    tsecarr[i/2] = secstr;
                    drawarr.push(start);
                    drawarr.push(end);
                }else{
                    inputerr = true;
                }
            }
            if(inputerr){
                message.error(this.$t('common.errinput'));
                return;
            }
            if (this.ckvalue & 1){
                dayarr[0].tsection = tsecarr;
                this.sec[1] = drawarr;
            }
            if (this.ckvalue & 1<<1){
                dayarr[1].tsection = tsecarr;
                this.sec[2] = drawarr;
            }
            if (this.ckvalue & 1<<2){
                dayarr[2].tsection = tsecarr;
                this.sec[3] = drawarr;
            }
            if (this.ckvalue & 1<<3){
                dayarr[3].tsection = tsecarr;
                this.sec[4] = drawarr;
            }
            if (this.ckvalue & 1<<4){
                dayarr[4].tsection = tsecarr;
                this.sec[5] = drawarr;
            }
            if (this.ckvalue & 1<<5){
                dayarr[5].tsection = tsecarr;
                this.sec[6] = drawarr;
            }
            if (this.ckvalue & 1<<6){
                dayarr[6].tsection = tsecarr;
                this.sec[0] = drawarr;
            }
            let object;
            if (this.$props.subject === 'schetask') {
                object ={
                    request: {
                        schetask: {
                            active: 2,
                            schedule: {
                                day: dayarr
                            }
                        }
                    }
                }
            } else {
                object ={
                    request: {
                        alarmevt: {
                            active: 2,
                            schedule: {
                                day: dayarr
                            }
                        }
                    }
                }
            }
            this.$postAPI("/action/set?subject="+ this.$props.subject + "&type=" + this.$props.m, object, true);
            this.visible = false;
            this.draw();
        },
        getStringTime(second){
            let h = parseInt(second / 3600);
            let m = parseInt((second % 3600) / 60);
            let s = parseInt(second % 60);
            let strh = h > 9 ? String(h) : ("0" + String(h));
            let strm = m > 9 ? String(m) : ("0" + String(m));
            let strs = s > 9 ? String(s) : ("0" + String(s));
            return strh + ":" + strm + ":" + strs;
        }
    }
}
</script>
<style lang="scss" scoped>
.weekdayBox{
  width: 90px;
  height: 256px;
  padding-top: 30px;
  margin-right: 4px;
  float: left;
  .weekdayItem{
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: right;
  }
}
.scheduleBox{
  width:734px;
  height: 256px;
  float: left;
  background-color: #f0f0f0;
}
.btnBox{
  width: 100px;
  height: 256px;
  padding-top: 30px;
  float: left;
}
.setupBtn{
    margin: 6px 0 0 4px;
    width: 90px;
    height: 26px;
    text-align: center;
    color: #fff;
    background-color: #03547c;
    border: 1px solid #2c3c4f;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .setupBtn:hover {
    background-color: #a9403d;
    border: 1px solid #bb131a;
  }
</style>