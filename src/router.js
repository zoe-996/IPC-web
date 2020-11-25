
import VueRouter from 'vue-router'
import Vue from 'vue'
const Login  = ()=>import('./pages/login.vue')
const Index  = ()=>import('./pages/index.vue')
const Preview  = ()=>import('./pages/preview.vue')
const Playback  = ()=>import('./pages/playback.vue')
const Configuration  = ()=>import('./pages/configuration.vue')
const BaseSetting = ()=>import('./subpages/baseSetting.vue')
const General = ()=>import('./subpages/general.vue')
const DateTime = ()=>import('./subpages/dateTime.vue')
const Maintain = ()=>import('./subpages/maintain.vue')
const Update = ()=>import('./subpages/update.vue')
const Ptzconfig = ()=>import('./subpages/ptzconfig.vue')
const Rs485 = ()=>import('./subpages/rs485.vue')
const Information = ()=>import('./subpages/information.vue')
const Log = ()=>import('./subpages/log.vue')
const Tcpip = ()=>import('./subpages/tcpip.vue')
const Port = ()=>import('./subpages/port.vue')
const Wifi = ()=>import('./subpages/wifi.vue')
const Pppoe = ()=>import('./subpages/pppoe.vue')
const Smtp = ()=>import('./subpages/smtp.vue')
const Upnp = ()=>import('./subpages/upnp.vue')
const Ddns = ()=>import('./subpages/ddns.vue')
const Rtsp = ()=>import('./subpages/rtsp.vue')
const Rtmp = ()=>import('./subpages/rtmp.vue')
const Snmp = ()=>import('./subpages/snmp.vue')
const Ieee = ()=>import('./subpages/ieee.vue')
const Trcloud = ()=>import('./subpages/trcloud.vue')
const Audio = ()=>import('./subpages/audio.vue')
const Video = ()=>import('./subpages/video.vue')
const Snapshot = ()=>import('./subpages/snapshot.vue')
const Osd = ()=>import('./subpages/osd.vue')
const Img = ()=>import('./subpages/imagesetting.vue')
const Privacymask = ()=>import('./subpages/privacymask.vue')
const Roi = ()=>import('./subpages/roi.vue')
const Localset = ()=>import('./subpages/localsetting.vue')
const Disk = ()=>import('./subpages/disk.vue')
const Ftp = ()=>import('./subpages/ftp.vue')
const Nfs = ()=>import('./subpages/nfs.vue')
const Schedule = ()=>import('./subpages/schedule.vue')
const Motion = ()=>import('./subpages/motiondetect.vue')
const Ioalarm = ()=>import('./subpages/ioalarm.vue')
const Pir = ()=>import('./subpages/pir.vue')
const Abnorm = ()=>import('./subpages/abnormality.vue')
const User = ()=>import('./subpages/user.vue')
const Ipfilter = ()=>import('./subpages/ipfilter.vue')
const Telnet = ()=>import('./subpages/telnet.vue')
Vue.use(VueRouter);
var routes = [
    {path:'*', component: Login },
    {path:'/login.html',component:Login},
    {path:'/preview',component:Index,children:[
        {path:'/preview',component:Preview},
        {path:'/playback',component:Playback},
        {path:'/configuration',component:Configuration,children:[
            {path:'/configuration',component:BaseSetting},
            {path:'/configuration/general',component:General},
            {path:'/configuration/datetime',component:DateTime},
            {path:'/configuration/maintain',component:Maintain},
            {path:'/configuration/update',component:Update},
            {path:'/configuration/ptzconfig',component:Ptzconfig},
            {path:'/configuration/rs485',component:Rs485},
            {path:'/configuration/information',component:Information},
            {path:'/configuration/log',component:Log},
            {path:'/configuration/tcpip',component:Tcpip},
            {path:'/configuration/port',component:Port},
            {path:'/configuration/wifi',component:Wifi},
            {path:'/configuration/pppoe',component:Pppoe},
            {path:'/configuration/smtp',component:Smtp},
            {path:'/configuration/upnp',component:Upnp},
            {path:'/configuration/ddns',component:Ddns},
            {path:'/configuration/rtsp',component:Rtsp},
            {path:'/configuration/rtmp',component:Rtmp},
            {path:'/configuration/snmp',component:Snmp},
            {path:'/configuration/ieee',component:Ieee},
            {path:'/configuration/trcloud',component:Trcloud},
            {path:'/configuration/audio',component:Audio},
            {path:'/configuration/video',component:Video},
            {path:'/configuration/snapshot',component:Snapshot},
            {path:'/configuration/osd',component:Osd},
            {path:'/configuration/imagesetting',component:Img},
            {path:'/configuration/privacymask',component:Privacymask},
            {path:'/configuration/roi',component:Roi},
            {path:'/configuration/localsetting',component:Localset},
            {path:'/configuration/disk',component:Disk},
            {path:'/configuration/ftp',component:Ftp},
            {path:'/configuration/nfs',component:Nfs},
            {path:'/configuration/schedule',component:Schedule},
            {path:'/configuration/motiondetect',component:Motion},
            {path:'/configuration/ioalarm',component:Ioalarm},
            {path:'/configuration/pir',component:Pir},
            {path:'/configuration/abnormality',component:Abnorm},
            {path:'/configuration/user',component:User},
            {path:'/configuration/ipfilter',component:Ipfilter},
            {path:'/configuration/telnet',component:Telnet}
        ]}
    ]}
];
var router = new VueRouter({routes,mode:'history'});

export default router;