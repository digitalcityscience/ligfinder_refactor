<template>
  <div class="map-container" ref="myMap">
    <div  class='spinner' v-if='$store.state.map.isLoading'>
        <img src= '../assets/4.gif'  :disabled='$store.state.map.isLoading' style = "position: absolute; margin:0 auto; left:50%; top: 50%;margin-top: -32px; transform: translate(0, -50%); z-index: 999; width: 64px; height: 64px">
    </div>
    <div class="placeholder"  id="map">
       <MouseCoordinate />
       <Panel />
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
    </div>
   
  </div>
</template>

<script>

import maplibregl from 'maplibre-gl'
//import {MapboxLayer} from '@deck.gl/mapbox';
//import {Deck} from '@deck.gl/core';
//import {PolygonLayer} from '@deck.gl/layers';
//import transformRotate from "@turf/transform-rotate";
//import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
//import { PlaneGeometry } from "@luma.gl/engine";

//import * as turf from "turf";
import MouseCoordinate from "./MouseCoordinate";
import Panel from './Panel'
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
import { createHtmlAttributesFOI } from '../utils/createHtmlAttributesFOI';


export default {
  name: "Map",
  components:{
    Panel,
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
    CompareLikedParcels
  },
  mounted: function() {
    this.$store.state.map.map = new maplibregl.Map({
      container: this.$refs.myMap,
      style: 'https://api.maptiler.com/maps/basic/style.json?key=XgdreUwN4V3uEHHZHsWO',
      center: [this.$store.state.map.initialLongitude,  this.$store.state.map.initialLatitude],
      zoom: this.$store.state.map.initialZoom,
      maxZoom: this.$store.state.map.maxZoom,
      minZoom: this.$store.state.map.minZoom
    });

    // Add zoom and rotation controls to the map.
    const zoomControl = new maplibregl.NavigationControl()
    this.$store.state.map.map.addControl(zoomControl);


    this.$store.state.map.map.on('mousemove', (e) => {
      //console.log(JSON.stringify(e.lngLat));
      let coords = e.lngLat
      this.$store.commit('mouseCoordinate/setMouseCoordinate', coords);
    });

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
