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
  <main class="full-page has-navbar message-view">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title=""
        :left-arrow="true"
        @click-left="router.go(-1);"
        fixed>

        <template #right>
          <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
        </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="msg-content-view padding-x">

      <!-- 置頂頭貼圖片 -->
      <div class="avatar-pic">
        <img :src="`https://suc.tw/${whaleStore.image}`">
      </div>
      <div class="avatar-pic-name">
        {{ whaleStore.name }}
      </div>

      <!-- 置底輸入框 -->
      <div class="msg-input-view">
        <div class="msg-inputs"><!-- (開始錄音)((留言)(送出)) -->
          <div style="padding: 0 10px; text-align: center">
            <!-- 開始錄音按鈕 -->
            <div
              v-if="!isRecording"
              class="record-btn"
              @click="onStartRecord">
              <img src="@/assets/images/Keyboard_Voice.png">
            </div>
            <!-- 結束錄音按鈕 -->
            <div
              v-if="isRecording"
              class="record-btn"
              @click="onEndRecord">
              <img src="@/assets/images/Keyboard_Voice.png">
            </div>
          </div>
          <div style="flex-grow: 1;">
            <!--傳送框的白色大區塊-->
            <div class="text-input-and-button">
              <van-field
                v-model="messageText"
                label=""
                placeholder="Aa"
                label-width="0px"
                :disabled="isSendingText"
              />
              <!--發送鍵-->
              <div class="send-btn" :class="{'loading': isSendingText }" @click="onSendText">
                <img src="@/assets/images/Send.png">
              </div>
              <!-- <van-button class="send-btn" icon="guide-o" round @click="onSendText" :loading="isSendingText" :disabled="!isEnableSendTextBtn">送出文字</van-button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

.message-view {
  background-color: #fff;

  .van-button--default {/*取消發送鍵的邊界線*/
    border: var(--van-button-border-width) solid rgb(255 255 255 / 0%);
  }

  .msg-content-view {
    padding: 0 0 150px 0;
  }

  .avatar-pic {
    position: fixed;
    top: 0;
    left: 50%;
    width: 50px;
    z-index: 999;
    padding-top: 15px;

    >img {
      display: block;
      width: 100px;
      border: 1px solid #ccc;
      border-radius: 15px;
      overflow: hidden;border:0;
      margin: 0 0 0 -55px;
      border: 7px solid #fff;
    }
  }

  .avatar-pic-name {
    position: fixed;
    top: 130px;
    left: 0;
    width: 100%;
    text-align: center;
    text-shadow: 0 0 5px rgb(255, 255, 255);
    font-weight: bold;
  }

  .msg-input-view {
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100%;
    padding: 35px 15px;
    background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(240,244,246,1) 54%, rgba(227,234,239,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(240,244,246,1) 54%,rgba(227,234,239,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(240,244,246,1) 54%,rgba(227,234,239,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#e3eaef',GradientType=0 );

    .msg-inputs {
      display: flex;
      width: 100%;
      height: 50px;
      align-items: center;

      .record-btn {
        background-color: #fff;
        width: 55px;
        height: 55px;
        border-radius: 28px;

        >img {
          width: 100%;
        } 
      }

      .text-input-and-button {
        display: flex;
        background-color: #fff;
        width: 100%;
        height: 50px;
        border-radius: 23px;
        overflow: hidden;

        >.van-cell.van-field {
          height: 50px;

          .van-field__control {
            line-height: 30px;
            font-size: 15pt;
            padding-left: 4px;
          }
        }

        >.send-btn {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 4px;

          &.loading {
            opacity: 0.4;
          }

          >img {
            display: block;
            width: 80%;
            height: 80%;
          }
        }
      }
    }
  }
}


</style>