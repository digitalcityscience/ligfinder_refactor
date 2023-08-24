import { HTTP } from '../../utils/http-common';

const user = {
    namespaced: true,
    state:{
        iconColor: '#ababab',
        boxShadow: '0 0 2px #888',
        loggedIn: false,
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        nameAbbreviation: null,
        userSavedResults:null
    },
    mutations:{
        logout(state){
            state.loggedIn=false
        }
    },
    actions:{
        register({state, dispatch}, payload){
            console.log( state, payload)
            HTTP
            .post('register-user', {
                payload: payload
            })
            .then(response => {
                console.log(response.data)
                let backgroundColor = null
                if (response.data.status=="success"){
                    backgroundColor = "#00FF00"
                }
                else {
                    backgroundColor = "#FFD700"
                }
                dispatch('alert/openCloseAlarm', {text: response.data.text, background: backgroundColor}, { root:true })
            })
        },
        login({state, dispatch}, payload){
            console.log(state, payload)
            HTTP
            .post('login-user', {
                payload: payload
            })
            .then(response => {
                let backgroundColor = null
                if (response.data.status=="success"){
                    backgroundColor = "#00FF00"
                    state.id = response.data.id
                    state.loggedIn = true
                    state.firstname = response.data.firstname
                    state.lastname = response.data.lastname
                    state.email = response.data.email
                    let firstname = state.firstname
                    let lastname = state.lastname
                    let firstnameLetter = firstname.charAt(0)
                    let lastnameLetter = lastname.charAt(0) 
                    state.nameAbbreviation = firstnameLetter+lastnameLetter
                }
                else {
                    backgroundColor = "#FFD700"
                }
                dispatch('alert/openCloseAlarm', {text: response.data.text, background: backgroundColor}, { root:true })
            })
        },
        logoutAlert({dispatch}){
            dispatch('alert/openCloseAlarm', {text: "You are logged out", background: "#FFD700"}, { root:true })

        },
        clearSearchResult({rootState}){
            const mapLayer = rootState.map.map.getLayer("foi")
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeLayer("foi")
                rootState.map.map.removeSource("foi")
            }
            rootState.ligfinder.FOI= {'features':[]}
            rootState.criteria.includeTags= []
            rootState.criteria.excludeTags= []
            // zoom to the extent of Hamburg
            rootState.map.map.fitBounds(rootState.ligfinder.hamburgBbox)
        },
        loadSavedResults({state}){
            console.log(state.id)
            HTTP
            .post('get-saved-user-resultss', {
                id: state.id
            })
            .then(response => {
                state.userSavedResults = response.data
                console.log(state.userSavedResults)

            })
        }

    },
    getters:{
       
    }

}
export default user