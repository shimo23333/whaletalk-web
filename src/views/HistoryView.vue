<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import MessageItem from '@/components/MessageItem.vue';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const messageList = ref([]);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const isShowEditor = ref(false);

onMounted(() => {
  onRefresh();
})

const onRefresh = () => {
  refreshing.value = true;
  onLoad();
}

const onLoad = () => {
  loading.value = true;
  finished.value = false;

  apiGet({
    url: 'Message/GetMyList',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
    }
  })
  .then((resp) => {
    messageList.value = resp;
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 500) {
      showFailToast(error.response.data);
    }
    else {
      showFailToast('連線失敗');
    }
  })
  .finally(() => {
    refreshing.value = false;
    loading.value = false;
    finished.value = true;
  });
}

</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="歷史紀錄"
        fixed
    >
      <template #right>
        <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <MessageItem
            v-for="item in messageList"
            :key="item.id" 
            :item="item"
          />
        </van-list>
      </van-pull-refresh>
    </div>
  </main>
</template>
<style lang="scss">
</style>