const layer = {
    namespaced:true,
    state:{
        iconColor: '#ababab',
        toggle: false,
        LayerPanelToggle: true,
        BasemapsPanelToggle: false,
        BaseMapData: {
            "name": "basic",
            "url": "https://api.maptiler.com/maps/a2eb63ba-7d0e-4b25-9cfc-9ef74d786ec4/style.json?key=XgdreUwN4V3uEHHZHsWO",
        },
        basemaps:{
            "basic": {
                "name": "basic",
                "url": "https://api.maptiler.com/maps/a2eb63ba-7d0e-4b25-9cfc-9ef74d786ec4/style.json?key=XgdreUwN4V3uEHHZHsWO",
              },/*
              "hybrid": {
                "name": "hybrid",
                "url": "https://api.maptiler.com/maps/hybrid/style.json?key=XgdreUwN4V3uEHHZHsWO",
              },
              
              "toner": {
                "name": "toner",
                "url": "https://api.maptiler.com/maps/toner/style.json?key=XgdreUwN4V3uEHHZHsWO",
              },
              "topo": {
                "name": "topo",
                "url": "https://api.maptiler.com/maps/topo/style.json?key=XgdreUwN4V3uEHHZHsWO",
              },
              "dark": {
                "name": "dark",
                "url": "https://api.maptiler.com/maps/darkmatter/style.json?key=XgdreUwN4V3uEHHZHsWO",
              },*/
             
        }
    },
    mutations:{
        setLayerToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        },
        setLayerPanelToggle(state){
            state.LayerPanelToggle = true;
            state.BasemapsPanelToggle = false;
        },
        setBasemapPanelToggle(state){
            state.LayerPanelToggle = false;
            state.BasemapsPanelToggle = true;
        },
        setBasemapName(state, payload){
            state.BaseMapData= payload
            console.log(payload)
        }
    },
    actions:{
        zoomToTable({rootState}, payload){
            for (let i=0; i< rootState.database.addedTables.length; i++){
                if(rootState.database.addedTables[i].name===payload){
                    
                    rootState.map.map.fitBounds([
                        [rootState.database.addedTables[i].left,rootState.database.addedTables[i].bottom],
                        [rootState.database.addedTables[i].right, rootState.database.addedTables[i].top]
                      ],{
                        padding: 40
                    });
                }
                
            }
            
        },
        setBasemap({commit, rootState}, payload){
            commit('setBasemapName', payload)
            rootState.map.map.setStyle(payload.url)
        }
    },
    getters:{

    },
}
export default layer