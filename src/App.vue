<template>
  <img id="logo" src='./assets/logo.png'  width="150"/>
  <nav style="display: inline-block">
    <router-link to="/"><img src=""/>Home</router-link> |
    <router-link to="/shop" v-if="isLoggedInProp">Shop</router-link><span v-if="isLoggedInProp"> | </span>
    <router-link to="/shopping-cart" v-if="isLoggedInProp">
      Cart
      <img id="shopping-cart" src="./assets/shopping-cart.png"/>
    </router-link><span v-if="isLoggedInProp"> | </span>
    <router-link to="/about">About</router-link> |
    <router-link to="/contact">Contact</router-link> |
    <router-link to="/admin" v-if="isLoggedInProp && isAdmin">Administration</router-link><span v-if="isLoggedInProp && isAdmin"> | </span>
    <router-link to="/register" v-if="!isLoggedInProp">Register</router-link><span v-if="!isLoggedInProp"> | </span>
    <router-link to="/login" v-if="!isLoggedInProp">Login</router-link>
    <router-link to="/" id="logout" @click="logout" v-if="isLoggedInProp">Sing out</router-link>
  </nav>
  <router-view/>
</template>

<script>
export default {
  data: function () {
    const jwtToken = this.getCookie('jwtToken');
    if (jwtToken) {
      this.$store.commit('changeIsLoggedIn', true)
    }
    return {
      isLoggedIn: !!jwtToken
    }
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
    logout() {
      document.cookie = 'jwtToken' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push('/');
      this.$store.commit('changeIsLoggedIn', false)
    }
  },
  mounted() {
    this.isLoggedIn = this.$store.state.isLoggedIn;
    console.log();
  },
  computed: {
    isLoggedInProp: {
      get() {
        return this.$store.state.isLoggedIn
      },
      set(value) {
        this.$store.commit('changeIsLoggedIn', value)
      }
    },
    isAdmin: {
      get() {
        return this.$store.state.isAdmin
      },
      set(value) {
        this.$store.commit('changeIsAdmin', value)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#shopping-cart {
  zoom: 0.05;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  filter: invert(35%) sepia(64%) saturate(1456%) hue-rotate(323deg) brightness(77%) contrast(83%);
}

#logo {
  left: 0;
  top: 0;
}

#logout {
  color: #2c3e50;
}
</style>
