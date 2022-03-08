import { HTTP } from '../../utils/http-common';
import shpwrite from "shp-write"

const results = {
    namespaced: true,
    state:{
        toggle: false,
        exportMode: null,
        exportItems: [
            { name: 'Shapefile', value: 'shapefile' },
            { name: 'Json', value: 'json' },
            
        ],
        
    },
    mutations:{
       
    },
    actions:{
        zoomToSelectedFeature({rootState, state}, payload){
            console.log(state, payload)
            HTTP
            .post('get-selected-feature-bound', {
                featureGid : payload
            })
            .then(response => {
                console.log(response.data)
                rootState.map.map.fitBounds([
                    [response.data.left, response.data.bottom],
                    [response.data.right, response.data.top]
                  ],{
                    padding: 100
                });
                rootState.map.map.setPaintProperty(
                    'foi', 
                    'fill-outline-color', 
                    ['match', ['get', 'gid'], payload, '#FFFF00' , '#000000']
                );
            })
        },
        exporResultsJson({rootState}){
            let foi = null
            for(let i=0; i<rootState.layers.addedLayers.length; i++){
                if (rootState.layers.addedLayers[i].name === "foi"){
                    foi = rootState.layers.addedLayers[i]
                }
            }
            const blob = new Blob([JSON.stringify(foi)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const filename = "results.json"
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'download';
            a.click();
            a.remove();
        },
        exporResultsSHP({rootState}){
      

            let foi = null
            for(let i=0; i<rootState.layers.addedLayers.length; i++){
                if (rootState.layers.addedLayers[i].name === "foi"){
                    foi = rootState.layers.addedLayers[i]
                }
            }
            /*
            convrting geom type from MultiPolygon to polygon.
            Because the "shp-write" library does not support MultiPolygon
            */
            for (let i=0; i< foi["features"].length; i++){
                foi["features"][i]["geometry"]["type"] = "Polygon"
            }
            
            var options = {
                folder: 'results',
                types: {
                    point: 'results',
                    polygon: 'results',
                    line: 'results'
                }
            }
            shpwrite.download(foi, options);
            
        }
    },
    getters:{

    }

}
export default results