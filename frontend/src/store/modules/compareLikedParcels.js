import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'

const compareLikedParcels = {
    namespaced: true,
    state:{
        toggle: false,
        likedParcels: [],
        likedParcelsJsonResponse: null

    },
    mutations:{
        closeCompareTable(state){
            state.toggle= false
        }
    },
    actions:{
        compare({state}){
            
            HTTP
            .post('get-liked-parcels', {
                gids : state.likedParcels
            })
            .then(response => {
                state.likedParcelsJsonResponse = response.data
                console.log(state.likedParcelsJsonResponse)
                state.toggle=true;
            })
        },
        addLikedParcel({state, rootState}, payload){
            
            if(state.likedParcels.indexOf(payload) == -1){
                state.likedParcels.push(payload)
            }
            else{
                let parcelIndex = state.likedParcels.indexOf(payload)
                state.likedParcels.splice(parcelIndex, 1);
            }
            if (state.likedParcels.length==0){
                rootState.map.map.setPaintProperty(
                    'foi', 
                    'fill-color', '#d99ec4'
                )
            }
            else{
                rootState.map.map.setPaintProperty(
                    'foi', 
                    'fill-color', 
                    ['match', ['get', 'gid'], state.likedParcels, '#FFD700' , '#d99ec4']
                )
            }
            
            console.log(state.likedParcels)
        },
        zoomToLikedParcel({rootState, state}, payload){
            for (let i = 0; i < state.likedParcelsJsonResponse.features.length; i++){
                if (state.likedParcelsJsonResponse.features[i].properties.gid == payload){
                    let bounds = turf.bbox(state.likedParcelsJsonResponse.features[i]);
                    rootState.map.map.fitBounds(bounds);
                    
                }
            }
        }
       
    },
    getters:{

    }

}
export default compareLikedParcels