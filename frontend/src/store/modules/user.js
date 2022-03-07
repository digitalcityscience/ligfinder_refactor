import { HTTP } from '../../utils/http-common';
const user = {
    namespaced: true,
    state:{
        toggle: false,
        iconColor: '#ababab',
        boxShadow: '0 0 2px #888'
    },
    mutations:{
        setUserToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
            state.toggle ? state.boxShadow = '0 0 2px #FFFFFF' :  state.boxShadow = '0 0 2px #888';
        },
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
                }
                else {
                    backgroundColor = "#FFD700"
                }
                dispatch('alert/openCloseAlarm', {text: response.data.text, background: backgroundColor}, { root:true })
            })
        }

    },
    getters:{

    }

}
export default user