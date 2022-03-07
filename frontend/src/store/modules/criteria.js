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
        selectedOperator: 'AND'
    },
    mutations:{
        
    },
    actions:{
        applyCriteria({rootState, state, dispatch}){
            console.log(rootState.ligfinder.FOIGid, this.excludeTags)
            rootState.map.isLoading = true
            HTTP
            .post('set-criteria-filter', {
                featureIds : rootState.ligfinder.FOIGid,
                excludeTags: state.excludeTags,
                includeTags: state.includeTags,
                operator: state.selectedOperator
            })
            .then(response => {
                console.log(response.data)
                if (response.data.features!=null){
                    rootState.ligfinder.FOI = response.data

                    response.data.name = "foi"
                    for (let i=0; i<rootState.layers.addedLayers.length; i++){
                        if(rootState.layers.addedLayers[i].name === "foi"){
                            rootState.layers.addedLayers.splice(i, 1);
                        }
                    }
                    rootState.layers.addedLayers.push(response.data)
                
                    const mapLayer = rootState.map.map.getLayer("foi");
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer("foi")
                        rootState.map.map.removeSource("foi")
                    }
                    rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': rootState.ligfinder.FOI});
                    let layerName = {
                        'id': "foi",
                        'type': 'fill',
                        'source': "foi", // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': '#00FF00', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false

                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "No feature found for the selected criteria. Please restart your search", background: "#FFD700"}, { root:true })
                    const mapLayer = rootState.map.map.getLayer("foi");
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer("foi")
                        rootState.map.map.removeSource("foi")
                    }
                    rootState.map.isLoading = false

                    rootState.ligfinder.FOI = {'features':[]}
                    console.log("no feature found")
                }
            
            })
            .finally(() => {
                rootState.ligfinder.FOIGid = []
                for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                    rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
                  }
                console.log(rootState.ligfinder.FOIGid)
            })
        }
    },
    getters:{

    }

}
export default criteria
