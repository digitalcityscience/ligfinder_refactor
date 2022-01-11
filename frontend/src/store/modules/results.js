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
        }
    },
    getters:{

    }

}
export default results