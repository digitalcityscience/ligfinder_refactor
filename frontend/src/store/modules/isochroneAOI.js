//import MapboxDraw from "@mapbox/mapbox-gl-draw";
//import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { HTTP } from '../../utils/http-common';

const isochroneAOI = {
    namespaced: true,
    state:{
        center: null,
        draw: null,
        mode: null,
        activatePoint: false,
        items: [
            { name: 'Gehen', value: 'walk_network' },
            { name: 'Radfahren', value: 'bike_network' },
            { name: 'Fahren', value: 'drive_network' },
            
        ],
        AOI: null
    },
    mutations:{
      
    },
    actions:{
        showPointDraw({state, rootState}){
            
            //console.log(state.center)
            rootState.map.map.getCanvas().style.cursor = "pointer";
            
            state.activatePoint=true
            
            rootState.map.map.on('click', function(e) {
                if (state.activatePoint==true){
                    state.center= e.lngLat
                    console.log(e)
                    //console.log(state.center, 'center')
                    
                    const mapLayer = rootState.map.map.getLayer('travel-center');
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer('travel-center')
                        rootState.map.map.removeSource('travel-center')
                    }
                    rootState.map.map.addSource('travel-center', {
                        'type': 'geojson',
                        'data': {
                        'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [e.lngLat['lng'], e.lngLat['lat']]
                                    }
                                },
                            ]
                        }
                    });
                    rootState.map.map.addLayer({
                        'id': 'travel-center',
                        'type': 'circle',
                        'source': 'travel-center',
                        'paint': {
                        'circle-radius': 6,
                        'circle-color': '#B42222'
                        },
                    });
                    state.activatePoint=false
                    rootState.map.map.getCanvas().style.cursor = '';

                }
                
                
            })
               
        },
        getIsochrone({state, rootState}, payload){
            const mapLayer = rootState.map.map.getLayer('travel-center');
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer('travel-center')
                rootState.map.map.removeSource('travel-center')
            }
            rootState.map.isLoading = true
            HTTP
            .post('get-isochrone-aoi', {
                payload
            })
            .then(response => {
                console.log(response.data)
                state.AOI= response.data
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
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
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
                        'fill-color': '#d99ec4', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                // to remove the AOI Layer (area of interest)
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
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
        },
        deleteIsochroneAOI({state, rootState}){
            state.AOI = null
            const mapLayer = rootState.map.map.getLayer("isochrone");
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("isochrone")
                rootState.map.map.removeSource("isochrone")
            }

        }
    },
    getters:{

    }

}
export default isochroneAOI