<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { decodeCredential } from 'vue3-google-login'
import { apiGet } from '@/api/whaleApi';
import { showToast, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();

const callback = (response) => {
  // 取得登入的google使用者基本資料
  const userData = decodeCredential(response.credential)
  console.log("Handle the userData", userData)

  // 登入後端
  apiGet({
    url: 'LoginPage/login',
    params: {
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    }
  })
  .then((resp) => {
    // 登錄使用者 google 資料到 userStore, 給跨頁查詢使用
    userStore.setLoginData({
      uid: resp.uid,
      name: resp.name,
      email: resp.email,
      picture: resp.picture,
    });
    
    // 進入到鯨語選單
    router.push({name: 'choose-device'});
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('連線失敗');
  })
  .finally(() => {
  });
  
  // userData.email
  // userData.name
  // userData.picture
}

</script>
<template>
  <main class="login-page">
    <div class="row">
      <img src="@/assets/images/logo.png" style="width:120px;margin:120px 0 0px 0;"/>
      <center class="Login-Registration-Text">登入/註冊</center>
      <GoogleLogin :callback="callback"/>
      <center class="welcome-Chinese">歡 迎 使 用 鯨 語</center>
      <center class="welcome-English">Welcome to use Whale Talk.</center>
    </div>
  </main>
</template>
<style lang="scss">
.login-page {
  text-align: center;

  .row{
    background-color: rgb(255, 255, 255);

    .Login-Registration-Text{
      font-size: 12pt;
      padding: 0;
      margin: 0;
      height: 30px;
      line-height: 30px;
      color: rgb(127, 144, 161);
      border: 0px;
      margin-top: 80px;
      margin-bottom: 10px;
    }

    .welcome-Chinese{
      font-size: 12pt;
      padding: 0;
      height: 30px;
      line-height: 30px;
      color: rgb(127, 144, 161);
      border: 0px;
      margin-top: 80px;
    }

    .welcome-English{
      font-size: 12pt;
      padding: 0;
      margin: 0;
      height: 30px;
      line-height: 30px;
      color: rgb(127, 144, 161);
      border: 0px;
    }
  }
}
</style>