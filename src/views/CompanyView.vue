<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { companyStore } from "@/stores/company";
import { NTabs, NTabPane } from "naive-ui";

const route = useRoute();
const cid = computed(() => {
  return route.params.cid;
});

const storeCompany = companyStore();

const cmpName = computed(() => {
  return storeCompany.name;
});
const projectList = computed(() => {
  return storeCompany.projectList;
});
const memberList = computed(() => {
  return storeCompany.memberList;
});
const isCompanyLoaded = computed(() => {
  return storeCompany.isCompanyLoaded;
});
const isProjectListLoaded = computed(() => {
  return storeCompany.isProjectListLoaded;
});
const isMemberListLoaded = computed(() => {
  return storeCompany.isMemberListLoaded;
});

onMounted(() => {
  storeCompany.setId(cid.value);
  storeCompany.subscribeCompany();
  storeCompany.subscribeMembers();
  storeCompany.subscribeProjects();
});
onUnmounted(() => {
  storeCompany.unsubscribe("company");
  storeCompany.unsubscribe("members");
  storeCompany.unsubscribe("projects");
});
</script>
<template>
  <main>
    <router-link to="/">back</router-link>
    <h1>Company</h1>
    <div v-if="!isCompanyLoaded">loading...</div>
    <div v-if="isCompanyLoaded">
      <h2>{{ cmpName }}</h2>
      <div>id: {{ cid }}</div>
    </div>
    <n-tabs type="line" size="large" animated>
      <n-tab-pane name="projects" tab="Projects">a</n-tab-pane>
      <n-tab-pane name="members" tab="Members">b</n-tab-pane>
    </n-tabs>
    <h3>Members</h3>
    <div v-if="!isMemberListLoaded">loading...</div>
    <div v-if="isMemberListLoaded">
      <div v-if="memberList.length === 0">no members yet</div>
      <ul v-if="memberList.length > 0">
        <li v-for="member in memberList" :key="member.id">
          <router-link :to="`/company/${cid}/member/${member.id}`">{{
            member.name
          }}</router-link>
        </li>
      </ul>
    </div>
    <h3>Projects</h3>
    <div v-if="!isProjectListLoaded">loading...</div>
    <div v-if="isProjectListLoaded">
      <div v-if="projectList.length === 0">no projects yet</div>
      <ul v-if="projectList.length > 0">
        <li v-for="project in projectList" :key="project.id">
          <router-link :to="`/company/${cid}/project/${project.id}`">{{
            project.name
          }}</router-link>
        </li>
      </ul>
    </div>
  </main>
</template>
