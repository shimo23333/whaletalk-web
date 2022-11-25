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

</script>
<template>
  <main class="full-page has-navbar">
    <div class="padding-x">
      <div>
        <van-image
          width="150px"
          height="150px"
          style="border: 1px solid #ccc">
        </van-image>
      </div>
      <div>
        <van-button icon="volume" round :loading="isSendingVoice"></van-button>
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
        <van-button icon="guide-o" round @click="onSendText" :loading="isSendingText"></van-button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>