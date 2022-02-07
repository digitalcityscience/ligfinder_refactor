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
        excludeTags:[]
    },
    mutations:{
        
    },
    actions:{
        applyCriteria({rootState, state}){
            console.log(rootState.ligfinder.FOIGid, this.excludeTags)
            HTTP
            .post('set-criteria-filter', {
                featureIds : rootState.ligfinder.FOIGid,
                excludeTags: state.excludeTags,
                includeTags: state.includeTags
            })
            .then(response => {
                console.log(response.data)
                
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
            
            })
        }
    },
    getters:{

    }

}
export default criteria