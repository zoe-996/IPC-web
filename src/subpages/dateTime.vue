<template>
    <div class="sideContent">
        <div class="navTitle">{{$t('dt.datetime')}}</div>
        <div class="status">
            <div class="commonTitle">{{$t('dt.status')}}</div>
            <div class="lineSpacing">
                <div class="textWidth">{{$t('dt.date')}}</div>
                <div>{{datevalue}}</div>
            </div>
            <div class="lineSpacing">
                <div class="textWidth">{{$t('dt.time')}}</div>
                <div>{{timevalue}}</div>
            </div>
        </div>
        <div class="format">
            <div class="commonTitle">{{$t('dt.datetimefmt')}}</div>
            <div class="lineSpacing">
                <div class="textWidth">{{$t('dt.datefmt')}}</div>
                <a-select v-model="datefmt" size="small" style="width:250px;">
                    <a-select-option value="0">{{$t('dt.dateymd')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.datemdy')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.datedmy')}}</a-select-option>
                </a-select>
            </div>
            <div class="lineSpacing">
                <div class="textWidth">{{$t('dt.timefmt')}}</div>
                <a-select v-model="timefmt" size="small" style="width:250px;">
                    <a-select-option value="0">24{{$t('dt.hour')}}</a-select-option>
                    <a-select-option value="1">12{{$t('dt.hour')}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="deviceTime">
            <div class="commonTitle">{{$t('dt.timeset')}}</div>
            <div class="lineSpacing">
                <div class="textWidth">{{$t('dt.timezone')}}</div>
                <a-select v-model="timezone" size="small" style="width:250px;">
                    <a-select-option v-for="(val,key,i) in timezonetexts" :key="i" :value="key">{{val}}</a-select-option>
                </a-select>
            </div>
            <div class="lineSpacing">
                <div class="indentation"><a-checkbox :checked="dstcheck" @change="onDstChange">{{$t('dt.dstenable')}}</a-checkbox></div>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('dt.dstbias')}}</div>
                <a-select v-model="dstbias" size="small" :disabled="!dstcheck" style="width:250px;">
                    <a-select-option value="1800">30{{$t('dt.minute')}}</a-select-option>
                    <a-select-option value="3600">60{{$t('dt.minute')}}</a-select-option>
                    <a-select-option value="5400">90{{$t('dt.minute')}}</a-select-option>
                    <a-select-option value="7200">120{{$t('dt.minute')}}</a-select-option>
                </a-select>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('dt.dststart')}}</div>
                <a-select v-model="startmonth" size="small" :disabled="!dstcheck" style="width:115px;">
                    <a-select-option value="0">{{$t('dt.monthnames.january')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.monthnames.february')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.monthnames.march')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.monthnames.april')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.monthnames.may')}}</a-select-option>
                    <a-select-option value="5">{{$t('dt.monthnames.june')}}</a-select-option>
                    <a-select-option value="6">{{$t('dt.monthnames.july')}}</a-select-option>
                    <a-select-option value="7">{{$t('dt.monthnames.august')}}</a-select-option>
                    <a-select-option value="8">{{$t('dt.monthnames.september')}}</a-select-option>
                    <a-select-option value="9">{{$t('dt.monthnames.october')}}</a-select-option>
                    <a-select-option value="10">{{$t('dt.monthnames.november')}}</a-select-option>
                    <a-select-option value="11">{{$t('dt.monthnames.december')}}</a-select-option>
                </a-select>
                <a-select v-model="startweek" size="small" :disabled="!dstcheck" style="width:90px;">
                    <a-select-option value="0">{{$t('dt.firstweek')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.secondweek')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.thirdweek')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.fourthweek')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.lastweek')}}</a-select-option>
                </a-select>
                <a-select v-model="startday" size="small" :disabled="!dstcheck" style="width:115px;">
                    <a-select-option value="0">{{$t('dt.weekdays.monday')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.weekdays.tuesday')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.weekdays.wednesday')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.weekdays.thursday')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.weekdays.friday')}}</a-select-option>
                    <a-select-option value="5">{{$t('dt.weekdays.saturday')}}</a-select-option>
                    <a-select-option value="6">{{$t('dt.weekdays.sunday')}}</a-select-option>
                </a-select>
                <a-time-picker v-model="starttime" size="small" :disabled="!dstcheck" format="HH:mm" style="width:100px"/>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('dt.dstend')}}</div>
                <a-select v-model="endmonth" size="small" :disabled="!dstcheck" style="width:115px;">
                    <a-select-option value="0">{{$t('dt.monthnames.january')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.monthnames.february')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.monthnames.march')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.monthnames.april')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.monthnames.may')}}</a-select-option>
                    <a-select-option value="5">{{$t('dt.monthnames.june')}}</a-select-option>
                    <a-select-option value="6">{{$t('dt.monthnames.july')}}</a-select-option>
                    <a-select-option value="7">{{$t('dt.monthnames.august')}}</a-select-option>
                    <a-select-option value="8">{{$t('dt.monthnames.september')}}</a-select-option>
                    <a-select-option value="9">{{$t('dt.monthnames.october')}}</a-select-option>
                    <a-select-option value="10">{{$t('dt.monthnames.november')}}</a-select-option>
                    <a-select-option value="11">{{$t('dt.monthnames.december')}}</a-select-option>
                </a-select>
                <a-select v-model="endweek" size="small" :disabled="!dstcheck" style="width:90px;">
                    <a-select-option value="0">{{$t('dt.firstweek')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.secondweek')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.thirdweek')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.fourthweek')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.lastweek')}}</a-select-option>
                </a-select>
                <a-select v-model="endday" size="small" :disabled="!dstcheck" style="width:115px;">
                    <a-select-option value="0">{{$t('dt.weekdays.monday')}}</a-select-option>
                    <a-select-option value="1">{{$t('dt.weekdays.tuesday')}}</a-select-option>
                    <a-select-option value="2">{{$t('dt.weekdays.wednesday')}}</a-select-option>
                    <a-select-option value="3">{{$t('dt.weekdays.thursday')}}</a-select-option>
                    <a-select-option value="4">{{$t('dt.weekdays.friday')}}</a-select-option>
                    <a-select-option value="5">{{$t('dt.weekdays.saturday')}}</a-select-option>
                    <a-select-option value="6">{{$t('dt.weekdays.sunday')}}</a-select-option>
                </a-select>
                <a-time-picker v-model="endtime" size="small" :disabled="!dstcheck" format="HH:mm" style="width:100px"/>
            </div>
            <div class="lineSpacing">
                <div class="indentation"><a-checkbox :checked="!manualcheck" @change="onChange">{{$t('dt.syncserver')}}</a-checkbox></div>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('dt.ntpserver')}}</div>
                <a-input v-model="addr" size="small" :disabled="manualcheck" style="width:250px;"></a-input>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('guide.port')}}</div>
                <a-input v-model="port" size="small" :disabled="manualcheck" style="width:250px;"></a-input>
            </div>
            <div class="smallLineSpacing">
                <div class="textWidth">{{$t('dt.ntpperiod')}}</div>
                <a-input v-model="interval" size="small" :disabled="manualcheck" style="width:250px;"></a-input>
            </div>
            <div class="lineSpacing">
                <div class="textWidth"><a-checkbox :checked="manualcheck" @change="onChange">{{$t('dt.manualset')}}</a-checkbox></div>
                <a-date-picker v-model="manualdate" size="small" :disabled="!manualcheck" style="width:160px;"/>
                <a-time-picker v-model="manualtime" size="small" :disabled="!manualcheck || syncpcenable" style="margin-right:10px;"/>
                <a-checkbox @change="onSyncChange" :disabled="!manualcheck">{{$t('dt.syncpc')}}</a-checkbox>
            </div>
        </div>
        <div class="buttonGroup">
            <button class="commonBtn" @click="restore">{{$t('common.restore')}}</button>
            <button class="commonBtn" @click="getparam">{{$t('common.refresh')}}</button>
            <button class="commonBtn" @click="saveparam">{{$t('common.save')}}</button>
        </div>
    </div>
