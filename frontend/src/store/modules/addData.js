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
            let filenName = payload.fileName
          
            let layerName = filenName
            rootState.map.map.addSource(payload.fileName,{'type': 'geojson', 'data': payload.data});
            if(payload.data.features[0].geometry.type==="MultiLineString" || payload.data.features[0].geometry.type==="LineString"){
                layerName = {
                    'id': payload.fileName,
                    'type': 'line',
                    'source': payload.fileName, // reference the data source
                    'layout': {},
                    'paint': {
                        'line-color': '#888',
                        'line-width': 2
                    }
                    
                };
            }
            else if (payload.data.features[0].geometry.type==="Point"){
                layerName = {
                    'id': payload.fileName,
                    'type': 'circle',
                    'source': payload.fileName, // reference the data source
                    'layout': {},
                    'paint': {
                        'circle-color': '#8931e0',
                        'circle-radius': 3,
                    }
                    
                };
            }
            else {
                layerName = {
                    'id': payload.fileName,
                    'type': 'fill',
                    'source': payload.fileName, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#00FF00', 
                        'fill-opacity': 1,
                        'fill-outline-color': '#000000',
                    }
                    
                };
            }
            
            rootState.map.map.addLayer(layerName)
            payload.data.name = filenName
            rootState.layers.addedLayers.push(payload.data)
            rootState.map.isLoading = false
            
            let bounds = turf.bbox(payload.data);
            rootState.map.map.fitBounds(bounds);
        }
    },
    getters:{

    }

}
export default addData