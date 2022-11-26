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
        title="隱私權政策"
        fixed
        :left-arrow="true"
        @click-left="router.go(-1);"
    >
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <h1>隱私權政策</h1>
    </div>
  </main>
</template>
