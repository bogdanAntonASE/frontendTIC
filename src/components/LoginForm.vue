<template>
  <form id="register-form" @submit.prevent="submit">
    <div class="col-12 form-group" :class="{ error: v$.form.email.$errors.length }">
      <label class="col-form-label col-form-label-lg">Email <span class="text-danger">*</span> </label>
      <input type="text" v-model="v$.form.email.$model" :class="{ 'is-invalid': v$.form.email.$errors.length }" class="form-control form-control-lg">
      <div class="input-errors" v-for="(error, index) of v$.form.email.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>
    <div class="col-12 form-group" :class="{ error: v$.form.password.$errors.length }">
      <label class="col-form-label col-form-label-lg">Password <span class="text-danger">*</span> </label>
      <input type="password" v-model="v$.form.password.$model" :class="{ 'is-invalid': v$.form.password.$errors.length }" class="form-control form-control-lg">
      <div class="input-errors" v-for="(error, index) of v$.form.password.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>

    <div class="col-12 form-group text-center">
      <button class="btn btn-danger btn-lg col-4" :disabled="v$.form.$invalid" style="font-weight: bold" type="submit">Submit</button>
    </div>

  </form>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import axios from "axios";
import {email, required} from "@vuelidate/validators";
import {validPassword} from "@/components/RegisterForm";
import {useToast} from "vue-toastification";

const backend = 'http://localhost:3000/api/v1';

export default {
  setup () {
    const toast = useToast();
    return { toast, v$: useVuelidate() }
  },
  name: "LoginForm",
  data: function () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submit() {
      let payload = {
        email: this.form.email,
        password: this.form.password,
      };

      axios.post(backend + '/login', payload)
          .then((res) => {
            document.cookie = 'jwtToken=' + res.data.jwtToken;
            this.$store.commit("changeIsLoggedIn", true);
            this.$store.commit("changeIsAdmin", res.data.isAdmin)
            sessionStorage.setItem('isAdmin', res.data.isAdmin)
            this.$router.push('/');
            return true;
          })
          .catch((err) => {
            useToast().error(err.response.data.message)
          });
    }
  },
  validations () {
    return {
      form: {
        email: { required, email, name_validation: {
            $message: 'Email not present in database.'
          }
        },
        password: { required, name_validation: {
            $validator: validPassword,
            $message: 'Wrong password.'
          }
        }
      }
    }
  }
}

</script>

<style scoped>
.form-group {
  font-weight: bold;
}
</style>