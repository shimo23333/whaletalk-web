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
      <h1>請選擇你的鯨語</h1>
      <van-loading type="spinner" v-if="isLoading" />
      <div v-for="whale in whaleList" :key="whale.wid">
        <div class="whale" @click="onWhaleClick(whale.wid, whale.name, whale.image, whale.is_admin === '1')">
          <div>
            <van-image
              :src="`https://suc.tw/${whale.image}`"
              width="150px"
              height="150px"
              fit="cover"
              style="border: 1px solid #ccc; border-radius: 15px; overflow:hidden; box-shadow: 1px 1px 15px rgba(0,0,0,0.1);">
            </van-image>
          </div>
          <div>{{ whale.name }}</div>
        </div>
      </div>
      <div style="margin-top: 30px">
        <van-button to="add-device">加入鯨語</van-button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.whale {
  border-radius: 20px;
  margin: 0 0 20px 0;
  text-align: center;
}
</style>