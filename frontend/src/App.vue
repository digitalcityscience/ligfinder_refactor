<template>
  <v-app id="app">
    <Map/>
  </v-app>
</template>

<script>
import Map from "./components/Map"
export default {
  name: "App",
  components: {
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
