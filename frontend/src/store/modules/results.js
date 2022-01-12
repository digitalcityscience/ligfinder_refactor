import axios from "axios"

const results = {
    namespaced: true,
    state:{
        toggle: false,
        
    },
    mutations:{
       
    },
    actions:{
        zoomToSelectedFeature({rootState, state}, payload){
            console.log(state, payload)
            axios
            .post('http://localhost:3000/get-selected-feature-bound', {
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
                    'fill-color', 
                    ['match', ['get', 'gid'], payload, '#FFFF00' , '#00FF00']
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
        exporResultsCSV(){
            console.log("export")
        }
    },
    getters:{

    }

}
export default results