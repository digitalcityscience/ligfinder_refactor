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
        
    },
    actions:{

    },
    getters:{

    }

}
export default ligfinder