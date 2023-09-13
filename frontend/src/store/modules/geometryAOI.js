//import maplibregl from 'maplibre-gl'
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { HTTP } from '../../utils/http-common';
const geometryAOI = {
    namespaced: true,
    state: {
        AOI: null,
        draw: null,
        selectMode: null,
        items: [
            { name: 'Polygon', value: 'polygon' },
          ],
    },
    mutations:{

    },
    actions:{
        getGeomArea({state, rootState}, payload){
            if(payload==="polygon"){
                state.draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        polygon: true,
                        trash: true
                    },
                    defaultMode: 'draw_polygon'
                });
                rootState.map.map.addControl(state.draw);
                console.log(state.draw)
               
                    rootState.map.map.on('draw.create', function() {
                        if(state.draw!==null){
                            state.AOI= state.draw.getAll()
                            
                        }
                        
                    })
                    
            }
        },
        getSelectedFeatures({state, rootState,commit,dispatch,rootGetters}){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            state.selectMode=null
            rootState.map.map.removeControl(state.draw);
            state.draw= null
            //console.log(state.draw, "ff" )
            rootState.map.isLoading = true
            HTTP
            .post('get-geometry-aoi', {
                data : state.AOI
            })
            .then(response => {
                console.log(response)
                rootState.ligfinder.FOI= response.data
                commit('ligfinder/createResultTable',null,{root:true})
                response.data.name = "foi"
                commit('layers/updateFOI',{data:response.data},{root:true})
                const sourceData = rootState.ligfinder.FOI
                dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                    const isFOIonMap = typeof rootState.map.map.getLayer("foi") != 'undefined' ? true : false
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                        commit('layers/addFOI2LayerList',null,{root:true})
                    }
                })
            })
            
        },
        resetSelectedLayers({state, rootState,commit}){
            state.selectMode=null
            // delete FOI if the user click on reset filter button
            const foi = rootState.map.map.getLayer("foi");
            if(typeof foi !== 'undefined'){
                commit('ligfinder/updateFOIData',{'features':[]},{root:true})
                commit('ligfinder/createResultTable',null,{root:true})
                commit('layers/removeFOIfromLayerList',null,{root:true})
                rootState.map.map.removeLayer("foi")
                rootState.map.map.removeSource("foi")
            }
            rootState.criteria.checkedCriteria= []
            rootState.criteria.checkedTags= []
            rootState.criteria.includeTags= []
            rootState.criteria.excludeTags= []
        },
        removeDrawControl({state, rootState}){
            if (state.draw!==null){
                state.selectMode=null
                rootState.map.map.removeControl(state.draw);
                state.draw= null

            }
        },
        
    },
    getters:{

    }

}
export default geometryAOI