</template>
<script>
import { Select,Checkbox,TimePicker,DatePicker,Input } from "ant-design-vue";
import moment from 'moment';
export default {
    data() {
        return {
            timezonetexts: this.$t('dt.timezoneitem'),
            datefmt: '0',
            datevalue:'',
            timefmt: '0',
            timevalue:'',
            timezone: 'CST-8',
            dstbias: '3600',
            startmonth: '0',
            startday: '0',
            startweek: '0',
            endmonth: '0',
            endday: '0',
            endweek: '0',
            starttime: moment('02:00', 'HH:mm'),
            endtime: moment('02:00', 'HH:mm'),
            addr: 'pool.ntp.org',
            port: '123',
            interval: 1,
            dstcheck:false,
            manualcheck: false,
            syncpcenable: false,
            manualdate:moment(),
            manualtime:moment(),
            T1:null,
            T2:null,
            resultDevpara:{},
            resultSys:{}
        };
    },
    components: {
        ASelect: Select,
        ASelectOption: Select.Option,
        ACheckbox:Checkbox,
        ATimePicker:TimePicker,
        ADatePicker:DatePicker,
        AInput:Input
    },
    mounted() {
        this.getparam();
    },
    destroyed(){
        if(this.T1!=null){
            clearInterval(this.T1);
        }
        if(this.T2!=null){
            clearInterval(this.T2);
        }
    },
    methods: {
        moment,
        restore(){
            this.datefmt = '0';
            this.timefmt = '0';
            this.timezone = 'CST-8';
            this.dstbias = '3600';
            this.startmonth = '0';
            this.startday = '0';
            this.startweek ='0';
            this.endmonth = '0';
            this.endday = '0';
            this.endweek = '0';
            this.starttime = moment('02:00', 'HH:mm');
            this.endtime = moment('02:00', 'HH:mm');
            this.addr = 'pool.ntp.org';
            this.port = '123';
            this.interval = 1;
            this.dstcheck = false;
            this.manualcheck = false;
        },
        async getparam(){
            let data0 = await this.$getAPI("/action/get?subject=devpara");
            this.resultDevpara = data0.response.devpara;
            this.datefmt = this.resultDevpara.datefmt;
            this.timefmt = this.resultDevpara.timefmt;
            let data1 = await this.$getAPI("/action/get?subject=systime");
            this.resultSys = data1.response.systime;
            let date = this.resultSys.datetime.split('T');
            let arr = date[0].split('-');
            if(this.datefmt == 0){
                this.datevalue = date[0]
            } else if (this.datefmt == 1) {
                this.datevalue = arr[1] + "-" + arr[2] + "-" + arr[0];
            } else if (this.datefmt == 2) {
                this.datevalue = arr[2] + "-" + arr[1] + "-" + arr[0];
            }
            let arr1 = date[1].split(':');
            let second = parseInt(arr1[0]) * 3600 + parseInt(arr1[1]) * 60 + parseInt(arr1[2]);
            if(this.T1 != null){
                clearInterval(this.T1);
            }
            this.T1 = setInterval(()=>{
                second++;
                let timestr = this.getStringTime(second);
                if(this.timefmt == 0){
                    this.timevalue = timestr
                } else {
                    let arr2 = timestr.split(':')
                    if (parseInt(arr[0]) >= 12) {
                        this.timevalue = String(arr2[0] - 12) + ":" + String(arr2[1]) + ":" + String(arr2[2]) + "PM";
                    } else {
                        this.timevalue = String(arr2[0]) + ":" + String(arr2[1]) + ":" + String(arr2[2]) + "AM";
                    }
                }
            },1000);
            this.timezone = this.resultSys.tz;
            this.dstcheck = (this.resultSys.dst.active == 1) ? true : false;
            this.manualcheck = (this.resultSys.mode == 0) ? true : false;
            this.dstbias = this.resultSys.dst.offset;
            this.startmonth = this.resultSys.dst.begin.month;
            this.startday = this.resultSys.dst.begin.day;
            this.startweek = this.resultSys.dst.begin.week;
            this.starttime = moment(this.getStringTime(this.resultSys.dst.begin.second), 'HH:mm');
            this.endmonth = this.resultSys.dst.end.month;
            this.endday = this.resultSys.dst.end.day;
            this.endweek = this.resultSys.dst.end.week;
            this.endtime = moment(this.getStringTime(this.resultSys.dst.end.second), 'HH:mm');
        },
        saveparam(){
            this.resultDevpara.datefmt = this.datefmt;
            this.resultDevpara.timefmt = this.timefmt;
            let object0 = {request:{devpara:this.resultDevpara}};
            this.$postAPI("/action/set?subject=devpara",object0,true);
            let datetime = this.manualdate.year()+"-"+(this.manualdate.month()+1)+"-"+this.manualdate.date()+"T"+this.manualtime.hour()+":"+this.manualtime.minute()+":"+this.manualtime.second();
            let bsecond = this.starttime.hour()*3600 + this.starttime.minute()*60 + this.starttime.second();
            let esecond = this.endtime.hour()*3600 + this.endtime.minute()*60 + this.endtime.second();
            this.resultSys.mode = this.manualcheck ? 0 : 1;
            this.resultSys.tz = this.timezone;
            this.resultSys.datetime = datetime;
            this.resultSys.dst.active = this.dstcheck ? 1 : 0;
            this.resultSys.dst.offset = this.dstbias;
            this.resultSys.dst.begin.month = this.startmonth;
            this.resultSys.dst.begin.week = this.startweek;
            this.resultSys.dst.begin.day = this.startday;
            this.resultSys.dst.begin.second = bsecond;
            this.resultSys.dst.end.month = this.endmonth;
            this.resultSys.dst.end.week = this.endweek;
            this.resultSys.dst.end.day = this.endday;
            this.resultSys.dst.end.second = esecond;
            this.resultSys.ntp.host = this.addr;
            this.resultSys.ntp.port = this.port;
            this.resultSys.ntp.interval = this.interval;
            let object1 = {request:{systime:this.resultSys}};
            this.$postAPI("/action/set?subject=systime",object1,true);
        },
        onDstChange(){
            this.dstcheck = !this.dstcheck;
        },
        onChange(){
            this.manualcheck = !this.manualcheck;
        },
        onSyncChange(){
            this.syncpcenable = !this.syncpcenable;
            if(this.syncpcenable){
                this.T2 = setInterval(()=>{
                    this.manualtime =  moment()
                },1000)
            }else{
                clearInterval(this.T2);
            }
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
@import '../assets/style/common.scss';
.indentation{
    padding-left: 30px;
}
</style>