const filtering = {
  namespaced: true,
  state: {
    appliedAOIFilter:null,
    appliedCriteriaFilter:null,
    appliedAreaFilter:null,
    requestedData:null
  },
  getters: {
    isAOIFilterChanged:(state)=>(payload)=>{
        /*
        1. check is verwaltungsgebiet changed
        2. check is geometry data changed
        3. check is isochrone data changed
        if one of these data change return true
        */
       let admAOI = false
       let geoAOI = false
       let isoAOI = false
        if(state.appliedAOIFilter != null){
            if(!(state.appliedAOIFilter[0].data != null) == !(payload[0].data != null)){
                if(state.appliedAOIFilter[0].data != null && payload[0].data != null){
                    let applied = []
                    let apply2 = []
                    state.appliedAOIFilter[0].data.forEach(el=>{applied.push(Number(el.id))})
                    payload[0].data.forEach(el=>{apply2.push(Number(el.id))})
                    if(applied.sort(function(a, b){return a-b}).toString() != apply2.sort(function(a, b){return a-b}).toString()){
                        admAOI = true
                    }
                } 
            } else {
                admAOI = true
            }
            if(state.appliedAOIFilter[1].data != null && payload[1].data != null){
                if(state.appliedAOIFilter[1].data.features[0].id != payload[1].data.features[0].id){
                    geoAOI = true
                }
            }
            if(state.appliedAOIFilter[2].data != null && payload[2].data != null){
                if(state.appliedAOIFilter[2].area != payload[2].area){
                    isoAOI = true
                }
            }
            if(admAOI||geoAOI||isoAOI){
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    },
    // eslint-disable-next-line
    isCriteriaFilterChanged:(state)=>(payload)=>{
        if(state.appliedCriteriaFilter != null){
            let incl=false 
            let excl=false
            let sel = false
            if(!state.appliedCriteriaFilter.includeTags.length == !payload.includeTags.length){
                if(payload.includeTags.length){
                    let appliedArr =[]
                    let arr2Apply =[]
                    payload.includeTags.forEach(el=>{arr2Apply.push(String(el.name).replaceAll(" ","").toLowerCase())})
                    state.appliedCriteriaFilter.includeTags.forEach(el=>{appliedArr.push(String(el.name).replaceAll(" ","").toLowerCase())})
                    if(appliedArr.sort().toString() != arr2Apply.sort().toString()){
                        console.log("included filter changed")
                        console.log("applied: ",appliedArr.sort().toString())
                        console.log("2apply: ",arr2Apply.sort().toString())
                        incl =true
                    }
                }
            } else {
                incl=true
            }
            if (!state.appliedCriteriaFilter.excludeTags.length == !payload.excludeTags.length) {
                if(payload.excludeTags.length){
                    let appliedArr,arr2Apply =[]
                    payload.excludeTags.forEach(el=>{arr2Apply.push(String(el.name).replaceAll(" ","").toLowerCase())})
                    state.appliedCriteriaFilter.excludeTags.forEach(el=>{appliedArr.push(String(el.name).replaceAll(" ","").toLowerCase())})
                    if(appliedArr.sort().toString() != arr2Apply.sort().toString()){
                        console.log("excluded filter changed")
                        console.log("applied: ",appliedArr.sort().toString())
                        console.log("2apply: ",arr2Apply.sort().toString())
                        excl =true
                    }
                }
            } else {
                excl = true
            }
            if (state.appliedCriteriaFilter.selectedOperator != payload.selectedOperator ){
                console.log("operator changed")
                sel = true
            } 
            if(incl || excl || sel){
                return true
            } else {
                return false
            }
        }else{
            return true
        }
    },
    isAreaFilterChanged:(state)=>(payload)=>{
        return !(JSON.stringify(state.appliedAreaFilter) === JSON.stringify(payload))
    }
  },
  mutations: {
    saveLastAOIFilter(state,payload){
        let arr =[]
        payload.forEach(el=>arr.push(JSON.stringify(el)))
        state.appliedAOIFilter = []
        arr.forEach(el=>state.appliedAOIFilter.push(JSON.parse(el)))
    },
    saveLastCriteriaFilter(state,payload){
        console.log("saving last criteria",payload)
        state.appliedCriteriaFilter = JSON.parse(payload)
    },
    saveLastAreaFilter(state,payload){
        let arr = payload.split(',')
        state.appliedAreaFilter =[]
        arr.forEach(el => {state.appliedAreaFilter.push(Number(el))}); 
    }
  },
  actions: {
    async filterHandler({rootState,dispatch}){
        if (rootState.AOI.selectedOperator== "Union"){
            await dispatch("AOI/getUnionParcels",null,{root:true})
        }
        else{
            await dispatch("AOI/getIntersectParcels",null,{root:true})
        }
        await dispatch("criteria/criteriaFilter",null,{root:true})
        await dispatch("criteria/applyCriteriaFilter",null,{root:true})
        await dispatch("area/areaFilter",null,{root:true})
        await dispatch("area/applyAreaFilter",null,{root:true})
    },
    async xfilterHandler({getters,rootState,dispatch}){
        /*  
            1. check aoi filter changed or not and get new foi accordingly
            2. check criteria filter changed or not and apply new filter accordingly
            3. check area filter changed or not and apply new filter accordingly
            4. save all last applied filters for future checks
        */
       let aoi2apply = [...rootState.AOI.AOIs]
       let criteria2apply = {
        includeTags:rootState.criteria.includeTags,
        excludeTags:rootState.criteria.excludeTags,
        operator:   rootState.criteria.selectedOperator
    }
       let area2apply = [
        rootState.area.arMin,
        rootState.area.arMax,
        rootState.area.grossFloorMin,
        rootState.area.grossFloorMax,
        rootState.area.unbuiltAreaMin,
        rootState.area.unbuiltAreaMax,
      ]
      console.log('area2apply: ',area2apply)
        if(getters['isAOIFilterChanged'](aoi2apply)){
            if (rootState.AOI.selectedOperator== "Union"){
                await dispatch("AOI/getUnionParcels",null,{root:true})
            }
            else{
                await dispatch("AOI/getIntersectParcels",null,{root:true})
            }
            await dispatch("criteria/criteriaFilter",null,{root:true})
            await dispatch("criteria/applyCriteriaFilter",null,{root:true})
            await dispatch("area/areaFilter",null,{root:true})
            await dispatch("area/applyAreaFilter",null,{root:true})
        }
        else if(getters['isCriteriaFilterChanged'](criteria2apply)){
            await dispatch("criteria/criteriaFilter",null,{root:true})
            await dispatch("criteria/applyCriteriaFilter",null,{root:true})
        }
        else if (getters['isAreaFilterChanged'](area2apply)) {
            await dispatch("area/areaFilter",null,{root:true})
            await dispatch("area/applyAreaFilter",null,{root:true})
        }
    }
  },
};
export default filtering;
