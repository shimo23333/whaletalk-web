<script setup>
import { defineProps, computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from 'moment';

const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    default: () => { return {
      id: 0,
      type: 0,
      content: "",
      schedule_time: null,
      create_at: null,
    }}
  }
})

const onClickItem = (item) => {
  router.push({name: 'message-editor', query: {id: item.id}});
}


const formatTime = (timeTxt) => {
  return moment(timeTxt).format('MM-DD, hh:mm A');
} 
</script>
<template>
  <div class="message-item">
    <div @click="onClickItem(item)">
      <div style="font-size: 9pt; color: #aaa;">
        <span v-if="item.type === 1">文字訊息</span>
        <span v-if="item.type === 2">語音訊息</span>
      </div>
      <div>
        <div v-if="item.type === 1">{{ item.content }}</div>
        <div v-if="item.type === 2">
          <audio id="audio" controls style="width: 100%" :src="`http://localhost/${item.content}`"></audio>
        </div>
      </div>
      <div v-if="item.schedule_time" style="font-size: 9pt; color: blue;">
        排程：{{ formatTime(item.schedule_time) }}
      </div>
      <div style="font-size: 9pt; color: #aaa;">{{ formatTime(item.create_at) }}</div>
    </div>
  </div>
</template>
<style lang="scss">
.message-item {
  margin: 10px 10px;
  padding: 10px;
  background-color: #fff;
}
</style>