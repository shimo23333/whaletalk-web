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

// 暫存的已傳送訊息列表
const messages = ref([]);

let recorder;

onMounted(() => {
  getAllMessage();
})

const getAllMessage = () => {
  apiGet({
    url: 'Message/GetUnreadList',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
    }
  })
  .then((resp) => {
    messages.value = resp;

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

const deleteMsg = (id) => {
  apiGet({
    url: 'Message/remove',
    params: {
      id: id,
    }
  })
  .then((resp) => {
    getAllMessage()
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('失敗');
  })
  .finally(() => {
    
  })
}

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

    // 加到已送出訊息清單暫時的紀錄
    sentMsgList.value.push({
      id: new Date().getTime(),
      type: 1,
      content: messageText.value
    })

    // 清空輸入匡
    messageText.value = ""; 

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

    // 加到已送出訊息清單暫時的紀錄
    sentMsgList.value.push({
      id: new Date().getTime(),
      type: 2,
      content: voiceFile
    })
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
    <van-button type="normal" @click="getAllMessage()">重新整理</van-button>
    <div class="msg-content-view padding-x">
      <div>
        <div v-for="msg in messages" :key="msg.id" style="margin: 10px; border-bottom: 1px solid #ccc; padding: 5px; font-size: 10pt;">
          <div style="color: #888">{{ msg.type === 1 ? '文字' : '語音'  }}</div>
          <div style="color: #000; font-weight: bold;">{{ msg.content }}</div>
          <div style="color: #888">{{ msg.create_at }}</div>
          <div style="text-align: right;"><van-button type="warning" @click="deleteMsg(msg.id)">刪除</van-button></div>
        </div>
      </div>

      <!-- 置頂頭貼圖片 -->
      <div class="avatar-pic">
        <img :src="`https://whaletalk.tw/api/${whaleStore.image}`">
      </div>
      <div class="avatar-pic-name">
        {{ whaleStore.name }}
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

  .sent-msg-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-height: 75vh;
    justify-content: flex-end;

    >.sent-msg-item {
      padding: 10px;
      width: 100%;
      text-align: right;

      >.dialog {
        display: inline-block;
        color: #1E549C;
        background-color: #EDF6FB;
        padding: 10px;
        text-align: justify;
        max-width: 80%;
        margin: 0 0 0 auto;
      }
    }
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
        justify-content: center;
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
  .recording-pic{
    background-color: aqua;

  }
}


</style>