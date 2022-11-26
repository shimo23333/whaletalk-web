<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { Toast } from 'vant';

const router = useRouter();
</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="影片"
        fixed
    >
      <template #right>
        <van-icon name="wap-nav" size="20" @click="router.push({name: 'menu'})" />
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <h1>鯨語影片</h1>
    </div>
  </main>
</template>
