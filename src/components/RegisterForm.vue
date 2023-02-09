<template>
  <form id="register-form" @submit.prevent="submit">

      <div class="col-12 form-group" :class="{ error: v$.form.fullname.$errors.length }">
        <label class="col-form-label col-form-label-lg">Full Name <span class="text-danger">*</span> </label>
        <input type="text" v-model="v$.form.fullname.$model" :class="{ 'is-invalid': v$.form.fullname.$errors.length }" class="form-control form-control-lg">

        <div class="input-errors" v-for="(error, index) of v$.form.fullname.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>
      <div class="col-12 form-group" :class="{ error: v$.form.country.$errors.length }">
        <label class="col-form-label col-form-label-lg">Country <span class="text-danger">*</span> </label>
        <select class="form-control form-control-lg" v-model="v$.form.country.$model" :class="{ 'is-invalid': v$.form.country.$errors.length }" >
          <option value="" selected disabled hidden>Select Country</option>
          <option value="RO">
            Romania
          </option>
          <option value="MD">
            Moldova
          </option>
        </select>
        <div class="input-errors" v-for="(error, index) of v$.form.country.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>
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

      <div class="col-12 form-group">
        <label><input type="checkbox" required="required"> I agree with terms and conditions. <span class="text-danger">*</span> </label>
      </div>

      <div class="col-12 form-group text-center">
        <button class="btn btn-danger btn-lg col-4" :disabled="v$.form.$invalid" style="font-weight: bold" type="submit">Submit</button>
      </div>

  </form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from "axios";

const backend = 'https://tic-project.onrender.com/api/v1'

export function validName(name) {
  let validNamePattern = new RegExp('^[a-zA-Z -]{3,}$');
  return validNamePattern.test(name);
}

export function validPassword(password) {
  let validPasswordPattern = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
  return validPasswordPattern.test(password);
}

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  name: "RegisterForm",
  data: function () {
    return {
      form: {
        fullname: '',
        email: '',
        country: '',
        password: '',
        conditions: null
      }
    }
  },
  methods: {
    submit() {
      let payload = {
        fullname: this.form.fullname,
        country: this.form.country.valueOf(),
        email: this.form.email,
        password: this.form.password,
        isAdmin: false,
        isDisabled: false
      };

      axios.post(backend + '/register', payload)
          .then(() => {
            this.$forceUpdate();
            this.$router.push('/');
          });
    }
  },
  validations () {
    return {
      form: {
        fullname: { required, name_validation: {
            $validator: validName,
            $message: 'Invalid name.'
          }
        },
        email: { required, email, name_validation: {
            $message: 'Invalid email.'
          }
        },
        country: { required },
        password: { required, name_validation: {
            $validator: validPassword,
            $message: 'Invalid password.'
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