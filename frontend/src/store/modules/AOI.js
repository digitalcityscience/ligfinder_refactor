import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'

const AOI = {
    namespaced: true,
    state:{
        selectMode: null,
        buildingSwitch: false,
        items: [
            { name: 'Verwaltungsgebiet', value: 'administrative' },
            { name: 'Geometrie', value: 'geometry' },
            { name: 'Umkreis/Isochrone', value: 'isochrone' },
            
        ],
        AOIs: [
            { name: 'Verwaltungsgebiet', value: 'administrative', area: null, data: null },
            { name: 'Geometrie', value: 'geometry', area: null,  data: null },
            { name: 'Umkreis/Isochrone', value: 'isochrone', area: null, data: null },
        ],
        operators: ['Union', 'Intersection'],
        selectedOperator: 'Union',
        
    },
    mutations:{
        
    },
    actions:{
        addAdminAreaToAOIList({state, rootState}){
            state.AOIs[0].data= rootState.administrativeAOI.pickedStates
        },
        addGeomDrawAreaToAOIList({state, rootState}){
            state.AOIs[1].data=rootState.geometryAOI.AOI
            state.AOIs[1].area= (turf.area(rootState.geometryAOI.AOI)).toFixed(2)
        },
        addIsochroneAreaToAOIList({state, rootState}){
            state.AOIs[2].data=rootState.isochroneAOI.AOI
            state.AOIs[2].area= (turf.area(rootState.isochroneAOI.AOI)).toFixed(2)
        },
        removeGeomDrawAreaFromAOIList({state}){
            state.AOIs[1].data=null
        },
        deleteDrawnGeom({state, rootState}){
            state.AOIs[1].data=null
            rootState.geometryAOI.draw.deleteAll() 
        },
        getUnionParcels({state, rootState,dispatch,commit,rootGetters}){
            rootState.map.isLoading = true
            HTTP
            .post('get-aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                rootState.ligfinder.FOI=response.data
                const sourceData = response.data
                dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                    const isFOIonMap = rootGetters['map/isFOIonMap']
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                        commit('layers/addFOI2LayerList',null,{root:true})
                    }
                })

                response.data.name = "foi"
                commit('layers/updateFOI',{data:response.data},{root:true})
                dispatch('removeSearchHelpers')
                
            })            
            
        },
        getIntersectParcels({state, rootState, dispatch,rootGetters,commit}){
            rootState.map.isLoading = true
            HTTP
            .post('get-intersect_aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                if (response.data.features!=null){
                    rootState.ligfinder.FOI=response.data
                    const sourceData = response.data
                    dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                        const isFOIonMap = rootGetters['map/isFOIonMap']
                        const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                        if (isFOIonMap && !isFOIonLayerList){
                            commit('layers/addFOI2LayerList',null,{root:true})
                        }
                    })
                    
                    dispatch('removeSearchHelpers')
                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "The selected geometries are not intersected!", background: "#FFD700"}, { root:true })
                    rootState.map.isLoading = false
                    dispatch('removeSearchHelpers')         
                }
            })
        },
        deleteItemConfirm({state, rootState, dispatch}, payload){
            let index = state.AOIs.findIndex(obj => obj.value==payload);
            state.AOIs[index].data=null
            if (payload=="geometry"){
                rootState.geometryAOI.AOI=null
                dispatch('geometryAOI/removeDrawControl', null, { root:true })
            }
            else if (payload=="isochrone") {
                rootState.isochroneAOI.AOI=null
                const isochroneLayer = rootState.map.map.getLayer("isochrone");
                if(typeof isochroneLayer !== 'undefined'){
                    rootState.map.map.removeLayer("isochrone")
                    rootState.map.map.removeSource("isochrone")
                }
            }
        },
        removeSearchHelpers({rootState,dispatch}){
            // remove Geometry AOI
            dispatch("geometryAOI/removeDrawControl",null , { root:true })

            // remove isochrone AOI

            const isochroneLayer = rootState.map.map.getLayer("isochrone");
            if(typeof isochroneLayer !== 'undefined'){
                rootState.map.map.removeLayer("isochrone")
                rootState.map.map.removeSource("isochrone")
            }

            // remove adminastrative layer

            const adminastrativeLayer = rootState.map.map.getLayer(rootState.administrativeAOI.currentAdminArea);
            if(typeof adminastrativeLayer !== 'undefined'){
                rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea)
                rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea)
            }

            // remove selectedfeatures layer
            for(let i=0; i<rootState.administrativeAOI.selectedFeatures.length; i++){
                const selectedfeaturesLayer = rootState.map.map.getLayer(rootState.administrativeAOI.selectedFeatures[i].id);
                if(typeof selectedfeaturesLayer !== 'undefined'){
                    rootState.map.map.removeLayer(rootState.administrativeAOI.selectedFeatures[i].id)
                    rootState.map.map.removeSource(rootState.administrativeAOI.selectedFeatures[i].id)
                }
            } 
        }
    },
    getters:{

    }

}
export default AOI