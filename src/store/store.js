// store/index.js

import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        isLoggedIn: false
    },
    getters: {
        getIsLoggedIn (state) {
            return state.isLoggedIn;
        }
    },
    mutations: {
        changeIsLoggedIn(state, value) {
            state.isLoggedIn = value
        }
    },
    actions: {}
});