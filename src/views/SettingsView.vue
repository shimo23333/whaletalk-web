<script setup>
import { userStore } from "@/stores/user";
const storeUser = userStore();
</script>
<template>
  <main>
    <h1>Settings</h1>
    <template v-if="storeUser.isLoggedIn">
      <div>name: {{ storeUser.name }}</div>
      <div>email: {{ storeUser.email }}</div>
    </template>
  </main>
</template>
