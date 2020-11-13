<template>
    <div style="margin-left:24px;">
        <div class="allGuideButtons">
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/datetime')">
                <div><img src="../assets/subimg/datetime.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.time')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/user')">
                <div><img src="../assets/subimg/users.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.users')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/tcpip')">
                <div><img src="../assets/subimg/network.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.tcpip')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/port')">
                <div><img src="../assets/subimg/port.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.port')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/audio')">
                <div><img src="../assets/subimg/audio.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.audio')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/video')">
                <div><img src="../assets/subimg/video.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.video')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/information')">
                <div><img src="../assets/subimg/system.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.system')}}</span>
            </div>
            <div class="guideButton" :class="{'guideButtonEnable': true}" @click="$router.push('/configuration/maintain')">
                <div><img src="../assets/subimg/maintenance.png" class="guideButtonImg"></div>
                <span class="guideButtonText">{{$t('guide.maintain')}}</span>
            </div>
        </div>
        <div class="deviceQrcode">
            <div class="commonTitle">{{$t('guide.p2pcode')}}</div>
            <img src="../assets/subimg/qrcode.png" style="width: 160px;height: 160px;margin: 20px 0 20px 100px;">
        </div>
        <div class="productSketch">
            <div class="commonTitle"><img src="../assets/subimg/information2.png" width="20px" height="20px" style="margin:0 6px 3px 0;">{{$t('guide.product')}}</div>
            <div style="width: 620px;font-size: 12px;margin:10px 0 0 20px;">{{$t('guide.productdeclare')}}</div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.allGuideButtons{
    width: 660px;
    height: 310px;
    .guideButton {
        width: 116px;
        height: 110px;
        margin:26px 0 0 26px;
        float: left;
        border:2px solid #747474;
        border-radius: 22px;
        color: #7f7f7f;
        .guideButtonImg{
            width: 46px;
            height: 46px;
            margin: 22px 0 0 36px;
            float: left;
        }
        .guideButtonText{
            display: block;
            width: 100%;
            height: 26px;
            margin: 12px 0 0 0;
            float: left;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
        }
    }
    .guideButtonEnable{
        color:#03547c;
        cursor: pointer;
    }
    .guideButtonEnable:hover{
        background-color: #bb131a;
        cursor: pointer;
        color: #03547c;
    }
}
.commonTitle{
  width: 620px;
  height: 28px;
  margin-top: 6px;
  line-height: 28px;
  background-color: #c9c9c9;
  font-size: 14px;
  padding-left: 20px;
  color: black;
}
</style>