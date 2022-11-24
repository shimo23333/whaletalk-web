<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { Toast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const isLoading = ref(false);

const formValue = ref({
  wid: whaleStore.wid,
  name: whaleStore.name,
});

// 新增
const onSubmit = () => {
  isLoading.value = true;

  apiGet({
    url: 'WhalePage/UpdateWhale',
    params: {
      wid: formValue.value.wid,
      name: formValue.value.name,
    }
  })
  .then((resp) => {
    Toast.success('修改成功');
    setTimeout(() => {
      router.push({name: 'choose-device'});
    }, 200);
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 500) {
      Toast.fail(error.response.data);
    }
    else {
      Toast.fail('連線失敗');
    }
  })
  .finally(() => {
    console.log("Finally");
    isLoading.value = false;
  });
};

const onCancel = () => {
  router.go(-1);
}



</script>
<template>
  <main class="full-page has-navbar">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formValue.wid"
          name="鯨語ID"
          label="鯨語ID"
          placeholder="鯨語ID"
          disabled
          :rules="[{ required: true, message: '請填寫鯨語ID' }]"
        />
        <van-field
          v-model="formValue.name"
          name="鯨語名稱"
          label="鯨語名稱"
          placeholder="顯示名稱"
          :rules="[{ required: true, message: '請填寫鯨語名稱' }]"
        />
      </van-cell-group>
      <van-space direction="vertical" fill style="margin: 30px 20px;">
        <van-button 
          round block 
          type="primary" 
          native-type="submit" 
          :loading="isLoading"
          loading-text="傳送中...">
          儲存
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