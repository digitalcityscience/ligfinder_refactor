const tools = {
    namespaced: true,
    state: {
        iconColor: '#ababab',
        toggle: false,
    },
    mutations:{
        setToolsToggle(state){
            state.toggle=!state.toggle;
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        }
    },
    actions:{

    },
    getters:{

    }

}
export default tools