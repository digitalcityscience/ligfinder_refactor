import config from "../../../config.json"
import { HTTP } from '../../utils/http-common';
const criteria = {
    namespaced: true,
    state:{
        criteria: config,
        active: false,
        checkedCriteria: [],
        checkedTags: [],
        includeTags:[],
        excludeTags:[],
        operators: ['AND', 'OR'],
        selectedOperator: 'AND',
        criteriaFilterData: null
    },
    mutations:{
        
    },
    actions:{
        criteriaFilter({rootState, rootGetters, state, dispatch}){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            rootState.map.isLoading = true
            HTTP
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
                            'fill-color': '#d99ec4', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                    
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false

                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "No feature found for the selected criteria. Please restart your search", background: "#FFD700"}, { root:true })
                    rootState.map.isLoading = false
                }
            
            })
            
        },
        applyCriteriaFilter({state, rootState, dispatch, commit}){
            if (state.criteriaFilterData){
                commit('ligfinder/updateFOIData',state.criteriaFilterData,{root:true})
                state.criteriaFilterData.name = "foi"
                commit('layers/updateFOI',{data:state.criteriaFilterData},{root:true})
                
                const foiLayer = rootState.map.map.getLayer("foi");
                if(typeof foiLayer !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
                rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': rootState.ligfinder.FOI});
                let layerName = {
                    'id': "foi",
                    'type': 'fill',
                    'source': "foi",
                    'layout': {},
                    'paint': {
                        'fill-color': '#d99ec4', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                };
                
                rootState.map.map.addLayer(layerName)
                
                dispatch('alert/openCloseAlarm', {text: "The Criteria Filter Was Successfully Applied", background: "#00FF00"}, { root:true })

            }
        },
        removeCriteriaFilterLayer({rootState}){
            const mapLayer = rootState.map.map.getLayer("criteriafilter");
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("criteriafilter")
                rootState.map.map.removeSource("criteriafilter")
            }
        }
    },
    getters:{

    }

}
export default criteria
