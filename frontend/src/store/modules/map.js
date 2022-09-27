const map=  {
    namespaced: true,
    state:{
        map:null,
        initialLongitude: 9.99,
        initialLatitude: 53.55,
        initialZoom:9,
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
        toglleBasemapOptionsPanel(state){
            state.basemapOptionsToggle =! state.basemapOptionsToggle
        }
    },
    actions:{
        toglleBasemap({state, rootState}){
            
            if (state.activatedStyle=="satellieHybrid"){
                state.map.setStyle(state.styles.satellieHybrid);
            }
            else if (state.activatedStyle=="lightOSM"){
                state.map.setStyle(state.styles.lightOSM);
            }
            else {
                state.map.setStyle(state.styles.dark);
            }
            console.log(state.map.getStyle().layers)
            const foi = state.map.getLayer("foi");
            if(typeof foi !== 'undefined'){
                state.map.removeLayer("foi")
                state.map.removeSource("foi")
            }
            if (rootState.ligfinder.FOI.features.length>0){
                state.map.once('idle', () => {
                    console.log("weee")
                    state.map.addSource('foi',{'type': 'geojson', 'data': rootState.ligfinder.FOI});
                    state.map.addLayer({
                        'id': "foi",
                        'type': 'fill',
                        'source': "foi", 
                        'paint': {
                            'fill-color': '#d99ec4', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                    });
                })
            }  
        }
    },
    getters:{

    }
}

export default map