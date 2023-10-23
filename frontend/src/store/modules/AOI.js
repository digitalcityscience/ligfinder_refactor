import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'
import VueI18n from '@/plugins/i18n/i18n';

const AOI = {
    namespaced: true,
    state:{
        selectMode: null,
        buildingSwitch: false,
        items: [
            { name: VueI18n.t('ligfinder.aoi.list.administrative'), value: 'administrative' },
            { name: VueI18n.t('ligfinder.aoi.list.geometry'), value: 'geometry' },
            { name: VueI18n.t('ligfinder.aoi.list.isochrone'), value: 'isochrone' },
            
        ],
        AOIs: [
            { name: VueI18n.t('ligfinder.aoi.list.administrative'), value: 'administrative', area: null, data: null },
            { name: VueI18n.t('ligfinder.aoi.list.geometry'), value: 'geometry', area: null,  data: null },
            { name: VueI18n.t('ligfinder.aoi.list.isochrone'), value: 'isochrone', area: null, data: null },
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
        async getUnionParcels({state, rootState,dispatch,commit,rootGetters}){
            rootState.map.isLoading = true
            console.log('getting union parsels')
            await HTTP
            .post('get-aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                rootState.ligfinder.FOI=response.data
                commit('ligfinder/createResultTable',null,{root:true})
                const sourceData = response.data
                dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                    const isFOIonMap = typeof rootState.map.map.getLayer("foi") != 'undefined' ? true : false
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                        commit('layers/addFOI2LayerList',null,{root:true})
                    }
                })

                response.data.name = "foi"
                commit('layers/updateFOI',{data:response.data},{root:true})
                dispatch('removeSearchHelpers')
                console.log('got union parsels')
                commit('filtering/saveLastAOIFilter',state.AOIs,{root:true})
                
            })            
            
        },
        getIntersectParcels({state, rootState, dispatch,rootGetters,commit}){
            rootState.map.isLoading = true
            console.log('getting intersecting parsels')
            HTTP
            .post('get-intersect_aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                if (response.data.features!=null){
                    rootState.ligfinder.FOI=response.data
                    commit('ligfinder/createResultTable',null,{root:true})
                    const sourceData = response.data
                    dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                        const isFOIonMap = typeof rootState.map.map.getLayer("foi") != 'undefined' ? true : false
                        const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                        if (isFOIonMap && !isFOIonLayerList){
                            commit('layers/addFOI2LayerList',null,{root:true})
                        }
                    })
                    
                    dispatch('removeSearchHelpers')
                    console.log('got intersecting parsels')
                    commit('filtering/saveLastAOIFilter',state.AOIs,{root:true})
                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "The selected geometries are not intersected!", background: "#FFD700"}, { root:true })
                    rootState.map.isLoading = false
                    dispatch('removeSearchHelpers')     
                    console.log('got intersecting parsels')    
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

            // reset adminastrative layer
            dispatch("administrativeAOI/resetAdminLayers",null,{root:true})
        }
    },
    getters:{

    }

}
export default AOI