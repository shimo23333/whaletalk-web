<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { decodeCredential } from 'vue3-google-login'
import { apiGet } from '@/api/whaleApi';
import { Toast } from 'vant';

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
    Toast.fail('連線失敗');
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
    <h1>Whaletalk</h1>
    <GoogleLogin :callback="callback"/>
  </main>
</template>
<style lang="scss">
.login-page {
  text-align: center;
}
</style>