<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { apiGet } from '@/api/whaleApi';
import { Toast, Dialog } from 'vant';
import { showToast, showConfirmDialog, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

onMounted(() => {
  
})

const logout = () => {
  userStore.clear();
  whaleStore.clear();
  router.push({name: 'login'});
}

const onClickLeaveWhale = () => {
  showConfirmDialog({
    title: '離開此鯨語',
    message: '確定要離開此鯨語嗎？',
    confirmButtonText: '確定',
    cancelButtonText: '取消',      
  })
    .then(() => {
      leaveWhale();
    })
    .catch(() => {
      // on cancel
    });
}

const leaveWhale = () => {
  apiGet({
    url: 'Whale/RemoveWhale',
    params: {
      uid: userStore.uid,
      wid: whaleStore.wid,
    }
  })
  .then((resp) => {
    // 進入到鯨語選單
    router.push({name: 'choose-device'});
  })
  .catch((error) => {
    console.log("Failed");
    console.log(error);
    showFailToast('失敗');
  })
}

</script>
<template>
  <main class="menu-view full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="鯨語選單"
        :left-arrow="true"
        @click-left="router.go(-1);"
        fixed
    >
    </van-nav-bar>

    <!-- 頁面內容 -->
    <van-cell-group inset title="主功能">
      <van-cell title="首頁" icon="home-o"  is-link to="home"  />
      <van-cell title="歷史訊息" icon="notes-o"   is-link to="history"  />
      <van-cell title="影片" icon="video-o"   is-link to="video"  />
      <van-cell title="排程" icon="like-o"   is-link to="schedule"  />
    </van-cell-group>
    <van-cell-group inset :title="`裝置：${whaleStore.name}`">
      <van-cell title="鯨語設定" icon="setting-o"   is-link to="device-setting"  />
      <van-cell title="選擇鯨語" icon="smile-comment-o"   is-link to="choose-device"  />
      <van-cell title="加入鯨語" icon="add-o"   is-link to="add-device"  />
      <van-cell title="離開此鯨語" icon="close"   @click="onClickLeaveWhale"  />
    </van-cell-group>
    <van-cell-group inset title="其他">
      <van-cell title="隱私權政策" icon="bulb-o"  is-link to="privacy"   />
      <van-cell title="登出" icon="exchange"   @click="logout"  />
    </van-cell-group>
  </main>
</template>

<style lang="scss">
.menu-view {
  background-color: #eee;
}
</style>