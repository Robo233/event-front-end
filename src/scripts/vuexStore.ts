import { createStore } from 'vuex';

function parseLocalStorageItem(key: string) {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
}

const userFromLocalStorage = parseLocalStorageItem('user');

export default createStore({
  state: {
    user: userFromLocalStorage || null,
  },
  mutations: {
    SET_USER(state, userData) {
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    LOGOUT_USER(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
  actions: {
    setUser({ commit }, userData) {
      console.log("Received user data in action:", userData);
      console.log(localStorage.getItem('token'));
      commit('SET_USER', userData);
    },
    logoutUser({ commit }) {
      commit('LOGOUT_USER');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    }
  }
});

