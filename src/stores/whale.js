import { defineStore } from "pinia";

export const useWhaleStore = defineStore({
  id: "whale",
  state: () => ({
    wid: "",
    name: "",
    isAdmin: false,
  }),
  getters: {

  },
  actions: {
    setActiveWhale(data) {
      this.wid = data.wid;
      this.name = data.name;
      this.isAdmin = data.isAdmin;
    }
  },
});
