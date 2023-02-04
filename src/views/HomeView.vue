<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { Toast } from 'vant';

const router = useRouter();
const userStore = useUserStore();
const whaleStore = useWhaleStore();

onMounted(() => {
  
})

</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        :title="whaleStore.name"
        fixed>
    
      <template #right>
        <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div>
        <div style="text-align: center;">
          <div><!-- 頭貼圖片 -->
            <van-image
              :src="`https://suc.tw/${whaleStore.image}`"
              width="80px"
              height="80px"
              fit="cover"
              style="border: 1px solid #ccc; border-radius: 15px; overflow:hidden; margin: 0 0 240px 0;border:0;">
            </van-image>
          </div>
          <div>
            <van-button class="home-start-button" type="primary" round style="width: 200px; height: 50px; background-color:#fff; font-size:14pt; font-weight:bold; color:#17589A; border:0; box-shadow:0px 2px 8px rgba(23,88,154,0.4); " to="message">開 始 對 話</van-button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.home-start-button {
  font-size: 20pt;
}

.padding-x{
  background-image:url("images/一張背景圖片");
}

</style>