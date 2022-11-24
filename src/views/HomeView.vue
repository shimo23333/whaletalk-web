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
    <div class="padding-x">
      <h1>鯨語首頁</h1>
      <div>
        <span>{{ whaleStore.name }}</span>
        <span v-if="whaleStore.isAdmin">(管理員)</span>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>