import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'
//import maplibregl from 'maplibre-gl'
const administrativeAOI = {
    namespaced: true,
    state: {
        toggle: false,
        isDisabled: true,
        currentAdminArea : null,
        selectedFeatures: [],
        selectedLyers: [],
        administrativeLayerName: null,
        adminStates: [],
        selectedAdminStates: [],
        selectMode: null,
        items: [
            { name: 'Bezirke', value: 'bezirke' },
            { name: 'Stadtteile', value: 'stadtteile' },
            { name: 'GemarKungen', value: 'gemarkungen' },
            { name: 'Statistische Gebiete', value: 'statistischegebiete' },
            
          ],
    },
    mutations:{

    },
    actions:{
        getAdminArea({state,  rootState}, payload){
            HTTP
            .post('add-table', {
                tablename : payload
            })
            .then(response => {
                console.log(response.data)
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
                /*const foi = rootState.map.map.getLayer("foi");
                if(typeof foi !== 'undefined'){
                    rootState.ligfinder.FOI = {'features':[]}
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }*/
                const mapLayer = rootState.map.map.getLayer(state.currentAdminArea);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.currentAdminArea)
                    rootState.map.map.removeLayer(state.currentAdminArea+"line")
                    rootState.map.map.removeSource(state.currentAdminArea)
                    rootState.map.map.removeSource(state.currentAdminArea+"line")
                }
               
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

                state.adminStates = []
                state.selectedAdminStates= []
                for (let i of response.data.features){
                    state.adminStates.push({'id': String(i.properties.gid), 'table': response.data.name, 'name':i.properties.name})
                }
                console.log(state.adminStates)
                let featureid = null
                rootState.map.map.on('click', response.data.name, function (e) {
                    
                    const tablename = e.features[0].layer.id
                    featureid = e.features[0].properties.gid
                    HTTP
                    .post('add-feature', {
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
                rootState.ligfinder.FOI = {'features':[]}
                rootState.map.map.removeLayer("foi")
                rootState.map.map.removeSource("foi")
            }
            rootState.criteria.checkedCriteria= []
            rootState.criteria.checkedTags= []
            rootState.criteria.includeTags= []
            rootState.criteria.excludeTags= []
        },
        deleteSelectedFeatures({state,  rootState}){
            // delete AOI if the user click on reset filter button
            for(let i=0; i<state.selectedFeatures.length; i++){
                const mapLayer = rootState.map.map.getLayer(state.selectedFeatures[i].id);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.selectedFeatures[i].id)
                    rootState.map.map.removeSource(state.selectedFeatures[i].id)
                }
            }
            state.selectedFeatures =[]
        },
        
        getSelectedFeatures({state, rootState}){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            state.selectedFeatures = [...new Map(state.selectedFeatures.map((x) => [x["id"], x])).values()]
            rootState.map.isLoading = true
            HTTP
            .post('get-selected-features', {
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
                        'fill-color': '#d99ec4', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                // to remove the AOI Layer (area of interest)
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
                for(let i=0; i<state.selectedFeatures.length; i++){
                    const mapLayer = rootState.map.map.getLayer(state.selectedFeatures[i].id);
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer(state.selectedFeatures[i].id)
                        rootState.map.map.removeSource(state.selectedFeatures[i].id)
                    }
                }
                let bounds = turf.bbox(response.data);
                rootState.map.map.fitBounds(bounds);

            })
            
        },
       
        getBuildings({rootState, rootGetters}){
            HTTP
            .post('get-buildings', {
                buildingtoggle : rootState.AOI.buildingSwitch,
                foi: rootGetters['ligfinder/getFOIGid'],
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
        addCheckedAdmin({state, rootState},item){
            //console.log(document.getElementById(item.name).checked)
            //let checkval = document.getElementById(item.name).checked
            //document.getElementById(item.name).checked =! checkval
            
            HTTP
            .post('add-feature', {
                tablename : item.table,
                featureid: item.id
            })
            .then(response => {
                console.log(response.data)
                state.selectedFeatures.push({'id': String(response.data.features[0].properties.gid), 'table': response.data.tablename, 'name': response.data.features[0].properties.name})
                   
                        
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
        },
        removeCheckedAdmin({state, rootState}, item){
            
            const mapLayer = rootState.map.map.getLayer(item.id);
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer(item.id)
                rootState.map.map.removeSource(item.id)
            }
            for (let i=0; i<state.selectedFeatures.length; i++){
                if(state.selectedFeatures[i].name ===item.name){
                    state.selectedFeatures.splice(i, 1);
                }
            }
            console.log(state.selectedFeatures)
        }
    },
    getters:{

    }

}
export default administrativeAOI