const area = {
    namespaced: true,
    state:{
        landAreaMin:0,
        landAreaMax:100,
        areaRange: [0,4073828],
        grossFloorAreaRange: [0,4073828],
        unbuiltAreaRange: [0,4073828],
        areaFilterData: null
    },
    mutations:{
        
    },
    actions:{
        
        areaFilter({state, rootState, dispatch}){
            rootState.compareLikedParcels.likedParcels= []
            rootState.compareLikedParcels.likedParcelsJsonResponse= null
            rootState.map.isLoading = true
            let jsonAreaFilter = rootState.ligfinder.FOI.features.filter( d=> 
                d.properties.area_fme>=state.areaRange[0] && d.properties.area_fme<=(state.areaRange[1]+1) && 
                d.properties.bgf_sum>=state.grossFloorAreaRange[0] && d.properties.bgf_sum<=(state.grossFloorAreaRange[1]+1) && 
                d.properties.fl_unbeb_a>=state.unbuiltAreaRange[0] && d.properties.fl_unbeb_a<=(state.unbuiltAreaRange[1]+1)
            )

            jsonAreaFilter = {
                features: jsonAreaFilter,
                type: 'FeatureCollection'
            }
            console.log("test push")
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
                        'fill-color': '#d99ec4', 
                        'fill-opacity':0.7,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                rootState.map.map.addLayer(layerName)
                rootState.map.isLoading = false
            }
            else{
                dispatch('alert/openCloseAlarm', {text: "No feature found for the selected area. Please restart your search", background: "#FFD700"}, { root:true })
                rootState.map.isLoading = false
            }
        },
        applyAreaFilter({state, rootState, dispatch}){
            if (state.areaFilterData){
                dispatch('ligfinder/updateFOIData',state.areaFilterData,{root:true})
                state.areaFilterData.name = "foi"
                dispatch('layers/updateFOI',{data:state.areaFilterData},{root:true})
                
                const foiLayer = rootState.map.map.getLayer("foi");
                if(typeof foiLayer !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
                rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': rootState.ligfinder.FOI});
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
                };
                
                rootState.map.map.addLayer(layerName)
                
                dispatch('alert/openCloseAlarm', {text: "The Area Filter Was Successfully Applied", background: "#00FF00"}, { root:true })

            }
            
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

            const minAreaFme = Math.min(...area_fme)
            const maxAreaFme = Math.max(...area_fme)
            const minBgfSum = Math.min(...bgf_sum)
            const maxBgfSum = Math.max(...bgf_sum)
            const minfl_unbeb_a = Math.min(...fl_unbeb_a)
            const maxfl_unbeb_a = Math.max(...fl_unbeb_a)
            const areaRange = [minAreaFme, maxAreaFme, minBgfSum, maxBgfSum, minfl_unbeb_a, maxfl_unbeb_a]
            state.areaRange = [minAreaFme, maxAreaFme]
            state.grossFloorAreaRange= [minBgfSum, maxBgfSum]
            state.unbuiltAreaRange=[minfl_unbeb_a, maxfl_unbeb_a]
            return areaRange
        }
    }
}

export default area
