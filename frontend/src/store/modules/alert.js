const alert = {
    namespaced: true,
    state:{
        toggle: false,
    },
    mutations:{
        
    },
    actions:{
        openCloseAlarm({state}){
            state.toggle=true
            state.setTimeoutObject = setTimeout(() => {
                state.toggle = false
            }, 5000);
        }
    },
    getters:{

    }

}
export default alert