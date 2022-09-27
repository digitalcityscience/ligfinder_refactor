<template>
  <div class="map-container" ref="myMap">
    
    <div  class='spinner' v-if='$store.state.map.isLoading'>
        <img src= '../assets/4.gif'  :disabled='$store.state.map.isLoading' style = "position: absolute; margin:0 auto; left:50%; top: 50%;margin-top: -32px; transform: translate(0, -50%); z-index: 999; width: 64px; height: 64px">
    </div>
    <div class="placeholder"  id="map">
       <MouseCoordinate />
       
       <!--<Database />
       <Layer />-->
       <Layers />
       <Tools />
       <Ligfinder />
       <Geoparsing />
       <Classification />
       <Legend />
       <Alert />
       <AddData />
       <User />
      <CompareLikedParcels />
      <BaseMaps />
    </div>
   
  </div>
</template>

<script>

import maplibregl from 'maplibre-gl'
import MouseCoordinate from "./MouseCoordinate";
//import Database from './Database'
//import Layer from './Layer'
import Layers from './Layers'
import Tools from './Tools'
import Ligfinder from './Ligfinder'
import Geoparsing from './Geoparsing'
import Classification from './Classification'
import Legend from './Legend'
import Alert from './Alert'
import AddData from './AddData'
import User from './User'
import CompareLikedParcels from './CompareLikedParcels'
import BaseMaps from './BaseMaps'
import { createHtmlAttributesFOI } from '../utils/createHtmlAttributesFOI';
//import BoxCustomLayer from "../utils/BoxCustomLayer"; 

export default {
  name: "Map",
  components:{
    MouseCoordinate,
    //Database,
    //Layer,
    Layers,
    Tools,
    Ligfinder,
    Geoparsing,
    Classification,
    Legend,
    Alert,
    AddData,
    User,
    CompareLikedParcels,
    BaseMaps
  },
  mounted: function() {
    this.$store.state.map.map = new maplibregl.Map({
      container: this.$refs.myMap,
      style: this.$store.state.map.styles.lightOSM,
      center: [this.$store.state.map.initialLongitude,  this.$store.state.map.initialLatitude],
      zoom: this.$store.state.map.initialZoom,
      maxZoom: this.$store.state.map.maxZoom,
      minZoom: this.$store.state.map.minZoom,
    });
    // Add zoom and rotation controls to the map.
    const zoomControl = new maplibregl.NavigationControl()
    this.$store.state.map.map.addControl(zoomControl);

    
    this.$store.state.map.map.on('mousemove', (e) => {
      //console.log(JSON.stringify(e.lngLat));
      let coords = e.lngLat
      this.$store.commit('mouseCoordinate/setMouseCoordinate', coords);
    });

    
    let _this = this
    
    this.$store.state.map.map.on('click', 'stylelayer', (e) => {

      this.$store.dispatch('geoparsing/clusterpopup',e)
      
    })
    this.$store.state.map.map.on('click', 'foi', (e) => {
      let clickedParcel = e.features[0].properties.gid
      console.log(clickedParcel)
      const coordinates = [e.lngLat.lng, e.lngLat.lat]
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      let popup = new maplibregl.Popup()
      popup.setLngLat(coordinates)
      popup.setDOMContent(
        createHtmlAttributesFOI(
          this.$store.state,
          this.$store,
          clickedParcel,
          e.lngLat.lng,
          e.lngLat.lat,
          e.features[0].properties
        )
      )
      
      popup.addTo(this.$store.state.map.map);
    })
    this.$store.state.map.map.on('click', 'geocoded', (e) => {
      if (_this.$store.state.geoparsing.datasetMode == 'newspaper'){
        this.$store.dispatch('geoparsing/newspaperPopup',e)
      }
      else if (_this.$store.state.geoparsing.datasetMode == 'parliament'){
        this.$store.dispatch('geoparsing/parliamentPopup',e)
      }            
    })

/*function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}


this.$store.state.map.map.on('click',  (e) => {
  let boxLayer = new BoxCustomLayer({
    id: makeid(5),
    geomcenter: [e.lngLat.lng, e.lngLat.lat]
    
  })
  _this.$store.state.map.map.addLayer(boxLayer);
})*/

  },
  watch: {
    '$store.state.ligfinder.FOI': function() {
      this.$store.dispatch('area/removeAreaFilterLayer')
      this.$store.dispatch('criteria/removeCriteriaFilterLayer')
      this.$store.dispatch('joinParcels/removeTouchingParcelLayer')
      
    }
  }
   
};
</script>

<!--"scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '~maplibre-gl/dist/maplibre-gl.css';
.map-container {
  height: 100%;
  width: 100%;
}
.placeholder {
  height: 100%;
  width: 100%;
  position:absolute;
  background-color: darkgray;
 
}
.placeholder .placeholder-text {
  margin: auto;
}

</style>
