<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { showToast, showConfirmDialog, showFailToast } from 'vant';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const formValue = ref(null);
const isLoading = ref(false);
const isSubmiting = ref(false);
const enableSchedule = ref(false);
const showDatePicker = ref(false);
const showTimePicker = ref(false);
const dateValue = ref(null);
const timeValue = ref(null);
const timeOptions = ref([])

const initTimeOptions = () => {
  timeOptions.value = [];
  for(let i = 0; i < 24; i++) {
    let timeTxt1 = `${i}:00`;
    let timeTxt2 = `${i}:30`;

    if (i < 10) {
      timeTxt1 = `0${i}:00`;
      timeTxt2 = `0${i}:30`;
    }

    timeOptions.value.push({text: timeTxt1, value: timeTxt1})
    timeOptions.value.push({text: timeTxt2, value: timeTxt2})
  }
}

onMounted(() => {
  loadMessage(route.query.id);
  initTimeOptions();
})

const loadMessage = (id) => {
  isLoading.value = true;

  apiGet({
    url: 'Message/Get',
    params: { id }
  })
  .then((resp) => {
    formValue.value = resp;

    if (resp.schedule_time) {
      const d = new Date(resp.schedule_time);
      enableSchedule.value = true;
      dateValue.value = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      let h = d.getHours();
      if (h < 10) {
        h = `0${h}`;
      }

      let m = "00";
      if (d.getMinutes() === 30) {
        m = "30";
      }

      timeValue.value = `${h}:${m}`;
    }
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('無法取得留言');
  })
  .finally(() => {
    isLoading.value = false;
  })
}

const onDatePickerConfirm = (d) => {
  dateValue.value = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  showDatePicker.value = false;
}

const onTimePickerConfirm = (t) => {
  timeValue.value = t.selectedOptions[0].text;
  showTimePicker.value = false;
}

const onSubmit = () => {
  isSubmiting.value = true;

  let formTime = null;
  if (enableSchedule && dateValue.value && timeValue.value) {
    formTime = `${dateValue.value} ${timeValue.value}:00`;
  }

  apiGet({
    url: 'Message/Update',
    params: { 
      id: formValue.value.id,
      type: formValue.value.type,
      content: formValue.value.content,
      time: formTime,
    }
  })
  .then((resp) => {
    showToast({
      message: '已儲存',
      icon: 'success',
      duration: 500,
    });
    router.go(-1);
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('無法取得留言');
  })
  .finally(() => {
    isLoading.value = false;
  })
}

const onRemoveClick = () => {
  showConfirmDialog({
    title: '刪除留言',
    message: '確定要刪除留言嗎？',
    confirmButtonText: '是，刪除',
    cancelButtonText: '取消',
  })
    .then(() => {
      removeMessage();
    })
}

const removeMessage = () => {
  apiGet({
    url: 'Message/Remove',
    params: { 
      id: formValue.value.id,
    }
  })
  .then((resp) => {
    showToast({
      message: '已刪除',
      icon: 'success',
      duration: 500,
    });
    router.go(-1);
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('無法刪除留言');
  })
}

</script>
<template>
  <main class="full-page has-navbar">
    <!--  -->
    <van-nav-bar
        title="編輯對話"
        :left-arrow="true"
        right-text="刪除"
        @click-left="router.go(-1);"
        @click-right="onRemoveClick"
        fixed
    >
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div v-if="isLoading" style="text-align: center">
      <van-loading />
    </div>
    <van-form v-if="formValue" @submit="onSubmit">  
      <van-cell-group inset>
        <div style="font-size: 9pt; color: #aaa; text-align:center; margin: 15px">
          <span v-if="formValue.type === 1">文字訊息</span>
          <span v-if="formValue.type === 2">語音訊息</span>
        </div>
        <div style="padding: 15px" v-if="formValue.type === 2">
          <audio id="audio" controls style="width: 100%" :src="`http://localhost/${formValue.content}`"></audio>
        </div>
        <van-field
          v-if="formValue.type === 1"
          v-model="formValue.content"
          rows="1"
          autosize
          label="留言"
          type="textarea"
          placeholder="請輸入留言"
        />
        <van-field name="switch" label="排程">
          <template #input>
            <van-switch v-model="enableSchedule" />
          </template>
        </van-field>
        <van-field
          v-if="enableSchedule"
          v-model="dateValue"
          is-link
          readonly
          name="datePicker"
          label="排程日期"
          placeholder="選擇日期"
          @click="showDatePicker = true"
        />
        <van-calendar v-model:show="showDatePicker" @confirm="onDatePickerConfirm" confirm-text="確認" />
        <van-field
          v-if="enableSchedule"
          v-model="timeValue"
          is-link
          readonly
          name="timePicker"
          label="排程時間"
          placeholder="選擇時間"
          @click="showTimePicker = true"
        />
        <van-popup v-model:show="showTimePicker" round position="bottom">
          <van-picker
            :columns="timeOptions"
            @cancel="showTimePicker = false"
            @confirm="onTimePickerConfirm"
            confirm-button-text="確認"
            cancel-button-text="取消"
          />
        </van-popup>
      </van-cell-group>
      
      <div style="margin: 16px;">
        <van-row gutter="20">
          <van-col span="8">
            <van-button round block @click="router.go(-1)">
              取消
            </van-button> 
          </van-col>
          <van-col span="16">
            <van-button round block type="primary" :loading="isSubmiting" native-type="submit">
              儲存
            </van-button> 
          </van-col>
        </van-row>
      </div>
    </van-form>
  </main>
</template>

<style lang="scss">

</style>