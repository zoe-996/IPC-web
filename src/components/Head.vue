<template>
  <div class="head">
    <div class="logoImg">
      <img src="../assets/img/logo.png"/>
    </div>
    <div class="navItem">
      <router-link to='/preview' class="navButton">{{$t('common.liveplay')}}</router-link>
      <router-link to='/playback' class="navButton">{{$t('common.playback')}}</router-link>
      <router-link to='/configuration' class="navButton">{{$t('common.configure')}}</router-link>
    </div>
    <div class="user">
      <img src="../assets/img/admin.png" width="16px" height="16px">
      <span ref="user" style="padding: 0 0.2rem 0 0.06rem;"></span>
      <div @click="onLogout" style="cursor: pointer;display: inline-block;">
        <img src="../assets/img/logout.png" width="16px" height="16px">
        <span style="padding: 0 0.2rem 0 0.06rem;">{{$t('common.exit')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    this.$refs.user.innerHTML = localStorage.getItem("user");
  },
  methods:{
    onLogout(){
      window.localStorage.clear();
      this.$router.push('/login.html');
    }
  }
}
</script>
<style lang="scss" scoped>
.head{
  width:100%;
  height:0.46rem;
  line-height: 0.46rem;
  display: flex;
  flex-direction: row;
  background: #f5f5f5;
  .logoImg{
    margin: 0 0.4rem;
    display: inline-block;
    img{
      height: 0.46rem;
    }
  }
  .navItem{
    flex: 1;
    overflow: hidden;
    display: inline-block;
    font-size: 15px;
    .navButton{
      width:2.2rem;
      height:0.46rem;
      text-align: center;
      color: white;
      cursor: pointer;
      background: url("../assets/img/mainmenu1.png") 0 6px no-repeat;
    }
    .navButton:hover{
      background: url("../assets/img/mainmenu2.png") 0 6px no-repeat;
    }
  }
  .user{
    display: inline-block;
    font-size: 0.14rem;
  }
}
</style>