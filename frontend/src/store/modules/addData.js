//import maplibregl from 'maplibre-gl'
import * as turf from 'turf'
const addData = {
    namespaced: true,
    state:{
        toggle: false,
        iconColor: '#ababab',
        droppedLayers : {'name': null, 'features':[]},
    },
    mutations:{
        closeDropArea(state){
            state.toggle = false
            state.iconColor = '#ababab';
        },
        addDataToggle(state){
            state.toggle=!state.toggle;
        },
        dropAreaToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
            
        }
    },
    actions:{
        addDroppedData({rootState, state,commit}, payload){
            console.log(state, payload)
            rootState.map.isLoading = true
            console.log('added file:',payload)
            const mapLayer = rootState.map.map.getLayer(payload.name)
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer(payload.name)
                rootState.map.map.removeSource(payload.name)
            }
            let layerName 
            rootState.map.map.addSource(payload.name,{'type': 'geojson', 'data': payload.data});
            if(payload.data.features[0].geometry.type==="MultiLineString" || payload.data.features[0].geometry.type==="LineString"){
                layerName = {
                    'id': payload.name,
                    'type': 'line',
                    'source': payload.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'line-color': '#888',
                        'line-width': 2
                    }
                    
                };
            }
            else if (payload.data.features[0].geometry.type==="Point"){
                layerName = {
                    'id': payload.name,
                    'type': 'circle',
                    'source': payload.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'circle-color': '#8931e0',
                        'circle-radius': 3,
                    }
                    
                };
            }
            else {
                layerName = {
                    'id': payload.name,
                    'type': 'fill',
                    'source': payload.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#f21b7f', 
                        'fill-opacity': 0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
            }
            
           
            rootState.map.map.addLayer(layerName)
            commit('ligfinder/updateFOIData',payload.data,{root:true})
            commit('ligfinder/createResultTable',null,{root:true})
            rootState.layers.addedLayers.push(payload.data)
            rootState.map.isLoading = false
            
            let bounds = turf.bbox(payload.data);
            rootState.map.map.fitBounds(bounds);

            rootState.criteria.includeTags= []
            rootState.criteria.excludeTags= []

            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            
        }
    },
    getters:{

    }

}
export default addData