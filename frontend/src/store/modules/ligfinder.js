const ligfinder = {
    namespaced: true,
    state:{
        toggle: false,
        FOI: {'features':[]},
        FOIGid: []
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