// store/index.js
import axios from "axios";

export const state = () => ({
  users: [],
  selectedUser: null,
  userPosts: [],
});

export const mutations = {
  setUsers: (state, users) => {
    state.users = users;
  },
  setSelectedUser: (state, user) => {
    state.selectedUser = user;
  },
  setUserPosts: (state, posts) => {
    state.userPosts = posts;
  },
};

export const actions = {
  getUsers: async ({ commit }) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      commit("setUsers", response.data);
    } catch (error) {
      console.error("Не удалось найти users:", error);
    }
  },
  getSelectedUsers: async ({ commit, dispatch }, userId) => {
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      commit("setSelectedUser", data);
      dispatch("resetUserPosts");
    } catch (error) {
      console.error("Не удалось выбрать user:", error);
    }
  },
  getUserPosts: async ({ commit, state }) => {
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${state.selectedUser.id}`
      );
      commit("setUserPosts", data);
    } catch (error) {
      console.error("Не удалось загрузить posts:", error);
    }
  },
  resetUserPosts: ({ commit }) => {
    commit("setUserPosts", []);
  },
};
