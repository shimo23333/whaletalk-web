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
        title="排程"
        fixed
    >
      <template #right>
        <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div class="who">
        <div class="others">所有人</div>
        <div class="mine">我</div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.who {
  display: grid;
  grid-template-columns: auto auto;
  background-color: aqua;
  justify-items: center;
}
.others{
  width: 70px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background-color: bisque;
  margin: 5px;
  padding:0 5px;
}
.mine{
  width: 70px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background-color: bisque;
  margin: 5px;
  padding:0 5px;
}
</style>