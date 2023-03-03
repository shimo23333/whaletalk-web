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
      <div class="time-list"><!--時間-->
        <div v-for="t in 24" class="time-item">
          <div class="ty">
            <div>
              <span class="time-code">
              <span v-if="t < 10">0{{t}}</span>
              <span v-else>{{t}}</span>
              <span>:00</span>
              </span>

              <span class="records">
                <span v-for="r in getRecordInHour(t)" class="record-item" >
                  {{ r.name }}
                  <img :src="r.picture">
                </span>
              </span>
            </div>

            <!-- 按鈕 -->
            <div class="add-btn" @click="onAdd(t)">
              <div class="line-1"></div>
              <div class="line-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showRecordDialog"
      @click-overlay="onCancel"
      :style="{ padding: '64px' }">
      <div v-if="!isRecording">
        <div class="recorded-text">新增預錄？</div>
        <div class="recording-button-group">
          <div class="recording-button" @click="onStartRecord">確定</div>
          <div class="recording-button" @click="onCancel">取消</div>
        </div>
      </div>
      <div v-if="isRecording">
        <div>錄音中...</div>
        <div class="recording-button-group">
          <div class="recording-button" @click="onSubmit">送出</div>
          <div class="recording-button" @click="isRecording = false">取消</div>
        </div>
      </div>
    </van-popup>
  </main>
</template>

<style lang="scss">
.who {
  display: grid;
  grid-template-columns: auto auto;
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

.time-list{
  margin:20px 0 100px 0;
}

.ty{
  display: grid;
  grid-template-columns: auto auto;
  padding: 10px 10px;
  border-bottom:1px solid #C0D3ED;
  color: rgb(23, 88, 154);
  font-size: 14pt;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
/*按鈕*/
.add-btn { /* + */
  position: relative;
}
.line-1 {
  position: absolute;
  display: block;
  width: 17px;
  right: 0px;
  height: 4px;
  background-color:#C0D3ED;
  border-radius: 50px;
  top: 13px;
}
.line-2 {
  position: absolute;
  display: block;
  width: 17px;
  right: 0px;
  height: 4px;
  background-color: #C0D3ED;
  transform: rotate(90deg);
  border-radius: 50px;
  top: 13px;
}


.recording-button-group{
    display: grid;
    
    grid-template-columns: auto auto;
    color: rgb(255, 255, 255);
    font-size: 14pt;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif;
}
.recording-button{
    width: 50px;
    height: 30px;
    line-height:30px;
    text-align: center;
    border-radius: 20px;
    background-color: rgb(23, 88, 154);
    font-size: 12pt;
    font-weight: bold;
    color: rgb(255, 255, 255);
    padding: 0 5px;
    margin:0 5px;
}
.recorded-text{
  font-size: 10pt;
  color: rgb(23, 88, 154);
  
}

</style>