import config from "../../../config.json"
import { HTTP } from '../../utils/http-common';
const criteria = {
    namespaced: true,
    state:{
        criteria: config,
        active: false,
        includeTags:[],
        excludeTags:[],
        operators: ['AND', 'OR'],
        selectedOperator: 'AND',
        criteriaFilterData: null
    },
    mutations:{
        add2IncludeTags(state,item){
            state.includeTags.push(item)
            console.log('add2incl',item)
        },
        add2ExcludeTags(state,item){
            state.excludeTags.push(item)
            console.log('add2excl',item)
        },
        removeFromIncludeTags(state,item){
            state.includeTags.splice(state.includeTags.findIndex((el)=>{return el.name == item.name}),1)
            console.log('rmf incl',item)
        },
        removeFromExcludeTags(state,item){
            state.excludeTags.splice(state.excludeTags.findIndex((el)=>{return el.name == item.name}),1)
            console.log('rmf excl',item)}
    },
    actions:{
        add2IncludeTags({state,commit},item){
            console.log('add2incldispatcher',item)
            let isAlreadyIncluded = state.includeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            let isAlreadyExcluded = state.excludeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            if(!isAlreadyIncluded){
                if(!isAlreadyExcluded){
                    commit('add2IncludeTags',item)
                } else {
                    commit('removeFromExcludeTags',item)
                    commit('add2IncludeTags',item)
                }
            }
        },
        add2ExcludeTags({state,commit},item){
            console.log('add2excldispatcher',item)
            let isAlreadyIncluded = state.includeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            let isAlreadyExcluded = state.excludeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            if(!isAlreadyExcluded){
                if(!isAlreadyIncluded){
                    commit('add2ExcludeTags',item)
                } else {
                    commit('removeFromIncludeTags',item)
                    commit('add2ExcludeTags',item)
                }
            }
        },
        removeFromIncludeTags({state,commit},item){
            console.log('rmf incl dispatcher',item)
            let isAlreadyIncluded = state.includeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            if(isAlreadyIncluded){
                commit('removeFromIncludeTags',item)
            }
        },
        removeFromExcludeTags({state,commit},item){
            console.log('rmf excl dispatcher',item)
            let isAlreadyExcluded = state.excludeTags.findIndex((el)=>{return el.name == item.name}) >= 0 ? true : false
            if (isAlreadyExcluded) {
                commit('removeFromExcludeTags',item)
            }
        },
        async criteriaFilter({rootState, rootGetters, state, dispatch}){
            console.log('getting criteria filter')
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            rootState.map.isLoading = true
            await HTTP
            .post('set-criteria-filter', {
                featureIds : rootGetters['ligfinder/getFOIGid'],
                excludeTags: state.excludeTags,
                includeTags: state.includeTags,
                operator: state.selectedOperator
            })
            .then(response => {
                if (response.data.features!=null){

                    state.criteriaFilterData=response.data
                   
                    const foiLayer = rootState.map.map.getLayer("foi");
                    if(typeof foiLayer !== 'undefined'){
                        rootState.map.map.removeLayer("foi")
                        rootState.map.map.removeSource("foi")
                    }
                    const mapLayer = rootState.map.map.getLayer("criteriafilter");
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer("criteriafilter")
                        rootState.map.map.removeSource("criteriafilter")
                    }
                    rootState.map.map.addSource(("criteriafilter"),{'type': 'geojson', 'data': response.data});
                    let layerName = {
                        'id': "criteriafilter",
                        'type': 'fill',
                        'source': "criteriafilter",
                        'layout': {},
                        'paint': {
                            'fill-color': '#f21b7f', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                    
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false
                    console.log('got criteria filter results')

                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "No feature found for the selected criteria. Please restart your search", background: "#FFD700"}, { root:true })
                    rootState.map.isLoading = false
                    console.log('no criteria filter result')
                }
            
            })
            
        },
        async applyCriteriaFilter({state, rootState, dispatch, commit,rootGetters}){
            console.log('applying criteria filter')
            if (state.criteriaFilterData){
                commit('ligfinder/updateFOIData',state.criteriaFilterData,{root:true})
                commit('ligfinder/createResultTable',null,{root:true})
                state.criteriaFilterData.name = "foi"
                commit('layers/updateFOI',{data:state.criteriaFilterData},{root:true})
                

                const sourceData = rootState.ligfinder.FOI
                await dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                    const isFOIonMap = typeof rootState.map.map.getLayer("foi") != 'undefined' ? true : false
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                        commit('layers/addFOI2LayerList',null,{root:true})
                    }
                }).then(()=>{
                    dispatch('alert/openCloseAlarm', {text: "The Criteria Filter Was Successfully Applied", background: "#00FF00"}, { root:true })
                    commit('filtering/saveLastCriteriaFilter',
                            JSON.stringify({includeTags:state.includeTags,
                                excludeTags:state.excludeTags,
                                operator:state.selectedOperator}),
                            {root:true})
            console.log('criteria filter applied')
                })
            }
            return Promise.resolve()
        },
        removeCriteriaFilterLayer({rootState}){
            const mapLayer = rootState.map.map.getLayer("criteriafilter");
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("criteriafilter")
                rootState.map.map.removeSource("criteriafilter")
            }
        },
        async filterByCriteria(){}
    },
    getters:{
        getFilterData(state){
            return {
                includeTags : state.includeTags,
                excludeTags : state.excludeTags,
                selectedOperator : state.selectedOperator
            }
        }
    }

}
export default criteria
