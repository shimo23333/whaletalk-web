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
    url: 'WhalePage/GetList',
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

function onWhaleClick(wid, name, isAdmin) {
  console.log(wid);

  // 登記選擇的鯨語wid
  whaleStore.setActiveWhale({
    wid, 
    name, 
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
        <div class="whale" @click="onWhaleClick(whale.wid, whale.name, whale.is_admin === '1')">{{ whale.name }} ({{ whale.wid }})</div>
      </div>
      <div style="margin-top: 30px">
        <van-button to="add-device">加入鯨語</van-button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.whale {
  background-color: #fff;
  border-radius: 20px;
  height: 150px;
  padding: 20px;
  margin: 0 0 20px 0;
  box-shadow: 1px 1px 15px rgba(0,0,0,0.1);
}
</style>