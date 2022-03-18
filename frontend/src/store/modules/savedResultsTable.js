import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'

const savedResultsTable = {
    namespaced: true,
    state:{
        
    },
    mutations:{
       
    },
    actions:{
        getSavedParcelInstances({state, rootState}, payload){
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
                        'fill-color': '#00FF00', 
                        'fill-opacity': 1,
                        'fill-outline-color': '#000000',
                    }
                    
                };
            
                rootState.map.map.addLayer(layerName)
                rootState.ligfinder.FOI = response.data
                rootState.map.isLoading = false
            
                let bounds = turf.bbox(response.data);
                rootState.map.map.fitBounds(bounds);
                
                rootState.criteria.checkedCriteria= []
                rootState.criteria.checkedTags= []
                rootState.criteria.includeTags= []
                rootState.criteria.excludeTags= []

            })
            .finally(() => {
                rootState.ligfinder.FOIGid = []
                for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                    rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
                  }
                  console.log(rootState.ligfinder.FOIGid)
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