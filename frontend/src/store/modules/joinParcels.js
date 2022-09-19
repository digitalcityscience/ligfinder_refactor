import { HTTP } from '../../utils/http-common';

const joinParcels = {
    namespaced: true,
    state:{
        min: 0,
        max: 100000,
        slider: 1000,
        layerVisibility: true,
        touchingParcels: null
    },
    mutations:{
       
        
    },
    actions:{
        getTouchedParcels({state, rootState, rootGetters}){
            rootState.map.isLoading = true
            let gids = rootGetters['ligfinder/getFOIGid']
            HTTP.post('get-touching-parcels', {
                gids: gids,
                area: state.slider
            })
            .then((response)=>{
                state.touchingParcels=null
                response.data.features.sort(function(a, b) {
                    return b.properties.area - a.properties.area;
                });
                console.log(response.data)
                state.touchingParcels=response.data
                
                const mapLayer = rootState.map.map.getLayer('touching_parcels')
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer('touching_parcels')
                    rootState.map.map.removeSource('touching_parcels')
                }
                let layerName 
                rootState.map.map.addSource('touching_parcels',{'type': 'geojson', 'data': response.data});
                
                
                layerName = {
                    'id': 'touching_parcels',
                    'type': 'line',
                    'source': 'touching_parcels', // reference the data source
                    'layout': {},
                    'paint': {
                        'line-color': 'rgba(250, 0, 0, 1)',
                        'line-width': 2
                    }
                    
                };
            
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
            })
        },
        removeTouchingParcelLayer({rootState}){
            const mapLayer = rootState.map.map.getLayer('touching_parcels')
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer('touching_parcels')
                rootState.map.map.removeSource('touching_parcels')
            }
        },
        toggleJoinParcelVisibility({state, rootState}){
            const joinParcelLayer = rootState.map.map.getLayer("touching_parcels")
            if(typeof joinParcelLayer !== 'undefined'){
                
                if (state.layerVisibility==false){
                    rootState.map.map.setLayoutProperty("touching_parcels", 'visibility', 'none')
                }
                else{
                    rootState.map.map.setLayoutProperty("touching_parcels", 'visibility', 'visible')
                }
            }
           
        }
    },
    getters:{
       
    }

}
export default joinParcels