const map=  {
    namespaced: true,
    state:{
        map:null,
        initialLongitude: 9.993275,
        initialLatitude: 53.552807,
        initialZoom:10,
        maxZoom: 19,
        minZoom: 1,
        preserveDrawingBuffer: true,
        isLoading: false,
        styles:{
            lightOSM: 'https://api.maptiler.com/maps/a2eb63ba-7d0e-4b25-9cfc-9ef74d786ec4/style.json?key=XgdreUwN4V3uEHHZHsWO',
            srandardOSM: {
                'version': 8,
                'name': 'Blank',
                'center': [0, 0],
                'zoom': 0,
                'sources': {
                'raster-tiles': {
                'type': 'raster',
                'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                'tileSize': 256,
                'minzoom': 0,
                'maxzoom': 19
                }
                },
                'layers': [
                {
                'id': 'background',
                'type': 'background',
                'paint': {
                'background-color': '#e0dfdf'
                }
                },
                {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles'
                }
                ],
                'id': 'blank'
            },
            satellieHybrid: 'https://api.maptiler.com/maps/hybrid/style.json?key=XgdreUwN4V3uEHHZHsWO',
            dark: "https://api.maptiler.com/maps/darkmatter/style.json?key=XgdreUwN4V3uEHHZHsWO"

        },
        basemapOptionsToggle: false,
        activatedStyle: "lightOSM"
    },
    mutations:{
        toggleBasemapOptionsPanel(state){
            state.basemapOptionsToggle =! state.basemapOptionsToggle
        }
    },
    actions:{
        toggleBasemap({state, rootState}){
            console.log("deployment test")       

            if (state.activatedStyle=="satellieHybrid"){
                state.map.setStyle(state.styles.satellieHybrid);
            }
            else if (state.activatedStyle=="lightOSM"){
                state.map.setStyle(state.styles.lightOSM);
            }
            else {
                state.map.setStyle(state.styles.dark);
            }
            let mapLayers = state.map.getStyle().layers
            let addedLayers = rootState.layers.addedLayers

            for (let i = 0; i<addedLayers.length; i++ ){
                        
                const foi = state.map.getLayer(addedLayers[i].name);
                if(typeof foi !== 'undefined'){
                    state.map.removeLayer(addedLayers[i].name)
                    state.map.removeSource(addedLayers[i].name)
                }
            }
            // TODO apply this on the geoparsing data
            state.map.once('idle', () => {
                console.log("ok")
                for (let i = 0; i<addedLayers.length; i++ ){
                    
                    mapLayers.forEach(layer => {
                        if(layer.id.includes(addedLayers[i].name)){
                            state.map.addSource(addedLayers[i].name,{'type': 'geojson', 'data': addedLayers[i]});
                            state.map.addLayer(layer);
                        }
                    });
                }
            })
        },
        addFOI2Map({state},sourceData){
            const mapLayer = state.map.getLayer("foi");
                if(typeof mapLayer !== 'undefined'){
                    state.map.removeLayer("foi")
                    state.map.removeSource("foi")
                }
            state.map.addSource(("foi"),{'type': 'geojson', 'data': sourceData});
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
                    
                }
            state.map.addLayer(layerName)
            state.isLoading = false
        }
    },
    getters:{
    }
}

export default map
