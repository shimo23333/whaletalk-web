<script setup>
import { computed } from "@vue/runtime-core";
import { RouterView } from "vue-router";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const activePage = null;


// 置頂標題
const navBarTitle = computed(() => {
  return route.meta.title;
})

// 是否顯示置頂選單
const isShowNavbar = computed(() => {
  const hidePages = ['login', 'choose-device', 'add-device'];
  return !hidePages.includes(route.name);
})

// 是否顯示返回按鈕（左）
const isShowNavLeftArrow = computed(() => {
  const hidePages = ['home', 'history', 'video', 'schedule'];
  return !hidePages.includes(route.name);
})

// 是否顯示置頂選單按鈕（右）
const isShowNavRightMenu = computed(() => {
  const hidePages = ['login', 'choose-device', 'add-device', 'menu'];
  return !hidePages.includes(route.name);
})


// 是否顯示置底選單
const isShowTabbar = computed(() => {
  const hidePages = ['login', 'choose-device', 'add-device', 'menu'];
  return !hidePages.includes(route.name);
})

const onClickNavLeft = () => {
  router.go(-1);
};

const onClickNavMenu = () => {
  router.push({name: 'menu'});
};

</script>

<template>
  <div>
      <!-- 置頂頁首 -->
      <van-nav-bar
        v-if="isShowNavbar"
        :title="navBarTitle"
        :left-arrow="isShowNavLeftArrow"
        @click-left="onClickNavLeft"
        fixed
      >
        <template #right>
          <van-icon v-if="isShowNavRightMenu" name="wap-nav" size="20" @click="onClickNavMenu" />
        </template>
      </van-nav-bar>

      <!-- RouterView 裡面會依網址插入 router/index.js 裡的定義的對應頁面元件（頁面元件通常在 view 資料夾裡）-->
      <RouterView />
      
      <!-- 置底選單 --> 
      <van-tabbar route v-model="activePage" v-if="isShowTabbar">
        <van-tabbar-item name="home" replace to="/home" icon="home-o">首頁</van-tabbar-item>
        <van-tabbar-item name="history" replace to="/history" icon="search">歷史紀錄</van-tabbar-item>
        <van-tabbar-item name="video" replace to="/video" icon="friends-o">影片</van-tabbar-item>
        <van-tabbar-item name="schedule" replace to="/schedule" icon="setting-o">排程</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
