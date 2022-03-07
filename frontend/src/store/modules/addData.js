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
        dropAreaToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
            
        }
    },
    actions:{
        addDroppedData({rootState, state}, payload){
            console.log(state, payload)
            
            const mapLayer = rootState.map.map.getLayer(payload.data.name)
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer(payload.data.name)
                rootState.map.map.removeSource(payload.data.name)
            }
            let layerName 
            rootState.map.map.addSource(payload.data.name,{'type': 'geojson', 'data': payload.data});
            if(payload.data.features[0].geometry.type==="MultiLineString" || payload.data.features[0].geometry.type==="LineString"){
                layerName = {
                    'id': payload.data.name,
                    'type': 'line',
                    'source': payload.data.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'line-color': '#888',
                        'line-width': 2
                    }
                    
                };
            }
            else if (payload.data.features[0].geometry.type==="Point"){
                layerName = {
                    'id': payload.data.name,
                    'type': 'circle',
                    'source': payload.data.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'circle-color': '#8931e0',
                        'circle-radius': 3,
                    }
                    
                };
            }
            else {
                layerName = {
                    'id': payload.data.name,
                    'type': 'fill',
                    'source': payload.data.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#00FF00', 
                        'fill-opacity': 1,
                        'fill-outline-color': '#000000',
                    }
                    
                };
            }
            
            rootState.map.map.addLayer(layerName)
            //payload.data.name = filenName
            //rootState.layers.addedLayers.push(payload.data)
            rootState.ligfinder.FOI = payload.data
            rootState.layers.addedLayers.push(payload.data)
            rootState.map.isLoading = false
            
            let bounds = turf.bbox(payload.data);
            rootState.map.map.fitBounds(bounds);
            
            rootState.ligfinder.FOIGid = []
            for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
            }
            
        }
    },
    getters:{

    }

}
export default addData