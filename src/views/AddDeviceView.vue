<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { showToast, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const isLoading = ref(false);

const formValue = ref({
  wid: "",
});

// 新增
const onSubmit = () => {
  isLoading.value = true;

  apiGet({
    url: 'WhalePage/JoinWhale',
    params: {
      uid: userStore.uid,
      wid: formValue.value.wid,
    }
  })
  .then((resp) => {
    showSuccessToast('加入成功');
    setTimeout(() => {
      router.push({name: 'choose-device'});
    }, 500);
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
    console.log("Finally");
    isLoading.value = false;
  });
};

const onWhaleClick = (wid, name, isAdmin) => {
  console.log(wid);

  // 登記選擇的鯨語wid
  whaleStore.setActiveWhale({
    wid, 
    name, 
    isAdmin
  });

  // 進入鯨語主頁
  router.push('/home');
}

const onCancel = () => {
  router.push({name: 'choose-device'});
}



</script>
<template>
  <main>
    <h1 style="text-align: center">加入鯨語</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formValue.wid"
          name="鯨語ID"
          label="鯨語ID"
          placeholder="鯨語ID"
          :rules="[{ required: true, message: '請填寫鯨語ID' }]"
        />
      </van-cell-group>
      <van-space direction="vertical" fill style="margin: 30px 20px;">
        <van-button 
          round block 
          type="primary" 
          native-type="submit" 
          :loading="isLoading"
          loading-text="傳送中...">
          送出
        </van-button>
        <van-button 
          round block
          @click="onCancel"
          style="margin-top: 5px"
        >
          取消
        </van-button>
      </van-space>
    </van-form>
  </main>
</template>

<style lang="scss">
.whale {
  border: 1px solid #ccc;
  border-radius: 15px;
  height: 150px;
  padding: 20px;
}
</style>