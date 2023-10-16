const ligfinder = {
    namespaced: true,
    state:{
        toggle: true,
        FOI: {'features':[]},
        aoiResult: {'features':[]},
        criteriaResult: {'features':[]},
        resultHeaders:[],
        resultItems:[],
        FOIGid: [],
        hamburgBbox: [9.730130859, 53.395010847, 10.325276797, 53.739437304]
    },
    mutations:{
        setLigfinderToggle(state){
            state.toggle=!state.toggle;
        },
        ligfinderToggle(state){
            state.toggle=false
        },
        updateFOIData(state,data){
            state.FOI = data
        },
        createResultTable(state){
            if (state.FOI.features.length > 0) {
                let arr = []
                Object.keys(state.FOI.features[0].properties).forEach((attr)=> arr.push({'text':attr,'value':attr}))
                state.resultHeaders = arr
                let items =[]
                state.FOI.features.forEach((feature)=>{items.push(feature.properties)})
                state.resultItems = items

            } else {
                state.resultHeaders = []
                state.resultItems = []
            }
        },
        saveAoiResult(state,data){
            state.aoiResult = data
        },
        saveCriteriaResult(state,data){
            state.criteriaResult = data
        }
        
    },
    actions:{
    },
    getters:{
        getFOIGid (state){
            let FOIGid = []
            for(let i of state.FOI.features){
                FOIGid.push(i.properties.gid)
            }
            return FOIGid
        }
    }

}
export default ligfinder