<template>
  <div class="map-container" ref="myMap">
    
    <div  class='spinner' v-if='$store.state.map.isLoading'>
        <img src= '../assets/4.gif'  :disabled='$store.state.map.isLoading' style = "position: absolute; margin:0 auto; left:50%; top: 50%;margin-top: -32px; transform: translate(0, -50%); z-index: 999; width: 64px; height: 64px">
    </div>
    <div class="placeholder"  id="map">
       <MouseCoordinate />
       <div class="layers-container" v-if="$store.state.layers.toggle">
        <Layers />
       </div>
       <Tools />
       <Ligfinder />
       <Geoparsing />
       <Classification />
       <Legend />
       <Alert />
       <v-dialog
        activator='#addDataModal'
        v-model="$store.state.addData.toggle"
        max-width="50vw"
        persistent
       >
       <v-card>
        <v-card-title class="d-flex flex-row-reverse"><v-btn @click="$store.commit('addData/addDataToggle')" icon ><v-icon>mdi-close</v-icon></v-btn></v-card-title>
        <v-card-text><AddData /></v-card-text>
       </v-card>
        
       </v-dialog>
       
      <CompareLikedParcels />
      <BaseMaps />
    </div>
   
  </div>
</template>

<script>

import maplibregl from 'maplibre-gl'
import MouseCoordinate from "./MouseCoordinate";
import Layers from './Layers'
import Tools from './Tools'
import Ligfinder from './Ligfinder'
import Geoparsing from './Geoparsing'
import Classification from './Classification'
import Legend from './Legend'
import Alert from './Alert'
import AddData from './AddData'
import CompareLikedParcels from './CompareLikedParcels'
import BaseMaps from './BaseMaps'
import { createHtmlAttributesFOI } from '../utils/createHtmlAttributesFOI';
import {LayerControl} from '../utils/createLayerControl';
import {AddDataControl} from '../utils/createAddDataControl'
import {AddBaseMapControl} from '../utils/createBaseMapControl'

export default {
  name: "Map",
  components:{
    MouseCoordinate,
    Layers,
    Tools,
    Ligfinder,
    Geoparsing,
    Classification,
    Legend,
    Alert,
    AddData,
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

    let _this = this
    //Add layerlist controls to the map
    const layerControl = new LayerControl(_this,'',function(e,instance) {
        e.preventDefault()
        instance.$store.commit('layers/setLayersToggle')
        if(instance.$store.state.map.basemapOptionsToggle){
        instance.$store.commit('map/toggleBasemapOptionsPanel')
        }
        if(instance.$store.state.layers.tableNames.length == 0){
          instance.$store.dispatch('layers/getTableNames')
        }
      }
    )
    this.$store.state.map.map.addControl(layerControl,'top-right');

    //Add import data control to the map
    console.log(_this)
    const modalid = 'addDataModal'
    const addDataControl = new AddDataControl(_this,'',modalid,function(e,modalid,instance) {
        e.preventDefault()
        instance.$store.commit('addData/dropAreaToggle')
        if(instance.$store.state.layers.toggle){
        instance.$store.commit('layers/setLayersToggle')
        }
        if(instance.$store.state.map.basemapOptionsToggle){
        instance.$store.commit('map/toggleBasemapOptionsPanel')
        }
      }
    )
    this.$store.state.map.map.addControl(addDataControl,'top-right');
    
    //Add basemap control to the map
    const buttonID = ''
    const buttonClass = ''
    console.log('adding basemap control...')
    const addBaseMapControl = new AddBaseMapControl(_this,buttonClass,buttonID,function(e,buttonID,instance) {
        e.preventDefault()
        instance.$store.commit('map/toggleBasemapOptionsPanel')
        if(instance.$store.state.layers.toggle){
        instance.$store.commit('layers/setLayersToggle')
        }
      }
    )
    this.$store.state.map.map.addControl(addBaseMapControl,'top-right');
    console.log(this.$store.state.map.map)
    
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
.w-50{
  width: 50vw;
}
</style>
<style>

.maplibregl-ctrl-top-right.mapboxgl-ctrl-top-right{
  display: flex;
  flex-direction: column;
}
.maplibregl-ctrl.maplibregl-ctrl-group.mapboxgl-ctrl.mapboxgl-ctrl-group:first-child{
  order:3
}
.layers-container{
  position: absolute;
  right: 0;
}
</style>