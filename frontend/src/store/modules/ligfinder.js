const ligfinder = {
    namespaced: true,
    state:{
        toggle: true,
        FOI: {'features':[]},
        FOIGid: [],
        hamburgBbox: [9.730130859, 53.395010847, 10.325276797, 53.739437304]
    },
    mutations:{
        setLigfinderToggle(state){
            state.toggle=!state.toggle;
        },
        ligfinderToggle(state){
            state.toggle=false
        }
        
    },
    actions:{
        updateFOIData({state},data){
            state.FOI = data
        }
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