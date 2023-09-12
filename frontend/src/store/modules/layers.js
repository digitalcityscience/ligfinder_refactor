import { HTTP } from '../../utils/http-common';
import { createHtmlAttributes } from '../../utils/createHtmlAttributes';
import Vue from 'vue'
import maplibregl from 'maplibre-gl'
const layers = {
    namespaced: true,
    state:{
        iconColor: '#ababab',
        toggle: false,
        tableNames: [],
        addedTableNames: [],
        addedLayers: [],
        gotList : false
        
    },
    mutations:{
        handleCheckboxStatus(state,payload){
            const table = state.tableNames
            const index = table.findIndex((e)=>{return e['name']==payload.tableName})
            state.tableNames[index].checked = payload.isChecked
        },
        setLayersToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        },
        layersToggle(state){
            state.toggle=false
        },
        setTableNames(state, rootState, payload){
            state.tableNames = payload
            
        },
        initLayerStyle(state, payload){
           
            let style 
            if (payload.features[0].geometry.type==="Point" || payload.features[0].geometry.type==="MultiPoint"){
                style= Object.assign({},{'type': 'circle', 'circle-color': '#8931e0', 'circle-opacity': 1})

            }
            else{
                style= Object.assign({},{'type': 'fill','fillColor': '#00FF00', 'fillOutlineColor': '#000000', "fillopacity": 1 })

            }
                
            Vue.set(state,payload.name+"Style", style)
           
        },
        updateFOI({state},payload){
            for (let i=0; i<state.addedLayers.length; i++){
                if(state.addedLayers[i].name === "foi"){
                    state.addedLayers.splice(i, 1);
                }
            }
            state.addedLayers.push(payload.data)
        }
        
       
    },
    actions:{
        getTableNames({state, rootState}){
            if (state.toggle==true){   /* 
                                                    to avoid sending get request when closing the panel
                                                    */
                HTTP
                .get('table-names')
                .then(response => {
                    const tableList = response.data
                    for (let i of tableList) {
                        i['checked'] = false
                    }
                    state.tableNames = [...tableList,...state.tableNames]
                    if (rootState.ligfinder.FOI.features.length>0 ){
                        state.tableNames.push({id:100, name: "foi", checked:true})
                        let style =Object.assign({},{'type': 'fill','fillColor': '#d99ec4', 'fillOutlineColor': '#000000', "fillopacity": 0.7 })
                        Vue.set(state,"foiStyle", style)
                    }
                    state.gotList = true
                })
            }
        },
        addTable({state,  rootState, commit}, payload){
            const clickedTableName = payload.name;
            
            if (clickedTableName!= "foi" && payload.id != 'geocoded'){
                rootState.map.isLoading = true
                HTTP
                .post('add-table', {
                    tablename : clickedTableName
                })
                .then(response => {
                    commit('initLayerStyle', response.data)
                    let layerName = response.data.name
                    rootState.map.map.addSource(response.data.name,{'type': 'geojson', 'data': response.data});
                    if(response.data.features[0].geometry.type==="MultiLineString" || response.data.features[0].geometry.type==="LineString"){
                        layerName = {
                            'id': response.data.name,
                            'type': 'line',
                            'source': response.data.name, // reference the data source
                            'layout': {},
                            'paint': {
                                'line-color': '#888',
                                'line-width': 2
                            }
                            
                        };
                    }
                    else if (response.data.features[0].geometry.type==="Point" || response.data.features[0].geometry.type==="MultiPoint"){
                        layerName = {
                            'id': response.data.name,
                            'type': 'circle',
                            'source': response.data.name, // reference the data source
                            'layout': {},
                            'paint': {
                                'circle-color': '#8931e0',
                                'circle-radius': 3,
                            }
                            
                        };
                    }
                    else {
                        layerName = {
                            'id': response.data.name,
                            'type': 'fill',
                            'source': response.data.name, // reference the data source
                            'layout': {},
                            'paint': {
                                'fill-color': '#00FF00', 
                                'fill-opacity': 1,
                                'fill-outline-color': '#000000',
                            }
                            
                        };
                    }
                    
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false
                    state.addedLayers.push(response.data)
                    rootState.map.map.fitBounds([
                        [response.data.left, response.data.bottom],
                        [response.data.right, response.data.top]
                    ],{
                        padding: 40
                    });
                    
                    state.addedTableNames.push(layerName)
                    rootState.map.map.on('click', response.data.name, (e) => {
                        const coordinates = [e.lngLat.lng, e.lngLat.lat]
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                        let popup = new maplibregl.Popup()
                        popup.setLngLat(coordinates)
                        popup.setDOMContent(createHtmlAttributes(rootState, e.lngLat.lng, e.lngLat.lat, e.features[0].properties))
                        
                        popup.addTo(rootState.map.map);
            
                    })
                    commit('handleCheckboxStatus',{tableName:response.data.name,isChecked:true})
                })
            
            }
        },
        zoomToTable({rootState, state}, payload){
            for (let i=0; i< state.addedLayers.length; i++){
                if(state.addedLayers[i].name===payload){
                    
                    rootState.map.map.fitBounds([
                        [state.addedLayers[i].left,state.addedLayers[i].bottom],
                        [state.addedLayers[i].right, state.addedLayers[i].top]
                      ],{
                        padding: 40
                    });
                }
                
            }
            
        },
        addGeoparsingLayer({state,rootState},layerName){
            const isLayerOnMap = rootState.map.map.getLayer('geocoded') == 'undefined' ? false : true
            const isLayerOnList = state.tableNames.findIndex((layer)=>{return layer.id == 'geocoded'}) < 0 ? false : true
            if(isLayerOnMap){
                if (isLayerOnList) {
                    const listedLayer = state.tableNames.find((layer)=>{return layer.id == 'geocoded'})
                    if(listedLayer.name != layerName){
                        state.tableNames[state.tableNames.findIndex((layer)=>{return layer.id == 'geocoded'})].name = layerName
                        state.tableNames[state.tableNames.findIndex((layer)=>{return layer.id == 'geocoded'})].checked = true
                    }
                } else {
                  const visibility = rootState.map.map.getLayoutProperty(
                    "geocoded",
                    "visibility"
                  );
                  let isVisible = true;
                  if (visibility == undefined || visibility == "visible") {
                    isVisible = true;
                  } else {
                    isVisible = false;
                  }
                  state.tableNames.push({
                    id: "geocoded",
                    name: layerName,
                    checked: isVisible,
                  });
                }
                
                
            }
        }

        
    },
    getters:{
        getGeocodedLayerName(state){
            return state.tableNames.filter((layer)=>{return layer.id == 'geocoded'})
        }
    }

}
export default layers