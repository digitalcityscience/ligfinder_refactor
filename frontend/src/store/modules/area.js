import { HTTP } from '../../utils/http-common';
const area = {
    namespaced: true,
    state:{
        landAreaMin:0,
        landAreaMax:100,
        areaRange: [0,4073828],
        grossFloorAreaRange: [0,4073828]
    },
    mutations:{
        
    },
    actions:{
        
        areaFilter({state, rootState, dispatch}){
            console.log(rootState.ligfinder.FOIGid)
            HTTP
            .post('get-area-filter', {
                featureIds : rootState.ligfinder.FOIGid,
                areaRange: state.areaRange,
                grossFloorAreaRange: state.grossFloorAreaRange,
            })
            .then(response => {
                if (response.data.features!=null){
                    rootState.ligfinder.FOI = response.data

                    console.log(rootState.ligfinder.FOI.features)
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
                            'fill-color': '#d99ec4', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                    
                    rootState.map.map.addLayer(layerName)
                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "No feature found for the selected area. Please restart your search", background: "#FFD700"}, { root:true })
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
        getParams (state, getters, rootState) {
            console.log(rootState.ligfinder.FOI.features)
            const area_fme = []
            for (let i of rootState.ligfinder.FOI.features){
                area_fme.push(i.properties.area_fme)
            }
            const bgf_sum = []
            for (let i of rootState.ligfinder.FOI.features){
                bgf_sum.push(i.properties.bgf_sum)
            }
            const minAreaFme = Math.min(...area_fme)
            const maxAreaFme = Math.max(...area_fme)
            const minBgfSum = Math.min(...bgf_sum)
            const maxBgfSum = Math.max(...bgf_sum)
            const areaRange = [minAreaFme, maxAreaFme, minBgfSum, maxBgfSum]
            return areaRange
        }
    }
}

export default area
