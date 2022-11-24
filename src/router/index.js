import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        title: '登入',
      },
    },
    {
      path: "/choose-device",
      name: "choose-device",
      component: () => import("../views/ChooseDeviceView.vue"),
      meta: {
        title: '選擇鯨語',
      },
    },
    {
      path: "/add-device",
      name: "add-device",
      component: () => import("../views/AddDeviceView.vue"),
      meta: {
        title: '加入鯨語',
      },
    },
    {
      path: "/device-setting",
      name: "device-setting",
      component: () => import("../views/DeviceSettingView.vue"),
      meta: {
        title: '鯨語設定',
      },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        title: '首頁',
      },
    },
    {
      path: "/history",
      name: "history",
      component: () => import("../views/HistoryView.vue"),
      meta: {
        title: '歷史紀錄',
      },
    },
    {
      path: "/video",
      name: "video",
      component: () => import("../views/VideoView.vue"),
      meta: {
        title: '影片',
      },
    },
    {
      path: "/schedule",
      name: "schedule",
      component: () => import("../views/ScheduleView.vue"),
      meta: {
        title: '排程',
      },
    },
    {
      path: "/menu",
      name: "menu",
      component: () => import("../views/MenuView.vue"),
      meta: {
        title: '選單',
      },
    },
  ],
});


router.beforeEach(async (to) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const userStore = useUserStore();

  if (authRequired && !userStore.isLoggedIn) {
    return '/login';
  }
});

export default router;
