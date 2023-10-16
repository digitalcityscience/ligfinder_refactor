const area = {
    namespaced: true,
    state:{
        landAreaMin:0,
        landAreaMax:100,
        arMin:0,
        arMax:4073828,
        areaRange: [0,4073828],
        grossFloorMin:0,
        grossFloorMax:4073828,
        grossFloorAreaRange: [0,4073828],
        unbuiltAreaMin:0,
        unbuiltAreaMax:4073828,
        unbuiltAreaRange: [0,4073828],
        areaFilterData: null
    },
    mutations:{
        
    },
    actions:{
        
        async areaFilter({state, rootState, dispatch}){
            console.log('applying area filter')
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            rootState.map.isLoading = true
            let jsonAreaFilter = rootState.ligfinder.FOI.features.filter( d=> 
                d.properties.area_fme>=state.arMin && d.properties.area_fme<=(state.arMax+1) && 
                d.properties.bgf_sum>=state.grossFloorMin && d.properties.bgf_sum<=(state.grossFloorMax+1) && 
                d.properties.fl_unbeb_a>=state.unbuiltAreaMin && d.properties.fl_unbeb_a<=(state.unbuiltAreaMax+1)
            )

            jsonAreaFilter = {
                features: jsonAreaFilter,
                type: 'FeatureCollection'
            }
            if (jsonAreaFilter.features?.length>0){
                state.areaFilterData=jsonAreaFilter
                
                const foiLayer = rootState.map.map.getLayer("foi");
                if(typeof foiLayer !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
                const mapLayer = rootState.map.map.getLayer("areafilter");
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer("areafilter")
                    rootState.map.map.removeSource("areafilter")
                }
                rootState.map.map.addSource(("areafilter"),{'type': 'geojson', 'data': jsonAreaFilter});
                let layerName = {
                    'id': "areafilter",
                    'type': 'fill',
                    'source': "areafilter", // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#f21b7f', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false

            console.log('area filtered')
            }
            else{
                dispatch('alert/openCloseAlarm', {text: "No feature found for the selected area. Please restart your search", background: "#FFD700"}, { root:true })
                rootState.map.isLoading = false
                console.log('area filter has no result')
            }
            return Promise.resolve()
        },
        async applyAreaFilter({state, rootState, dispatch,commit,rootGetters}){
            if (state.areaFilterData){
                commit('ligfinder/updateFOIData',state.areaFilterData,{root:true})
                commit('ligfinder/createResultTable',null,{root:true})
                state.areaFilterData.name = "foi"
                commit('layers/updateFOI',{data:state.areaFilterData},{root:true})
                const sourceData = rootState.ligfinder.FOI
                dispatch('map/addFOI2Map',sourceData,{root:true}).then(()=>{
                    const isFOIonMap = typeof rootState.map.map.getLayer("foi") != 'undefined' ? true : false
                    const isFOIonLayerList = rootGetters['layers/isFOIonLayerList']
                    if (isFOIonMap && !isFOIonLayerList){
                        commit('layers/addFOI2LayerList',null,{root:true})
                    }
                }).then(()=>{
                    dispatch('alert/openCloseAlarm', {text: "The Area Filter Was Successfully Applied", background: "#00FF00"}, { root:true })
                    console.log('area filter applied')
                    commit(
                      "filtering/saveLastAreaFilter",
                      [
                        state.arMin,
                        state.arMax,
                        state.grossFloorMin,
                        state.grossFloorMax,
                        state.unbuiltAreaMin,
                        state.unbuiltAreaMax,
                      ].toString(),
                      { root: true }
                    );
                })
            }
            return Promise.resolve()
        },
        removeAreaFilterLayer({rootState}){
            const mapLayer = rootState.map.map.getLayer("areafilter");
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("areafilter")
                rootState.map.map.removeSource("areafilter")
            }
        }
    },
    getters:{
        getParams (state, getters, rootState) {
            console.log(rootState.ligfinder.FOI.features)
            const area_fme = []
            for (let i of rootState.ligfinder.FOI.features){
                area_fme.push(i.properties.area_fme)
            }
            const bgf_sum = []
            for (let i of rootState.ligfinder.FOI.features){
                bgf_sum.push(i.properties.bgf_sum)
            }
            const fl_unbeb_a = []
            for (let i of rootState.ligfinder.FOI.features){
                fl_unbeb_a.push(i.properties.fl_unbeb_a)
            }

            const minAreaFme = Math.floor(Math.min(...area_fme))
            const maxAreaFme = Math.ceil(Math.max(...area_fme))
            const minBgfSum = Math.floor(Math.min(...bgf_sum))
            const maxBgfSum = Math.ceil(Math.max(...bgf_sum))
            const minfl_unbeb_a = Math.floor(Math.min(...fl_unbeb_a))
            const maxfl_unbeb_a = Math.ceil(Math.max(...fl_unbeb_a))
            const areaRange = [minAreaFme, maxAreaFme, minBgfSum, maxBgfSum, minfl_unbeb_a, maxfl_unbeb_a]
            return areaRange
        }
    }
}

export default area
