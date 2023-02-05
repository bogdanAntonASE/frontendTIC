// store/index.js

import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        isLoggedIn: false,
        shoppingCart: []
    },
    getters: {
        getIsLoggedIn (state) {
            return state.isLoggedIn;
        },
        getShoppingCart (state) {
            return state.shoppingCart;
        }
    },
    mutations: {
        changeIsLoggedIn(state, value) {
            state.isLoggedIn = value
        },
        changeShoppingCart(state, value) {
            if (state.shoppingCart && state.shoppingCart.length === 0) {
                if (sessionStorage.getItem('shoppingCart') && sessionStorage.getItem('shoppingCart').length > 0) {
                    state.shoppingCart = state.shoppingCart.concat(JSON.parse(sessionStorage.getItem('shoppingCart')));
                }
            }
            if (typeof value[Symbol.iterator] === 'function') {
                state.shoppingCart = value
            } else {
                state.shoppingCart.push(value)
            }
        }
    },
    actions: {}
});