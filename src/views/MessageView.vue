<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet, apiPostFile } from '@/api/whaleApi';
import { Toast, showToast, showConfirmDialog, showFailToast } from 'vant';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const messageText = ref("");
const isSendingVoice = ref(false);
const isSendingText = ref(false);
const isRecording = ref(false);

let recorder;

onMounted(() => {
  AudioRecorder.encoder = mpegEncoder;
  AudioRecorder.prototype.mimeType = 'audio/mpeg'
  window.MediaRecorder = AudioRecorder;
})

const isEnableVoice = computed(() => {
  return !MediaRecorder.notSupported;
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


const onSendVoice = (voiceFile) => {

  isSendingVoice.value = true;

  apiGet({
    url: 'Message/Add',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
      type: 2, // 1:文字, 2:聲音
      content: voiceFile
    }
  })
  .then((resp) => {
    showToast({
      message: '成功送出',
      icon: 'success',
      duration: 500,
    });
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('失敗');
  })
  .finally(() => {
    isSendingVoice.value = false;
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


// 開始錄音
const onStartRecord = () => {
  isRecording.value = true;

  // Request permissions to record audio
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream)

    // Set record to <audio> when recording will be finished
    recorder.addEventListener('dataavailable', e => {
      // audio.src = URL.createObjectURL(e.data);

      const formData = new FormData();
      formData.append("name", "vincent");
      formData.append("audio", e.data);

      apiPostFile({
        url: 'Message/UploadVoice', 
        data: formData,
      })
      .then((resp) => {
        onSendVoice(resp.voice);
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
    })

    // Start recording
    recorder.start()
  })
}

const onEndRecord = () => {
  isRecording.value = false;
  
  // Stop recording
  recorder.stop()

  // Remove “recording” icon from browser tab
  recorder.stream.getTracks().forEach(i => i.stop())
}

</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="對話"
        :left-arrow="true"
        @click-left="router.go(-1);"
        fixed
    >
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div style="text-align:center;">
        <van-image
          :src="`http://whaletalk-api.suc.tw/${whaleStore.image}`"
          width="100px"
          height="100px"
          fit="cover"
          style="border: 1px solid #ccc; border-radius: 15px; overflow: hidden;">
        </van-image>
      </div>
      <div style="margin-bottom: 20px; text-align: center">
        <van-button 
          v-if="!isRecording"
          icon="volume"
          type="primary"
          round 
          :loading="isSendingVoice" 
          @click="onStartRecord"
        >
          開始錄音
        </van-button>
        <van-button
          v-if="isRecording"
          icon="volume"
          type="warning"
          round
          :loading="isSendingVoice"
          @click="onEndRecord"
        >
          結束錄音
        </van-button>
      </div>
      <div style="display: flex; width: 100%;">
        <div style="flex-grow:1;">
            <van-field
              v-model="messageText"
              rows="1"
              autosize
              label=""
              type="textarea"
              placeholder="請輸入留言"
              label-width="0px"
              :disabled="isSendingText"
            />
        </div>
        <div style="width: 85px; padding-left: 5px">
          <van-button icon="guide-o" round @click="onSendText" :loading="isSendingText" :disabled="!isEnableSendTextBtn">送出</van-button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>