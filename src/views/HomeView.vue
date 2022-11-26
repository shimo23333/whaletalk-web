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
        fixed
    >
      <template #right>
        <van-icon name="wap-nav" size="20" @click="router.push({name: 'menu'})" />
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div>
        <div style="text-align: center;">
          <div>
            <van-image
              :src="`http://localhost/${whaleStore.image}`"
              width="200px"
              height="200px"
              fit="cover"
              style="border: 1px solid #ccc">
            </van-image>
          </div>
          <div>
            <van-button type="primary" round style="width: 100px" to="message">開始對話</van-button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>