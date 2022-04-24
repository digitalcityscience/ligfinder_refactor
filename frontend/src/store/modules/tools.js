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
        },
        hideToolsPanel(state){
            if (state.toggle==true){
                state.toggle=false
                state.iconColor = '#ababab'
            }
        }
    },
    actions:{

    },
    getters:{

    }

}
export default tools