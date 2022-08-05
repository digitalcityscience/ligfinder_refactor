import { HTTP } from '../../utils/http-common';
import shpwrite from "shp-write"
import jsonexport from 'jsonexport/dist';

const results = {
    namespaced: true,
    state:{
        toggle: false,
        exportMode: null,
        exportItems: [
            { name: 'Shapefile', value: 'shapefile' },
            { name: 'Json', value: 'json' },
            { name: 'CSV', value: 'csv' }
            
        ],
        saveReultsItems: [
            { name: 'Export Locally', value: 'export' },
            { name: 'Save in the Profile', value: 'save' },
            
        ],
        saveReultsMode: null,
        description: null,
        
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
            
        },
        exporResultsCSV({rootState}){
            
            let csvarray = rootState.ligfinder.FOI.features.map(e=>Object.assign({},e))
            csvarray.forEach(elm=>delete elm.geometry)
            jsonexport(csvarray, function(err, csv){
                if (err) return console.error(err)
                
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const filename = "results.csv"
                const a = document.createElement('a')
                a.href = url
                a.download = filename || 'download'
                a.click()
                a.remove()
            })

        },
        saveData({state, rootState, dispatch}){
            let gids = []
            for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                gids.push(rootState.ligfinder.FOI.features[i].properties.gid)
            }
            let userId = rootState.user.id
            let description = state.description
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+ '-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let name = 'result'+'_'+date
            HTTP
            .post('save-results', {
                gids : gids,
                userId: userId,
                description: description,
                name: name,
                includeTags: rootState.criteria.includeTags,
                excludeTags: rootState.criteria.excludeTags
            })
            .then(response => {
                dispatch('alert/openCloseAlarm', {text: response.data.text, background: "#00FF00"}, { root:true })
            })
            .finally(() => {
                dispatch('user/loadSavedResults', null, { root:true })
            })
        }
    },
    getters:{

    }

}
export default results