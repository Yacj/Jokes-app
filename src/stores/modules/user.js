import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "User",
  state: () => ({
    token: null,
    info: []
  }),
  getters: {},
  actions: {
    setToken(token) {
      this.token = token;
    },
    setInfo(info) {
      this.info = info;
    }
  }
});
