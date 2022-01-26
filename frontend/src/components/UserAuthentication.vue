<template>
  <div class="container h-100 d-flex justify-content-center align-items-center">
    <div class="col-md-4 col-md-offset-4">
      <div class="panel panel-default">
        <div class="alert alert-danger" role="alert" v-show="$store.state.userAuthentication.isUser===false">
          Incorrect Username or Password!
        </div>
        <div class="panel-heading">
          <h3 class="panel-title">Please sign in</h3>
        </div>
        <div class="panel-body">
          <form role="form" v-on:submit.prevent="submitForm">
            <fieldset>
              <div class="form-group">
                <input class="form-control" placeholder="Username" name="usernamne" type="text" v-model="loginForm.username">
              </div>
              <div class="form-group mt-3">
                <input class="form-control" placeholder="Password" name="password" type="password" value="" v-model="loginForm.password">
              </div>
              
              <div class="form-group">
                <button class="btn btn-lg btn-success btn-block mt-3" type="submit" value="Login" v-on:Click="submitForm">Login</button>
              </div>
              
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HTTP } from '../utils/http-common';
export default {
  name: "UserAuthentication",
  data(){
      return{
        loginForm:{
          username: '',
          password:''
        }
      }
  },
  methods:{
    submitForm(){
      const payload = {
        username: this.loginForm.username,
        password: this.loginForm.password,
      };
      HTTP.post('login', payload)
      
        .then((res) => {
          this.$store.commit('userAuthentication/userValidation', res.data.isUser)
        })
        .catch((err) => {
            console.log(err)
        }).finally(() => {
            //Perform action in always
      });
    }
  }
}
</script>

<style scoped>

</style>