import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'

const savedResultsTable = {
    namespaced: true,
    state:{
        
    },
    mutations:{
       
    },
    actions:{
        getSavedParcelInstances({state, rootState,commit}, payload){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            console.log(state)
            HTTP
            .post('get-saved-parcels', {
                gids: payload
            })
            .then(response => {
                console.log(response.data)
                rootState.map.isLoading = true
                const mapLayer = rootState.map.map.getLayer('foi')
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer('foi')
                    rootState.map.map.removeSource('foi')
                }
                let layerName 
                rootState.map.map.addSource('foi',{'type': 'geojson', 'data': response.data});
                
                
                layerName = {
                    'id': 'foi',
                    'type': 'fill',
                    'source': 'foi', // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#f21b7f', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
            
                rootState.map.map.addLayer(layerName)
                commit('ligfinder/updateFOIData',response.data,{root:true})
                commit('ligfinder/createResultTable',null,{root:true})
                rootState.map.isLoading = false
                
                let bounds = turf.bbox(response.data);
                rootState.map.map.fitBounds(bounds);
                
                response.data.name = "foi"
                commit('layers/updateFOI',{data:response.data},{root:true})

            })
            
        },
        deleteItemConfirm({state, rootState, dispatch}, payload){
            console.log(state)
            HTTP
            .post('delete-item-user-history', {
                deleteItemName: payload,
                id: rootState.user.id
            })
            .finally(() => {
                dispatch('user/loadSavedResults', null, { root:true })
            })
        },
        editItemConfirm({state, dispatch}, payload){
            console.log(state, payload)
            HTTP
            .post('edit-item-user-history', {
               payload
            })
            .finally(() => {
                dispatch('user/loadSavedResults', null, { root:true })
            })
        }
    },
    getters:{

    }

}
export default savedResultsTable