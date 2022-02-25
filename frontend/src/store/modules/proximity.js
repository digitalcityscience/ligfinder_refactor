import { HTTP } from '../../utils/http-common';
import colorbrewer from "colorbrewer"
import { createHtmlAttributes } from '../../utils/createHtmlAttributes';
import maplibregl from 'maplibre-gl'
const proximity = {
    namespaced: true,
    state: {
        supermarketMin: 0,
        supermarketMax: 1,
        supermarketWeight: 0.5,

        metroMin: 0,
        metroMax: 1,
        metroWeight: 0.5,
    },
    mutations:{

    },
    actions:{
        proximityAnalysis({rootState, state}){
            console.log(state)
            let parcelGid = []
            for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                parcelGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
            }
            rootState.map.isLoading = true
            HTTP
            .post('get-proximity-scoring-result', {
                foi: parcelGid
            })
            .then(response => {
                console.log(colorbrewer.Greens[5][0])

                /* for the classification purpose: to update addedLayers
                 array every time to analysis is updated
                */
                response.data.data.name = "foi"
                for (let i=0; i<rootState.layers.addedLayers.length; i++){
                    if(rootState.layers.addedLayers[i].name === "foi"){
                        rootState.layers.addedLayers.splice(i, 1);
                    }
                }
                rootState.layers.addedLayers.push(response.data.data)
                console.log(rootState.layers.addedLayers)

                const lowerbound = response.data.lowerbound
                const breaks = response.data.breaks
                rootState.ligfinder.FOI = response.data.data
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
                        'fill-opacity':1,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                rootState.map.map.addLayer(layerName)
                rootState.map.map.setPaintProperty('foi','fill-color', {
                    property: 'total_score',
                    type: 'interval',
                    stops: [
                        [lowerbound, colorbrewer.Greens[5][0]],
                        [breaks[0], colorbrewer.Greens[5][1]],
                        [breaks[1], colorbrewer.Greens[5][2]],
                        [breaks[2], colorbrewer.Greens[5][3]],
                        [breaks[3], colorbrewer.Greens[5][4]]
                    ]

                })

                rootState.map.isLoading = false
                rootState.map.map.on('click', 'foi', (e) => {
                    const coordinates = [e.lngLat.lng, e.lngLat.lat]
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    let popup = new maplibregl.Popup()
                    popup.setLngLat(coordinates)
                    //popup.setHTML(createHtmlAttributes(e.features[0].properties))
                    popup.setDOMContent(createHtmlAttributes(rootState, e.lngLat.lng, e.lngLat.lat, e.features[0].properties))
                    
                    popup.addTo(rootState.map.map);
                    
        
                })
            })
        }
    },
    getters:{

    }
}
export default proximity
