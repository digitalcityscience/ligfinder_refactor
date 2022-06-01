const ligfinder = {
    namespaced: true,
    state:{
        toggle: false,
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
        
    },
    getters:{
        getFOIGid (state){
            let FOIGid = []
            for(let i =0; i< state.FOI.features.length; i++){
                FOIGid.push(state.FOI.features[i].properties.gid)
            }
            return FOIGid
        }
    }

}
export default ligfinder