import { HTTP } from '../../utils/http-common';
import * as turf from 'turf'
const administrativeAOI = {
    namespaced: true,
    state: {
        toggle: false,
        isDisabled: true,
        currentAdminArea : null,
        selectedFeatures: [],
        selectedLyers: [],
        administrativeLayerName: null,
        adminStates: [],
        pickedStates:[],
        downloadedAdministrativeAreas:[],
        selectMode: null,
        items: [
            { name: 'Bezirke', value: 'bezirke' },
            { name: 'Stadtteile', value: 'stadtteile' },
            { name: 'GemarKungen', value: 'gemarkungen' },
            { name: 'Statistische Gebiete', value: 'statistischegebiete' },
            
          ],
    },
    getters:{
        getAdminAreaByID: (state) => (targetID) =>{
            return state.adminStates.find((state)=> state.id == targetID)
        }
    },
    mutations:{
        addItem2PickedStates(state,area){
            console.log('adding one item do picked states: ',area)
            let pickeds = state.pickedStates
            if(typeof pickeds.find((state)=> state.id == area.id) == 'undefined'){
                let pickedOne = [area]
                state.pickedStates = [...pickeds,...pickedOne]
            }
        },
        removeItemFromPickedStates(state,area){
            console.log('removing one item from picked states: ',area)
            let pickeds = state.pickedStates
            if(pickeds.findIndex((state)=> state.id == area.id) >= 0){
                state.pickedStates = pickeds.toSpliced(pickeds.findIndex((state)=> state.id == area.id),1)
            }
        },
        deleteSelectedFeatures(state,  rootState){
            // delete AOI if the user click on reset filter button
            console.log('deleting selected features which are: ',state)
            for(let i=0; i<state.pickedStates.length; i++){
                const mapLayer = rootState.map.map.getLayer(state.pickedStates[i].id);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.pickedStates[i].id)
                    rootState.map.map.removeSource(state.pickedStates[i].id)
                }
            }
            state.pickedStates =[]
        },
        resetSelectedLayers({rootState, commit}){
            commit('deleteSelectedFeatures',rootState)
            // delete FOI if the user click on reset filter button
            const foi = rootState.map.map.getLayer("foi");
            if(typeof foi !== 'undefined'){
                commit('ligfinder/updateFOIData',{'features':[]},{root:true})
                rootState.map.map.removeLayer("foi")
                rootState.map.map.removeSource("foi")
            }
            rootState.criteria.checkedCriteria= []
            rootState.criteria.checkedTags= []
            rootState.criteria.includeTags= []
            rootState.criteria.excludeTags= []
        },
    },
    actions:{
        getAdminArea({state,rootState,commit,dispatch}, payload){
            HTTP
            .post('add-table', {
                tablename : payload
            })
            .then(response => {
                console.log('start handling new table data with commiting delete old layers')
                commit('deleteSelectedFeatures',rootState)
                console.log('old layers removed')
                const mapLayer = rootState.map.map.getLayer(state.currentAdminArea);
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer(state.currentAdminArea)
                    rootState.map.map.removeSource(state.currentAdminArea)
                }
               
                rootState.map.map.addSource(response.data.name,{'type': 'geojson', 'data': response.data});
                rootState.map.map.addLayer({
                    'id': response.data.name,
                    'type': 'fill',
                    'source': response.data.name, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-antialias':true,
                        'fill-color': 'rgba(0, 48, 99,1)',
                        'fill-outline-color':'#6a0dad', 
                    }    
                });

                state.administrativeLayerName = response.data.name
                rootState.map.map.fitBounds([
                    [response.data.left, response.data.bottom],
                    [response.data.right, response.data.top]
                  ],{
                    padding: 40
                });
                state.adminStates = []
                state.pickedStates = []
                for (let i of response.data.features){
                    state.adminStates.push({'id': String(i.properties.gid), 'table': response.data.name, 'name':i.properties.name})
                }
                console.info('got new admin aoi list: ',state.adminStates)
                /* add click event to layer. so when user click one of the area we can get area information
                second parameter of this event is target layer. IE, when user selects bezirke areas on the left
                panel and then clicks one of these areas on the map this event fires. */
                rootState.map.map.on('click', response.data.name, function (e) {
                    dispatch('adminLayerClickHandler',e)
                });
                state.currentAdminArea = payload;
            })
            
        },
        getSelectedFeatures({state, rootState, commit,dispatch,rootGetters}){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            const selectedFeaturesMap = [...new Map(state.pickedStates.map((x) => [x["id"], x])).values()]
            rootState.map.isLoading = true
            HTTP
            .post('get-selected-features', {
                selectedFeatures : selectedFeaturesMap,
            })
            .then(response => {
                // updating the FOI (features of interest) in the ligfinder base module
                commit('layers/updateFOI',{data:response.data},{root:true})
                //update the result table
                const sourceData = rootState.ligfinder.FOI
                dispatch('map/addFOI2Map',{sourceData},{root:true}).then(()=>{
                    const isFOIonMap = rootGetters['map/isFOIonMap']
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                    commit('layers/addFOI2LayerList',null,{root:true})
                    }
                })
                
                // to remove the AOI Layer (area of interest)
                commit('deleteSelectedFeatures')
                let bounds = turf.bbox(response.data);
                rootState.map.map.fitBounds(bounds);

            })
            
        },
       
        getBuildings({rootState, rootGetters}){
            HTTP
            .post('get-buildings', {
                buildingtoggle : rootState.AOI.buildingSwitch,
                foi: rootGetters['ligfinder/getFOIGid'],
            })
        },
        resetAdminLayers({state, rootState}){
            const mapLayer = rootState.map.map.getLayer(state.administrativeLayerName);
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer(state.administrativeLayerName)
                rootState.map.map.removeSource(state.administrativeLayerName)
            }
        },
        addCheckedAdmin({rootState,commit,getters},item){
            HTTP
            .post('add-feature', {
                tablename : item.table,
                featureid: item.id
            })
            .then(response => {
                const targetArea = getters.getAdminAreaByID(response.data.features[0].properties.gid)
                console.log('getting target area: ', targetArea)
                commit('addItem2PickedStates',targetArea)

                let layerName = String(response.data.features[0].properties.gid)
                
                const mapLayer = rootState.map.map.getLayer(String(response.data.features[0].properties.gid));
                if(typeof mapLayer === 'undefined'){
                    rootState.map.map.addSource(String(response.data.features[0].properties.gid),{'type': 'geojson', 'data': response.data});
                    layerName = {
                        'id': String(response.data.features[0].properties.gid),
                        'type': 'fill',
                        'source': String(response.data.features[0].properties.gid), // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': '#6a0dad', 
                            'fill-opacity':0.7,
                        }
                        
                    };
                    rootState.map.map.addLayer(layerName)
                }
            })
        },
        deleteSelectedDispatcher({rootState,commit}){
            commit('deleteSelectedFeatures',rootState)
        },
        adminLayerClickHandler({rootState,commit,dispatch,getters},e){
            const ftr = rootState.map.map.queryRenderedFeatures(e.point)
            console.log('clicked layer is: ',ftr[0].layer.id)
            //is clickevent on administrative layer? non admin layers have integer type id
            if(isNaN(ftr[0].layer.id)){
                console.log('clicked on administrative layer')
                const tablename = e.features[0].layer.id
                const featureid = e.features[0].properties.gid
                const isDownloadedLayer = rootState.map.map.getLayer(String(e.features[0].properties.gid)) ? true : false
                /* is clicked admin area already downloaded? If so, change visibility to visible and add this area 
                to pickedstates */ 
                if(isDownloadedLayer){
                    console.log('layer is already downloaded. opening layer...')
                    rootState.map.map.setLayoutProperty(String(e.features[0].properties.gid), 'visibility', 'visible')
                    const targetArea = getters.getAdminAreaByID(e.features[0].properties.gid)
                    commit('addItem2PickedStates',targetArea)
                } else {
                //Clicked administrative area not downloaded yet. Download and add as a layer and add to pickedstates
                console.log('clicked administrative layer not downloaded. starting to download...')
                dispatch('addCheckedAdmin',{table:tablename,id:featureid})
                }
            } else{
                console.log('Clicked non-administrative layer. Change layer visibility to none. Then, remove this layer from pickedstates')
                //Clicked non-administrative layer. Change layer visibility to none. Then, remove this layer from pickedstates
                rootState.map.map.setLayoutProperty(String(e.features[0].properties.gid), 'visibility', 'none')
                const targetArea = getters.getAdminAreaByID(e.features[0].properties.gid)
                commit('removeItemFromPickedStates',targetArea)
            }
        },
        pickedStatesHandler({rootState,state,commit,dispatch},newPickedStates){
            console.log('setting array',newPickedStates)
            let oldStates = state.pickedStates
            if(oldStates.length<newPickedStates.length){
                //get last element of payload then add as a layer
                const state2add = newPickedStates.filter((s1)=>!oldStates.some((s2)=>s2.id==s1.id))[0]
                console.log('get last element of payload then add as a layer',state2add)
                const isDownloadedLayer = rootState.map.map.getLayer(String(state2add.id)) ? true : false
                if(isDownloadedLayer){
                    rootState.map.map.setLayoutProperty(String(state2add.id), 'visibility', 'visible')
                    commit('addItem2PickedStates',state2add)
                } else{
                    dispatch('addCheckedAdmin',state2add)
                }
                
            } else {
                //get last element of oldstate then close that layer
                const state2remove = oldStates.filter((s1)=>!newPickedStates.some((s2)=>s2.id==s1.id))[0]
                console.log('get last element of oldstate then close that layer',state2remove)
                commit('removeItemFromPickedStates',state2remove)
                rootState.map.map.setLayoutProperty(String(state2remove.id), 'visibility', 'none')
            }
            
        }
        
    }

}
export default administrativeAOI