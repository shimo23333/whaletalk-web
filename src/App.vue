<script setup>
import { RouterView } from "vue-router";
import { userStore } from "@/stores/user";
import { NConfigProvider } from "naive-ui";
import { darkTheme } from "naive-ui";

const storeUser = userStore();
storeUser.initAuthStateListener();
storeUser.initAutoSignIn();
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <RouterView />
    </n-config-provider>
  </div>
</template>
