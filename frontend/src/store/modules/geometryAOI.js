//import maplibregl from 'maplibre-gl'
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import axios from "axios"
const geometryAOI = {
    namespaced: true,
    state: {
        AOI: null,
        draw: null
    },
    mutations:{

    },
    actions:{
        getGeomArea({state, rootState}, payload){
            if(payload==="polygon"){
                state.draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        polygon: true,
                        trash: true
                    },
                    defaultMode: 'draw_polygon'
                });
                rootState.map.map.addControl(state.draw);
                console.log(state.draw)
               
                    rootState.map.map.on('draw.create', function() {
                        if(state.draw!==null){
                            state.AOI= state.draw.getAll()
                        }
                        
                    })
                    
            }
        },
        getSelectedFeatures({state, rootState}){
            rootState.map.map.removeControl(state.draw);
            state.draw= null
            //console.log(state.draw, "ff" )
            axios
            .post('http://localhost:3000/get-geometry-aoi', {
                data : state.AOI
            })
            .then(response => {
                console.log(response)
                rootState.ligfinder.FOI= response.data
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
                        'fill-color': '#FC44D7', 
                        'fill-opacity':0.5,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                // to remove the AOI Layer (area of interest)
                rootState.map.map.addLayer(layerName)
            })
            .finally(() => {
                rootState.ligfinder.FOIGid = []
              for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                rootState.ligfinder.FOIGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
                }
                console.log(rootState.ligfinder.FOIGid)
            })
        },
        removeDrawControl({state, rootState}){
            if (state.draw!==null){
                rootState.map.map.removeControl(state.draw);
                state.draw= null

            }
            
        }
    },
    getters:{

    }

}
export default geometryAOI