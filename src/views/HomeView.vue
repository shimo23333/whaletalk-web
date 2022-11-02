<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { userStore } from "@/stores/user";
import { NButton, NModal, NCard, NSpace, NInput } from "naive-ui";
import { collection, onSnapshot, addDoc, query, orderBy} from "firebase/firestore";
import { db } from "@/firebase";

let showModal = ref(false);

const storeUser = userStore();

const onLogin = () => {
  storeUser.signIn();
};

const onLogout = () => {
  storeUser.signOut();
};

const cmpList = computed(() => {
  return storeUser.whaleList;
});

const isCmpListLoaded = computed(() => {
  return storeUser.isWhaleListLoaded;
});



onMounted(() => {
  storeUser.subscribeWhaleList();
});
onUnmounted(() => {
  storeUser.unsubscribe("WhaleList");
});

const newCompanyName = ref("");

const companyCollectionRef = collection(db, "company");
const addTodo = () => {
  addDoc(companyCollectionRef, {
    name: newCompanyName.value,
    uid: storeUser['uid']
  });
  newCompanyName.value = "";
  showModal.value = false;
};

</script>
<template>
  <main>
    <h1>HOME</h1>

    <template v-if="storeUser.isLoggedIn">
      <div>name: {{ storeUser.name }}</div>
      <div>email: {{ storeUser.email }}</div>
      <div><router-link to="/settings">settings</router-link></div>
      <n-button tertiary @click="onLogout">Logout</n-button>
    </template>

    <template v-if="!storeUser.isLoggedIn">
      <n-button type="primary" @click="onLogin">Login</n-button>
    </template>

    <h2>
      Whale
      <span v-if="isCmpListLoaded">({{ cmpList.length }})</span>
    </h2>

    <!-- <n-button type="primary" @click="showModal = true">+</n-button> -->

    <template>
        <n-modal v-model:show="showModal">
          <n-card
            style="width: 600px"
            title="新增公司"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
          >
            <n-space vertical>
              <n-input
                v-model:value="newCompanyName"
                type="text"
                placeholder="請輸入公司名稱"
              />
            </n-space>
            <template #footer>
              <n-button type="tertiary" @click="showModal = false">
                取消
              </n-button>
              <n-button type="success" @click="addTodo"> 確定 </n-button>
            </template>
          </n-card>
        </n-modal>
    </template>

    <template v-if="!isCmpListLoaded">
      <div>loading...</div>
    </template>
    <div v-if="isCmpListLoaded && cmpList.length === 0">no company yet</div>
    <div v-if="isCmpListLoaded && cmpList.length > 0">
      <div v-for="cmp in cmpList" :key="cmp.id">
        <router-link :to="`/company/${cmp.id}`">
          {{ cmp.wid }}
        </router-link>
      </div>
    </div>
  </main>
</template>
