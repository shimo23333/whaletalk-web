<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { showToast, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const whaleList = ref([]);
const isLoading = ref(true);

onMounted(() => {
  // 項後端取得此帳號的鯨語列表
  apiGet({
    url: 'Whale/GetList',
    params: {
      uid: userStore.uid,
    }
  })
  .then((resp) => {
    console.log("Success");
    console.log(resp);
    whaleList.value = resp;

  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('連線失敗');
  })
  .finally(() => {
    console.log("Finally");
    isLoading.value = false;
  });
})

function onWhaleClick(wid, name, image, isAdmin) {
  console.log(wid);

  // 登記選擇的鯨語wid
  whaleStore.setActiveWhale({
    wid, 
    name, 
    image,
    isAdmin
  });

  // 進入鯨語主頁
  router.push('/home');
}

</script>
<template>
  <main>
    <div class="padding-x">
      <van-loading type="spinner" v-if="isLoading" />
        <div class="row">
          <img src="@/assets/images/logo.png" style="width:80px;margin:0px 130px;"/>
          <div class="whalegroup" v-for="whale in whaleList" :key="whale.wid">
            <!--選擇鯨語的一個一個區塊 含邊框-->
            <div class="whale" @click="onWhaleClick(whale.wid, whale.name, whale.image, whale.is_admin === '1')">
              <div>
                <!--對象頭貼-->
                <van-image
                  :src="`https://suc.tw/${whale.image}`"
                  width="170px"
                  height="170px"
                  fit="cover"
                  style="border: 1px solid #ccc; border-radius:50%; overflow:hidden; margin: 30px 30px 0 30px;">
                </van-image>
              </div>
              <!--對象暱稱-->
              <div>{{ whale.name }}</div>
            </div>
          </div>
        </div>
      <!--<div class="textgroup">
        <center class="welcome">請 選 擇 發 送 對 象</center>
        <center class="welcome">Please select your Whale Talk.</center>
      </div>-->
      <div style="margin:40px 100px;"> <!--加入鯨語按鈕-->
        <van-button to="add-device">新 增 裝 置</van-button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

.whale {
  border-radius: 50px;
  width: 250px;
  height: 250px;
  margin: 30px auto 20px auto;
  text-align: center;
  box-shadow: rgb(23 88 154 / 20%) 0px 0px 8px;
  background-color: rgb(248, 248, 248);
}
.row {
  margin-top: 45px;
}

.textgroup {
  margin-top: 40px;
}
.welcome {
  font-size: 12pt;
  padding: 0;
  margin: 0;
  height: 30px;
  line-height: 30px;
  color: rgb(127, 144, 161);
  border: 0px;
}

body {
  background-color: #f7f8f8;
}

</style>