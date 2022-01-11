<template>
  <v-app id="app">
    <!--<UserAuthentication 
    v-if="$store.state.userAuthentication.isUser===false || $store.state.userAuthentication.isUser===null "
    />-->
    <Map/>
  </v-app>
</template>

<script>
//import UserAuthentication from "./components/UserAuthentication"
import Map from "./components/Map"
export default {
  name: "App",
  components: {
    //UserAuthentication,
    Map
  }
};
</script>

<style>

html, body {
  margin: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}
</style>
