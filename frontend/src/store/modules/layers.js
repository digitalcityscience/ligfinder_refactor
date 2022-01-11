import axios from "axios"
import Vue from 'vue'
const layers = {
    namespaced: true,
    state:{
        iconColor: '#ababab',
        toggle: false,
        tableNames: [],
        addedTableNames: [],
        addedLayers: []
    },
    mutations:{
        setLayersToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        },
        setTableNames(state, payload){
            state.tableNames = payload
        },
        initLayerStyle(state, payload){
           
            let style 
            if (payload.features[0].geometry.type==="Point"){
                style= Object.assign({},{'type': 'circle', 'circle-color': '#8931e0', 'circle-opacity': 1})

            }
            else{
                style= Object.assign({},{'type': 'fill','fillColor': '#00FF00', 'fillOutlineColor': '#000000', "fillopacity": 1 })

            }
            //for(let i=0; i<payload.length; i++){
                
                Vue.set(state,payload.name+"Style", style)
            //}
            //Vue.set(state,payload+"Style", style)
            console.log(state, payload)
        },
       
    },
    actions:{
        getTableNames({commit, state}){
            if (state.toggle==true){   /* 
                                                    to avoid sending get request when closing the panel
                                                    */
                axios
                .get('http://localhost:3000/table-names')
                .then(response => {
                    commit('setTableNames', response.data)
                    
                })
            }
        },
        addTable({state,  rootState, commit}, payload){
            const clickedTableName = payload.name;
            axios
            .post('http://localhost:3000/add-table', {
                tablename : clickedTableName
            })
            .then(response => {
                //console.log(response.data.features[0].geometry.type)
                console.log(response.data)
                commit('initLayerStyle', response.data)
                let layerName = response.data.name
                rootState.map.map.addSource(response.data.name,{'type': 'geojson', 'data': response.data});
                if(response.data.features[0].geometry.type==="MultiLineString" || response.data.features[0].geometry.type==="LineString"){
                    layerName = {
                        'id': response.data.name,
                        'type': 'line',
                        'source': response.data.name, // reference the data source
                        'layout': {},
                        'paint': {
                            'line-color': '#888',
                            'line-width': 2
                        }
                        
                    };
                }
                else if (response.data.features[0].geometry.type==="Point"){
                    layerName = {
                        'id': response.data.name,
                        'type': 'circle',
                        'source': response.data.name, // reference the data source
                        'layout': {},
                        'paint': {
                            'circle-color': '#8931e0',
                            'circle-radius': 3,
                        }
                        
                    };
                }
                else {
                    layerName = {
                        'id': response.data.name,
                        'type': 'fill',
                        'source': response.data.name, // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': '#00FF00', 
                            'fill-opacity': 1,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                }
                
                rootState.map.map.addLayer(layerName)
                state.addedLayers.push(response.data)
                console.log(state.addedLayers)
                rootState.map.map.fitBounds([
                    [response.data.left, response.data.bottom],
                    [response.data.right, response.data.top]
                  ],{
                    padding: 40
                });
                
                state.addedTableNames.push(layerName)
               
            })

        },
        zoomToTable({rootState, state}, payload){
            for (let i=0; i< state.addedLayers.length; i++){
                if(state.addedLayers[i].name===payload){
                    
                    rootState.map.map.fitBounds([
                        [state.addedLayers[i].left,state.addedLayers[i].bottom],
                        [state.addedLayers[i].right, state.addedLayers[i].top]
                      ],{
                        padding: 40
                    });
                }
                
            }
            
        },

    },
    getters:{
       
    }

}
export default layers