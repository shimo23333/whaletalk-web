<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet, apiPostFile } from '@/api/whaleApi';
import { showToast, showConfirmDialog, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

const isLoading = ref(false);

const formValue = ref({
  wid: whaleStore.wid,
  name: whaleStore.name,
  image: whaleStore.image,
});

const imageList = ref([]);

onMounted(() => {
  if (whaleStore.image != null && whaleStore.image.trim != "") {
    imageList.value = [{url: `http://whaletalk-api.suc.tw/${whaleStore.image}`, status: 'done'}];
  }
});


// 新增
const onSubmit = () => {
  isLoading.value = true;

  apiGet({
    url: 'Whale/UpdateWhale',
    params: {
      wid: formValue.value.wid,
      name: formValue.value.name,
      image: formValue.value.image,
    }
  })
  .then((resp) => {
    showSuccessToast('修改成功');
    setTimeout(() => {
      router.push({name: 'choose-device'});
    }, 200);
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
    isLoading.value = false;
  });
};

const onCancel = () => {
  router.go(-1);
}


const afterRead = (file) => {

  file.status = 'uploading';
  file.message = '上傳中...';

  const data = new FormData();
  data.append('image', '123');
  data.append('file', file.content);

  apiPostFile({
    url: 'Whale/UploadImage',
    data,
  })
  .then((resp) => {
    file.status = 'done';
    file.message = '';
    formValue.value.image = resp.image;
  }).catch((error) => {
    file.status = 'failed';
    file.message = '上傳失敗';
  });
};


</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="設定"
        fixed
    >
      <template #right>
        <van-icon name="wap-nav" size="20" @click="router.push({name: 'menu'})" />
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formValue.wid"
          name="whaleId"
          label="鯨語ID"
          placeholder="鯨語ID"
          disabled
          :rules="[{ required: true, message: '請填寫鯨語ID' }]"
        />
        <van-field
          v-model="formValue.name"
          name="whaleName"
          label="鯨語名稱"
          placeholder="顯示名稱"
          :rules="[{ required: true, message: '請填寫鯨語名稱' }]"
        />
        <van-field
          name="cover"
          label="封面圖片"
        >
          <template #input>
            <van-uploader
              v-model="imageList"
              :after-read="afterRead"
              :max-count="1"
              :show-upload="imageList.length == 0"
            >
            </van-uploader>
          </template>
        </van-field>
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