const legend =  {
    namespaced: true,
    state:{
        univariateToggle: false,
        bivariateToggle: false,
        attribute: "",
        lowerbound: null,
        breaks: [],
        colorPalette: "",
        bivariatePalette: {}
    },
    mutations:{
        setLegendToggle(state){
            state.univariateToggle=false
        }
    },
    actions:{
        
    },
    getters:{

    }
}

export default legend
