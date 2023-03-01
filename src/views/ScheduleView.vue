<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { Toast, Popup, showToast, showFailToast } from 'vant';
import { apiGet, apiPostFile } from '@/api/whaleApi';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';

let recorder;
const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const hour = ref(0);
const showRecordDialog = ref(false);
const isRecording = ref(false);
const isSendingVoice = ref(false);
const historyRecord = ref([]);

onMounted(() => {
  AudioRecorder.encoder = mpegEncoder;
  AudioRecorder.prototype.mimeType = 'audio/mpeg'
  window.MediaRecorder = AudioRecorder;

  updateRecordList();
})


const isEnableVoice = computed(() => {
  return !MediaRecorder.notSupported;
})

const onAdd = (t) => {
  hour.value = t;
  isRecording.value = false;
  showRecordDialog.value = true;
}

const onCancel = () => {
  showRecordDialog.value = false;

  setTimeout(() => {
    isRecording.value = false;
  }, 900);
}

const onSubmit = () => {
  // 傳資料
  onEndRecord();

  // 關掉
  onCancel(); 
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

// 傳送聲音
const onSendVoice = (voiceFile) => {
  isSendingVoice.value = true;

  const d = new Date();

  apiGet({
    url: 'Message/Add',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
      type: 2, // 1:文字, 2:聲音
      content: voiceFile,
      schedule_time: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${hour.value}:00:00`
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
    updateRecordList();
  })
}


const updateRecordList = () => {
  const d = new Date();
  apiGet({
    url: 'Message/GetList',
    params: {
      wid: whaleStore.wid,
      type: 2,
      sts: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 00:00:00`,
      ste: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 23:59:59`
    }
  })
  .then((resp) => {
    historyRecord.value = resp;
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('取得資料失敗');
  })
}

const getRecordInHour = (h) => {
  const vaildRecords = [];
  for (let i = 0; i < historyRecord.value.length; i++) {
    const r = historyRecord.value[i];
    const a = new Date(r.schedule_time);
    if (a.getHours() == h) {
      vaildRecords.push(r);
    }
  }
  return vaildRecords;
} 

</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="排程"
        fixed
    >
      <template #right>
        <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div class="who">
        <div class="others">所有人</div>
        <div class="mine">我</div>
      </div>
      <div class="time-list">
        <div
          v-for="t in 24"
          class="time-item"
        >
          <span class="time-code">
            <span v-if="t < 10">0{{t}}</span>
            <span v-else>{{t}}</span>
            <span>:00</span>
          </span>
          <span class="records">
            <span
              v-for="r in getRecordInHour(t)"
              class="record-item"
            >
              {{ r.name }}
              <img :src="r.picture">
            </span>
          </span>
          <button class="add-btn" @click="onAdd(t)">+</button>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showRecordDialog"
      @click-overlay="onCancel"
      :style="{ padding: '64px' }">
      <div v-if="!isRecording">
        <div>開始錄音</div>
        <button @click="onStartRecord">確定</button>
        <button @click="onCancel">取消</button>
      </div>
      <div v-if="isRecording">
        <div>錄音中...</div>
        <button @click="onSubmit">送出</button>
        <button @click="isRecording = false">取消</button>
      </div>
    </van-popup>
  </main>
</template>

<style lang="scss">
.who {
  display: grid;
  grid-template-columns: auto auto;
  background-color: aqua;
  justify-items: center;
}
.others{
  width: 70px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background-color: bisque;
  margin: 5px;
  padding:0 5px;
}
.mine{
  width: 70px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background-color: bisque;
  margin: 5px;
  padding:0 5px;
}
</style>