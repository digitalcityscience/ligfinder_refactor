<template>
  <div class="map-container" ref="myMap">
   
   
  </div>
</template>

<script>

import maplibregl from 'maplibre-gl'
import { createHtmlAttributesFOI } from '../utils/createHtmlAttributesFOI';
import {LayerControl} from '../utils/createLayerControl';
import {AddDataControl} from '../utils/createAddDataControl'
import {AddBaseMapControl} from '../utils/createBaseMapControl'
import Split from 'split.js'

export default {
  name: "Map",
  mounted: function() {
    Split(['#left-container','#right-container'],{sizes:[25,75]})
    this.$store.state.map.map = new maplibregl.Map({
      container: this.$refs.myMap,
      style: this.$store.state.map.styles.lightOSM,
      center: [this.$store.state.map.initialLongitude,  this.$store.state.map.initialLatitude],
      zoom: this.$store.state.map.initialZoom,
      maxZoom: this.$store.state.map.maxZoom,
      minZoom: this.$store.state.map.minZoom,
    });
    let _this = this
    // Add eventlistener to resize gutter. Because map does not resizing itself when user resizing parent div
    document.getElementsByClassName('gutter gutter-horizontal')[0].addEventListener('mouseup',
      function(){
        mapResizer()
      })
    function mapResizer(t=_this) {
      t.$store.state.map.map.resize()
    }
    // Add zoom and rotation controls to the map.
    const zoomControl = new maplibregl.NavigationControl()
    this.$store.state.map.map.addControl(zoomControl);

    //Add layerlist controls to the map
    const layerControl = new LayerControl(_this,'',function(e,instance) {
        e.preventDefault()
        instance.$store.commit('layers/setLayersToggle')
        if(instance.$store.state.map.basemapOptionsToggle){
        instance.$store.commit('map/toggleBasemapOptionsPanel')
        }
        if(!instance.$store.state.layers.gotList){
          instance.$store.dispatch('layers/getTableNames')
        }
      }
    )
    this.$store.state.map.map.addControl(layerControl,'top-right');

    //Add import data control to the map
    const modalid = 'addDataModal'
    const addDataControl = new AddDataControl(_this,'',modalid,function(e,modalid,instance) {
        e.stopImmediatePropagation()
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
    const addBaseMapControl = new AddBaseMapControl(_this,buttonClass,buttonID,function(e,buttonID,instance) {
        e.preventDefault()
        instance.$store.commit('map/toggleBasemapOptionsPanel')
        if(instance.$store.state.layers.toggle){
        instance.$store.commit('layers/setLayersToggle')
        }
      }
    )
    this.$store.state.map.map.addControl(addBaseMapControl,'top-right');
    
    this.$store.state.map.map.on('click', 'stylelayer', (e) => {

      this.$store.dispatch('geoparsing/clusterpopup',e)
      
    })
    this.$store.state.map.map.on('click', 'foi', (e) => {
      let clickedParcel = e.features[0].properties.gid
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
</style>
<style>

.maplibregl-ctrl-top-right.mapboxgl-ctrl-top-right{
  display: flex;
  flex-direction: column;
}
.maplibregl-ctrl.maplibregl-ctrl-group.mapboxgl-ctrl.mapboxgl-ctrl-group:first-child{
  order:3
}
.maplibregl-popup-close-button.mapboxgl-popup-close-button {
    font-size: 2rem;
    background-color: white;
    overflow: hidden;
    height: 30px;
    display: flex;
    width: 30px;
    align-content: center;
    justify-content: center;
}
</style>