const alert = {
    namespaced: true,
    state:{
        toggle: false,
        alertText: null,
        background: "#FFD700"
    },
    mutations:{
        
    },
    actions:{
        openCloseAlarm({state}, payload){
            state.alertText = payload.text
            state.toggle=true
            state.background = payload.background
            state.setTimeoutObject = setTimeout(() => {
                state.toggle = false
            }, 5000);
        }
    },
    getters:{

    }

}
export default alert