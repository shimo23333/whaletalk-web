import { defineStore } from "pinia";

export const useWhaleStore = defineStore({
  id: "whale",
  state: () => ({
    wid: localStorage.getItem('whale_wid') || null,
    name: localStorage.getItem('whale_name') || null,
    image: localStorage.getItem('whale_image') || null,
    isAdmin: localStorage.getItem('whale_is_admin') || null,
  }),
  getters: {

  },
  actions: {
    setActiveWhale(data) {
      this.wid = data.wid;
      this.name = data.name;
      this.image = data.image;
      this.isAdmin = data.isAdmin;

      // 紀錄到 localStorage 
      localStorage.setItem('whale_wid', data.wid);
      localStorage.setItem('whale_name', data.name);
      localStorage.setItem('whale_image', data.image);
      localStorage.setItem('whale_is_admin', data.isAdmin);
    },
    clear() {
      this.wid = null;
      this.name = null;
      this.image = null;
      this.isAdmin = null;

      // 紀錄到 localStorage 給之後免登入使用
      localStorage.removeItem('whale_wid');
      localStorage.removeItem('whale_name');
      localStorage.removeItem('whale_image');
      localStorage.removeItem('whale_is_admin');
    }
  },
});
