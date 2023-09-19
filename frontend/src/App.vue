<template>
  <v-app id="app">
      <Panel />
      <div class="main-container">
        <div class="modules" id="left-container">
              <Ligfinder />
              <Geoparsing />
              <Classification />
        </div>
        <div class="right-container" id="right-container">
            <Map/>
            <MapHelpers/>
        </div>
      </div>
      <AddData />
  </v-app>
</template>

<script>
import Map from "./components/Map"
import Panel from './components/Panel'
import Ligfinder from './components/Ligfinder'
import Geoparsing from './components/Geoparsing'
import Classification from './components/Classification'
import MapHelpers from './components/MapHelpers'
import AddData from './components/AddData'

export default {
  name: "App",
  components: {
    Map,
    Panel,
    Ligfinder,
    Geoparsing,
    Classification,
    MapHelpers,
    AddData
    
  }
};
</script>

<style>

html, body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}
.mapboxgl-popup-content, .maplibregl-popup-content {
  width:300px;
  
}
.main-container {
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: row;
}
.modules {
  background-color: rgba(0, 48, 99,0.1);
  padding: 10px 0 10px 10px;
}
.modules,.right-container{
  height: 100%;
}
.gutter.gutter-horizontal:hover{
  cursor: col-resize;
}
.gutter.gutter-horizontal{
  background-color: rgba(0, 48, 99,0.1);
}
</style>
