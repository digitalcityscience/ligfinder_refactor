import { HTTP } from '../../utils/http-common';
import Vue from 'vue'
const database = {
    namespaced: true,
    state:{
        iconColor: '#ababab',
        toggle: false,
        tableNames: [],
        addedTables: [],
        addedLayers: [],
        addedTableNames: [],
    },
    mutations:{
        setDatabaseToggle(state){
            state.toggle =! state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        },
        setTableNames(state, payload){
            state.tableNames = payload
        },
        setTableData(state, payload){
            state.addedTables.push(payload);
            
        },
        initLayerStyle(state, payload){
           
            let style 
            style= Object.assign({},{'fillColor': '#00FF00', 'fillOutlineColor': '#000000', "fillopacity": 1 })
            Vue.set(state,payload+"Style", style)
            console.log(state[payload+"Style"])
        },
        setAddedTableName(state, payload){
            state.addedTableNames.push(payload);
        },
    },
    actions:{
        getTableNames({commit, state}){
            if (state.toggle==true){   /* 
                                                    to avoid sending get request when closing the panel
                                                    */
                HTTP
                .get('table-names')
                .then(response => {
                    commit('setTableNames', response.data)
                })
            }
        },
        addTable({commit,state, rootState}, payload){
            const clickedTableName = payload.name;
            
            HTTP
            .post('add-table', {
                tablename : clickedTableName
            })
            
            .then(response => {
                commit('setTableData', response.data)
                rootState.map.map.addSource(response.data.name,{'type': 'geojson', 'data': response.data});
                let layerName = response.data.name
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
                rootState.map.map.addLayer(layerName)
                //console.log(layerName)
                state.addedLayers.push(layerName)
                console.log(state.addedLayers)
                rootState.map.map.fitBounds([
                    [response.data.left, response.data.bottom],
                    [response.data.right, response.data.top]
                  ],{
                    padding: 40
                });
                
                commit('initLayerStyle', response.data.name)
                commit('setAddedTableName', response.data.name)
            })
           
        }
    },
    getters:{

    }
}

export default database