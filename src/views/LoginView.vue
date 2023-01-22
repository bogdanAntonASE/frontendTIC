<template>
  <div class="container-fluid h-100" id="login-form">
    <div class="row h-100">
      <div class="col-md-12 h-100 d-flex justify-content-center align-items-md-baseline">

        <div class="col-md-5 register rounded px-5 py-4 shadow bg-white text-left">
          <h1 class="text-center py-2"><b>Sign In</b></h1>
          <LoginForm/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm";
export default {
  name: 'RegisterView',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
#login-form {
  zoom: 75%;
}
</style>