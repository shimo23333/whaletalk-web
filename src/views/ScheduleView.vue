<script setup>

</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="排程"
        fixed
    >
      <template #right>
        <van-icon name="wap-nav" size="20" @click="router.push({name: 'menu'})" />
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <h1>鯨語排程</h1>
    </div>
  </main>
</template>
