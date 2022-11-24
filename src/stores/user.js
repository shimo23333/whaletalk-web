import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    uid: "",
    email: "",
    name: "",
    picture: "",
  }),
  getters: {
    isLoggedIn: (state) => state.uid !== "",
  },
  actions: {
    setLoginData(data) {
      this.uid = data.uid;
      this.email = data.email;
      this.name = data.name;
      this.picture = data.picture;
    }
  },
});
