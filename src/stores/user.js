import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    // 從 localStorage 取得前一次登入資料（免登入）
    uid: localStorage.getItem('user_uid') || null,
    email: localStorage.getItem('user_email') || null,
    name: localStorage.getItem('user_name') || null,
    picture: localStorage.getItem('user_picture') || null,
  }),
  getters: {
    isLoggedIn: (state) => { return state.uid !== null; },
  },
  actions: {
    setLoginData(data) {
      // 記錄到 state
      this.uid = data.uid;
      this.email = data.email;
      this.name = data.name;
      this.picture = data.picture;

      // 紀錄到 localStorage 給之後免登入使用
      localStorage.setItem('user_uid', data.uid);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_picture', data.picture);
    },
    clear() {
      this.uid = null;
      this.email = null;
      this.name = null;
      this.picture = null;

      // 紀錄到 localStorage 給之後免登入使用
      localStorage.removeItem('user_uid');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_picture');
    }
  },
});
