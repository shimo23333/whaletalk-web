<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import moment from 'moment';

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

const onClickItem = (item) => {
  router.push({name: 'message-editor', query: {id: item.id}});
}


const formatTime = (timeTxt) => {
  //const d = new Date(timeTxt);
  //return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  return moment(timeTxt).format('MM-DD, hh:mm A');
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
        <van-icon name="wap-nav" size="20" @click="router.push({name: 'menu'})" />
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
          <div v-for="item in messageList" :key="item.id" class="message-item">
            <div @click="onClickItem(item)">
              <div style="font-size: 9pt; color: #aaa;">
                <span v-if="item.type === 1">文字訊息</span>
                <span v-if="item.type === 2">語音訊息</span>
              </div>
              <div>{{ item.content }}</div>
              <div v-if="item.schedule_time" style="font-size: 9pt; color: blue;">
                排程：{{ formatTime(item.schedule_time) }}
              </div>
              <div style="font-size: 9pt; color: #aaa;">{{ formatTime(item.create_at) }}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </main>
</template>
<style lang="scss">
.message-item {
  margin: 10px 10px;
  padding: 10px;
  background-color: #fff;
}

</style>