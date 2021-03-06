import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'

const AOI = {
    namespaced: true,
    state:{
        selectMode: null,
        buildingSwitch: false,
        items: [
            { name: 'Verwaltungsgebiet', value: 'administrative' },
            { name: 'Geometrie', value: 'geometry' },
            { name: 'Umkreis/Isochrone', value: 'isochrone' },
            
        ],
        AOIs: [
            { name: 'Verwaltungsgebiet', value: 'administrative', area: null, data: null },
            { name: 'Geometrie', value: 'geometry', area: null,  data: null },
            { name: 'Umkreis/Isochrone', value: 'isochrone', area: null, data: null },
        ],
        operators: ['Union', 'Intersection'],
        selectedOperator: 'Union',
        
    },
    mutations:{
        
    },
    actions:{
        addAdminAreaToAOIList({state, rootState}){
            state.AOIs[0].data= rootState.administrativeAOI.selectedFeatures
        },
        addGeomDrawAreaToAOIList({state, rootState}){
            state.AOIs[1].data=rootState.geometryAOI.AOI
            state.AOIs[1].area= (turf.area(rootState.geometryAOI.AOI)).toFixed(2)
        },
        addIsochroneAreaToAOIList({state, rootState}){
            state.AOIs[2].data=rootState.isochroneAOI.AOI
            state.AOIs[2].area= (turf.area(rootState.isochroneAOI.AOI)).toFixed(2)
        },
        removeGeomDrawAreaFromAOIList({state}){
            state.AOIs[1].data=null
        },
        deleteDrawnGeom({state, rootState}){
            state.AOIs[1].data=null
            rootState.geometryAOI.draw.deleteAll() 
        },
        getUnionParcels({state, rootState, dispatch}){
            rootState.map.isLoading = true
            HTTP
            .post('get-aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                console.log(response.data)
                rootState.ligfinder.FOI=response.data
                const mapLayer = rootState.map.map.getLayer("foi");
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
                rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': response.data});
                let layerName = {
                    'id': "foi",
                    'type': 'fill',
                    'source': "foi",
                    'paint': {
                        'fill-color': '#d99ec4', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
                // remove Geometry AOI
                dispatch("geometryAOI/removeDrawControl",null , { root:true })

                // remove isochrone AOI

                const isochroneLayer = rootState.map.map.getLayer("isochrone");
                if(typeof isochroneLayer !== 'undefined'){
                    rootState.map.map.removeLayer("isochrone")
                    rootState.map.map.removeSource("isochrone")
                }

                // remove adminastrative layer

                const adminastrativeLayer = rootState.map.map.getLayer(rootState.administrativeAOI.currentAdminArea);
                if(typeof adminastrativeLayer !== 'undefined'){
                    rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea)
                    rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea+"line")
                    rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea)
                    rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea+"line")
                }

                // remove selectedfeatures layer
                for(let i=0; i<rootState.administrativeAOI.selectedFeatures.length; i++){
                    const selectedfeaturesLayer = rootState.map.map.getLayer(rootState.administrativeAOI.selectedFeatures[i].id);
                    if(typeof selectedfeaturesLayer !== 'undefined'){
                        rootState.map.map.removeLayer(rootState.administrativeAOI.selectedFeatures[i].id)
                        rootState.map.map.removeSource(rootState.administrativeAOI.selectedFeatures[i].id)
                    }
                }
                
            })            
            
        },
        getIntersectParcels({state, rootState, dispatch}){
            rootState.map.isLoading = true
            HTTP
            .post('get-intersect_aois', {
                AOIs : state.AOIs
            })
            .then((response)=>{
                if (response.data.features!=null){
                    rootState.ligfinder.FOI=response.data
                    const mapLayer = rootState.map.map.getLayer("foi");
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer("foi")
                        rootState.map.map.removeSource("foi")
                    }
                    rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': response.data});
                    let layerName = {
                        'id': "foi",
                        'type': 'fill',
                        'source': "foi",
                        'paint': {
                            'fill-color': '#d99ec4', 
                            'fill-opacity':0.7,
                            'fill-outline-color': '#000000',
                        }
                        
                    };
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false
                    // remove Geometry AOI
                    dispatch("geometryAOI/removeDrawControl",null , { root:true })

                    // remove isochrone AOI

                    const isochroneLayer = rootState.map.map.getLayer("isochrone");
                    if(typeof isochroneLayer !== 'undefined'){
                        rootState.map.map.removeLayer("isochrone")
                        rootState.map.map.removeSource("isochrone")
                    }

                    // remove adminastrative layer

                    const adminastrativeLayer = rootState.map.map.getLayer(rootState.administrativeAOI.currentAdminArea);
                    if(typeof adminastrativeLayer !== 'undefined'){
                        rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea)
                        rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea+"line")
                        rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea)
                        rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea+"line")
                    }

                    // remove selectedfeatures layer
                    for(let i=0; i<rootState.administrativeAOI.selectedFeatures.length; i++){
                        const selectedfeaturesLayer = rootState.map.map.getLayer(rootState.administrativeAOI.selectedFeatures[i].id);
                        if(typeof selectedfeaturesLayer !== 'undefined'){
                            rootState.map.map.removeLayer(rootState.administrativeAOI.selectedFeatures[i].id)
                            rootState.map.map.removeSource(rootState.administrativeAOI.selectedFeatures[i].id)
                        }
                    }
                }
                else{
                    dispatch('alert/openCloseAlarm', {text: "The selected geometries are not intersected!", background: "#FFD700"}, { root:true })
                    rootState.map.isLoading = false
                    // remove Geometry AOI
                    dispatch("geometryAOI/removeDrawControl",null , { root:true })

                    // remove isochrone AOI

                    const isochroneLayer = rootState.map.map.getLayer("isochrone");
                    if(typeof isochroneLayer !== 'undefined'){
                        rootState.map.map.removeLayer("isochrone")
                        rootState.map.map.removeSource("isochrone")
                    }

                    // remove adminastrative layer

                    const adminastrativeLayer = rootState.map.map.getLayer(rootState.administrativeAOI.currentAdminArea);
                    if(typeof adminastrativeLayer !== 'undefined'){
                        rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea)
                        rootState.map.map.removeLayer(rootState.administrativeAOI.currentAdminArea+"line")
                        rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea)
                        rootState.map.map.removeSource(rootState.administrativeAOI.currentAdminArea+"line")
                    }

                    // remove selectedfeatures layer
                    for(let i=0; i<rootState.administrativeAOI.selectedFeatures.length; i++){
                        const selectedfeaturesLayer = rootState.map.map.getLayer(rootState.administrativeAOI.selectedFeatures[i].id);
                        if(typeof selectedfeaturesLayer !== 'undefined'){
                            rootState.map.map.removeLayer(rootState.administrativeAOI.selectedFeatures[i].id)
                            rootState.map.map.removeSource(rootState.administrativeAOI.selectedFeatures[i].id)
                        }
                    }               
                }
            })
        },
        deleteItemConfirm({state, rootState, dispatch}, payload){
            let index = state.AOIs.findIndex(obj => obj.value==payload);
            state.AOIs[index].data=null
            if (payload=="geometry"){
                rootState.geometryAOI.AOI=null
                dispatch('geometryAOI/removeDrawControl', null, { root:true })
            }
            else if (payload=="isochrone") {
                rootState.isochroneAOI.AOI=null
                const isochroneLayer = rootState.map.map.getLayer("isochrone");
                if(typeof isochroneLayer !== 'undefined'){
                    rootState.map.map.removeLayer("isochrone")
                    rootState.map.map.removeSource("isochrone")
                }
            }
        }
    },
    getters:{

    }

}
export default AOI