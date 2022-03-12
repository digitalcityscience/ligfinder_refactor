import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { HTTP } from '../../utils/http-common';

const isochroneAOI = {
    namespaced: true,
    state:{
        center: {"coordinates": ""},
        draw: null,
        mode: null,
        items: [
            { name: 'Gehen', value: 'walk_network' },
            { name: 'Radfahren', value: 'bike_network' },
            { name: 'Fahren', value: 'drive_network' },
            
        ],
    },
    mutations:{
      
    },
    actions:{
        showPointDraw({state, rootState}){
           
            state.draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    point: true,
                    trash: true
                },
                defaultMode: 'draw_point'
            });

            rootState.map.map.addControl(state.draw);
            console.log(state.draw)
            rootState.map.map.on('draw.create', function() {
                if(state.draw!==null){
                    const marker = state.draw.getAll()
                    console.log(marker.features[(marker.features).length-1])
                
                    state.center = marker.features[(marker.features).length-1].geometry
                }
                
            })
        },
        getIsochrone({rootState}, payload){
            rootState.map.isLoading = true
            HTTP
            .post('get-isochrone-aoi', {
                payload
            })
            .then(response => {
                console.log(response.data)
                const mapLayer = rootState.map.map.getLayer("isochrone");
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer("isochrone")
                    rootState.map.map.removeSource("isochrone")
                }
                rootState.map.map.addSource("isochrone",{'type': 'geojson', 'data': response.data});
                let layerName = {
                    'id': "isochrone",
                    'type': 'fill',
                    'source': 'isochrone', // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#3b3b3b', 
                        'fill-opacity': 0.8,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
            })
        },
        getParcels({state, rootState}, payload){
            rootState.map.map.removeControl(state.draw);
            state.draw= null
            const mapLayer = rootState.map.map.getLayer("isochrone");
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("isochrone")
                rootState.map.map.removeSource("isochrone")
            }
            rootState.map.isLoading = true
            HTTP
            .post('get-isochrone-parcel', {
                payload
            })
            .then(response => {
                rootState.ligfinder.FOI= response.data
                response.data.name = "foi"
                for (let i=0; i<rootState.layers.addedLayers.length; i++){
                    if(rootState.layers.addedLayers[i].name === "foi"){
                        rootState.layers.addedLayers.splice(i, 1);
                    }
                }
                rootState.layers.addedLayers.push(response.data)
                /*
                const mapLayer = rootState.map.map.getLayer("isochrone-parcel");
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer("isochrone-parcel")
                    rootState.map.map.removeSource("isochrone-parcel")
                }
                rootState.map.map.addSource("isochrone-parcel",{'type': 'geojson', 'data': response.data});
                let layerName = {
                    'id': "isochrone-parcel",
                    'type': 'fill',
                    'source': 'isochrone-parcel', // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#00FF00', 
                        'fill-opacity': 0.8,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                rootState.map.map.addLayer(layerName)*/
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
                rootState.map.isLoading = false
            })
            .finally(() => {
                rootState.ligfinder.FOIGid = []
                for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                    rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
                  }
                  console.log(rootState.ligfinder.FOIGid)
            })
        },
        reset({rootState}){
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
        }
    },
    getters:{

    }

}
export default isochroneAOI