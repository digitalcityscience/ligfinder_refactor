const alert = {
    namespaced: true,
    state:{
        toggle: false,
        alertText: null
    },
    mutations:{
        
    },
    actions:{
        openCloseAlarm({state}, payload){
            state.alertText = payload.text
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