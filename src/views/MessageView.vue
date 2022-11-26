<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { Toast, showToast, showConfirmDialog, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const messageText = ref("");
const isSendingVoice = ref(false);
const isSendingText = ref(false);

onMounted(() => {
  
})

const onSendText = () => {

  isSendingText.value = true;

  apiGet({
    url: 'Message/Add',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
      type: 1, // 1:文字, 2:聲音
      content: messageText.value
    }
  })
  .then((resp) => {
    showToast({
      message: '成功送出',
      icon: 'success',
      duration: 500,
    });
    messageText.value = ""; // 清空
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('失敗');
  })
  .finally(() => {
    isSendingText.value = false;
  })
}

// 傳送文字按鈕是否能使用
const isEnableSendTextBtn = computed(() => {
  
  // 如果已經在傳送中，不行 
  if (isSendingText.value) return false;
  
  // 如果沒有輸入文字，不行
  if (messageText.value.trim() === "") return false;

  // 其他，可以
  return true;
});

</script>
<template>
  <main class="full-page has-navbar">
    <div class="padding-x">
      <div style="text-align:center;">
        <van-image
          width="100px"
          height="100px"
          style="border: 1px solid #ccc">
        </van-image>
      </div>
      <div>
        <van-cell-group inset>
          <van-field
            v-model="messageText"
            rows="1"
            autosize
            label="留言"
            type="textarea"
            placeholder="請輸入留言"
            :disabled="isSendingText"
          />
        </van-cell-group>
        <van-button icon="guide-o" round @click="onSendText" :loading="isSendingText" :disabled="!isEnableSendTextBtn">送出</van-button>
      </div>
      <div>
        <van-button icon="volume" round :loading="isSendingVoice">開始錄音</van-button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>