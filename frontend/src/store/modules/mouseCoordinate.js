const mouseCoordinate= {
    namespaced:true,
    state:{
        iconColor: '#ababab',
        toggle: false,
        mouseLat: null,
        mouseLng: null,
    },
    mutations:{
        setMouseCoordinateToggle (state){
            state.toggle = !state.toggle;
           
            state.toggle ? state.iconColor = '#FFFFFF' :  state.iconColor = '#ababab';
        },
        setMouseCoordinate(state, payload){
            state.mouseLat=payload.lat;
            state.mouseLng=payload.lng; 
        }
    },
    actions:{

    },
    getters:{

    }
}
export default mouseCoordinate