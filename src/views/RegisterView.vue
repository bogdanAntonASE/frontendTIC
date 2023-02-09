<template>
  <div class="container-fluid h-100" id="registration-form">
    <div class="row h-100">
      <div class="col-md-12 h-75 d-flex justify-content-center align-items-md-baseline">

        <div class="col-md-5 register rounded px-5 py-4 shadow bg-white text-left">
          <h1 class="text-center py-2"><b>Register Form</b></h1>
          <RegisterForm/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm";
export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  }
}
</script>


<style>
.register {
  margin-top: 4%;
}
#registration-form {
  zoom: 75%;
}
</style>