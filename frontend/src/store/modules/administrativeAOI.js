import axios from "axios"
//import maplibregl from 'maplibre-gl'
const administrativeAOI = {
    namespaced: true,
    state: {
        toggle: false,
        currentAdminArea : null,
        selectedFeatures: [],
        selectedLyers: [],
        administrativeLayerName: null
    },
    mutations:{

    },
    actions:{
        getAdminArea({state,  rootState}, payload){
            axios
            .post('http://localhost:3000/add-table', {
                tablename : payload
            })
            .then(response => {
                const mapLayer = rootState.map.map.getLayer(state.currentAdminArea);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.currentAdminArea)
                    rootState.map.map.removeLayer(state.currentAdminArea+"line")
                    rootState.map.map.removeSource(state.currentAdminArea)
                    rootState.map.map.removeSource(state.currentAdminArea+"line")
                }
                // in order to just have one administrative layer in the map
                /*if (state.currentAdminArea){
                    rootState.map.map.removeLayer(state.currentAdminArea)
                    rootState.map.map.removeLayer(state.currentAdminArea+"line")
                    rootState.map.map.removeSource(state.currentAdminArea)
                    rootState.map.map.removeSource(state.currentAdminArea+"line")
                }*/
               
                rootState.map.map.addSource(response.data.name,{'type': 'geojson', 'data': response.data});
                rootState.map.map.addSource(response.data.name+"line",{'type': 'geojson', 'data': response.data});
                
                rootState.map.map.addLayer({
                    'id': response.data.name,
                    'type': 'fill',
                    'source': response.data.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#6a0dad', 
                        'fill-opacity':0,
                    }
                    
                });

                state.administrativeLayerName = response.data.name

                rootState.map.map.addLayer({
                    'id': response.data.name+"line",
                    'type': 'line',
                    'source': response.data.name+"line",
                    'paint': {
                      'line-color': '#6a0dad',
                      'line-width': 1
                    }
                });  
                rootState.map.map.fitBounds([
                    [response.data.left, response.data.bottom],
                    [response.data.right, response.data.top]
                  ],{
                    padding: 40
                });
                let featureid = null
                rootState.map.map.on('click', response.data.name, function (e) {
                    
                    const tablename = e.features[0].layer.id
                    featureid = e.features[0].properties.gid
                    axios
                    .post('http://localhost:3000/add-feature', {
                        tablename : tablename,
                        featureid: featureid
                    })
                    .then(response => {
                       
                        state.selectedFeatures.push({'id': String(response.data.features[0].properties.gid), 'table': response.data.tablename})
                   
                        
                        let layerName = String(response.data.features[0].properties.gid)
                        
                        //if(countInArray(state.selectedFeatures,String(response.data.features[0].properties.gid))===1){
                        const mapLayer = rootState.map.map.getLayer(String(response.data.features[0].properties.gid));
                        if(typeof mapLayer === 'undefined'){
                            rootState.map.map.addSource(String(response.data.features[0].properties.gid),{'type': 'geojson', 'data': response.data});
                            layerName = {
                                'id': String(response.data.features[0].properties.gid),
                                'type': 'fill',
                                'source': String(response.data.features[0].properties.gid), // reference the data source
                                'layout': {},
                                'paint': {
                                    'fill-color': '#6a0dad', 
                                    'fill-opacity':0.5,
                                }
                                
                            };
                            
                            rootState.map.map.addLayer(layerName)
                        }
                        
                            
                    })
                    .finally(() => {
                       
                    })
                   
                });
                
                
                
                state.currentAdminArea = payload;
            })
            
        },
        
        resetSelectedLayers({state,  rootState}){
            // delete AOI if the user click on reset filter button
            for(let i=0; i<state.selectedFeatures.length; i++){
                const mapLayer = rootState.map.map.getLayer(state.selectedFeatures[i].id);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.selectedFeatures[i].id)
                    rootState.map.map.removeSource(state.selectedFeatures[i].id)
                }
            }
            state.selectedFeatures =[]

            // delete FOI if the user click on reset filter button
            const foi = rootState.map.map.getLayer("foi");
                if(typeof foi !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
        },
        
        getSelectedFeatures({state, rootState}){
            state.selectedFeatures = [...new Map(state.selectedFeatures.map((x) => [x["id"], x])).values()]
            axios
            .post('http://localhost:3000/get-selected-features', {
                selectedFeatures : state.selectedFeatures,
            })
            .then(response => {
                // updating the FOI (features of interest) in the ligfinder base module
                rootState.ligfinder.FOI = response.data
                response.data.name = "foi"
                for (let i=0; i<rootState.layers.addedLayers.length; i++){
                    if(rootState.layers.addedLayers[i].name === "foi"){
                        rootState.layers.addedLayers.splice(i, 1);
                    }
                }
                rootState.layers.addedLayers.push(response.data)
                //update the result table
                
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
                        'fill-color': '#FC44D7', 
                        'fill-opacity':0.5,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                // to remove the AOI Layer (area of interest)
                rootState.map.map.addLayer(layerName)
                for(let i=0; i<state.selectedFeatures.length; i++){
                    const mapLayer = rootState.map.map.getLayer(state.selectedFeatures[i].id);
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer(state.selectedFeatures[i].id)
                        rootState.map.map.removeSource(state.selectedFeatures[i].id)
                    }
                }

            })
            .finally(() => {
                rootState.ligfinder.FOIGid = []
                for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                    rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
                  }
                  console.log(rootState.ligfinder.FOIGid)
            })
            
        },
       
        getBuildings({rootState}){
            axios
            .post('http://localhost:3000/get-buildings', {
                buildingtoggle : rootState.AOI.buildingSwitch,
                foi: rootState.ligfinder.FOIGid
            })
        },
        resetAdminLayers({state, rootState}){
                const mapLayer = rootState.map.map.getLayer(state.administrativeLayerName);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.administrativeLayerName)
                    rootState.map.map.removeSource(state.administrativeLayerName)
                    rootState.map.map.removeLayer(state.administrativeLayerName+"line")
                    rootState.map.map.removeSource(state.administrativeLayerName+"line")

                }
        },
    },
    getters:{

    }

}
export default administrativeAOI