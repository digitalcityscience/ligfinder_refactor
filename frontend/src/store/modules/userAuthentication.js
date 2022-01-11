const userAuthentication=  {
    namespaced: true,
    state:{
        isUser:null
    },
    mutations:{
        userValidation(state, payload){
            state.isUser= payload
        }
    },
    actions:{

    },
    getters:{

    }
}

export default userAuthentication