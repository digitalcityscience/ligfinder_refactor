import { HTTP } from '../../utils/http-common';
import colorbrewer from "colorbrewer"

const proximity = {
    namespaced: true,
    state: {
        supermarketMin: 0,
        supermarketMax: 1,
        supermarketWeight: 0.5,
        apothekeWeight: 0.5,
        apothekeMin: 0,
        apothekeMax:1,
        metroMin: 0,
        metroMax: 1,
        metroWeight: 0.5,
        selectedColorPalette: "Greens",
        supermarketCheckbox: true,
        metroCheckbox: true,
        apothekenCHeckbox: true,
        numberOfCheckedItems:3,
        parameters: [
            { name: 'Supermarket', value: 'supermarket', weight: 0.2, checked: true },
            { name: 'Metro Station', value: 'metro', weight: 0.2, checked: true },
            { name: 'Apotheken', value: 'apotheken', weight: 0.2, checked: true },
            { name: 'Krankenhaus', value: 'krankenhaus', weight: 0.2, checked: true },
            { name: 'Kita', value: 'kita', weight: 0.2, checked: true },
            
        ],
    },
    mutations:{
        disableWeight(state, payload){
            for (let i of state.parameters){
                if (i.value==payload){
                    i.weight=0
                }
            }

            
        },
        equalizeWeight(state){
            let activecount = 0
            
            for (let i=0; i<state.parameters.length; i++)
            {
              if (state.parameters[i].checked==true){
                activecount ++
              }
            }
            
            /*
            const criteriaLength = Object.keys(state.parameters).length;
            console.log(criteriaLength);
            */
            for (let i of state.parameters){
                if (i.checked == true ){
                    i.weight = 1/activecount
                }
                
            }
        },
        changeSlider(state, payload){
            console.log(state.parameters)
            let activecount = 0
            for (let i=0; i<state.parameters.length; i++)
            {
              if (state.parameters[i].checked==true){
                activecount ++
              }
            }
            
            let sum=0
            
            for (let i of state.parameters){
                if(i.checked == true){
                    sum+=i.weight
                }
                    
            }
            //console.log(sum, "3summmmmmm")
            //console.log(state, payload)

            const diff = sum - 1
            let remainder = 0
			//let arr=[]

            for(let i of state.parameters){
                if(i.value!= payload && i.checked==true){ //don't modify the slider which is being dragged
                    let val = i.weight - (diff / (activecount- 1))
                    if(val < 0){
                        remainder += val
                        val = 0
                    }
                    i.weight = val
                    
                }
                
            }

            if(remainder){
                let filteredLength = 0
                for (let i of state.parameters) {
                    if (i.value!= payload && i.weight>0 && i.checked==true){
                        filteredLength ++
                    }
                }
                for (let i of state.parameters) {
                    if (i.value!= payload && i.weight>0 && i.checked==true){
                        i.weight =remainder / filteredLength
                    }
                }
                console.log(filteredLength, "filteredLength")
                //const filteredLength = this.Sliders.filter((val, key) => val > 0 && key != slider).length
                /*for(let i in this.Sliders){
                    if(i != slider && this.Sliders[i] > 0){
                        this.$set(this.Sliders, i, this.Sliders[i] + remainder / filteredLength)
                    }
                            
                }*/
      
            }
            console.log(state.parameters, "state.parameters")
            console.log(remainder, "reminder")

            /*let activecount = 0
            for (let i=0; i<state.parameters.length; i++)
            {
              if (state.parameters[i].checked==true){
                activecount ++
              }
            }
            console.log(activecount, "activecount")
            console.log(payload)
            let sum=0
            let diff=0
            for (let i of state.parameters){
                if(i.checked == true)
                    sum+=i.weight
            }
            diff = Number((sum-1).toFixed(2))
            console.log(sum,diff)
            let remainder =0
            for (let i of state.parameters){
                if (i.value!=payload && i.checked == true ){
                    let val = i.weight - (diff / (activecount-1))
                    if(i.weight - (diff / (activecount -1)) < 0){
                        console.log("here")
                        remainder += val
                        val = 0
                    }
                    
                    i.weight = val
                
                }
                
            }
            let count =0
            for (let i of state.parameters){
                if(i.value!=payload && i.weight > 0){
                    if (i){
                        count++
                    }
                }
            }
            for (let i of state.parameters){
                if(i.value!=payload && i.weight > 0 ){
                    
                    console.log( count)
                    console.log(remainder, 'inside')
                    i.weight += remainder /(activecount)
                }
            }*/
            
            
           
        },
        
    },
    actions:{
        proximityAnalysis({rootState, state,dispatch}){
            console.log(state)
            let parcelGid = []
            for(let i =0; i< rootState.ligfinder.FOI.features.length; i++){
                parcelGid.push(rootState.ligfinder.FOI.features[i].properties.gid)
            }
            rootState.map.isLoading = true
            HTTP
            .post('get-proximity-scoring-result', {
                foi: parcelGid,
                parameters: state.parameters
            })
            .then(response => {
                console.log(colorbrewer.Greens[5][0])

                /* for the classification purpose: to update addedLayers
                 array every time to analysis is updated
                */
                response.data.data.name = "foi"
                dispatch('layers/updateFOI',{data:response.data.data},{root:true})

                const lowerbound = response.data.lowerbound
                const breaks = response.data.breaks
                rootState.ligfinder.FOI = response.data.data
                const mapLayer = rootState.map.map.getLayer("foi");
                if(typeof mapLayer !== 'undefined'){
                    rootState.map.map.removeLayer("foi")
                    rootState.map.map.removeSource("foi")
                }
                rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': rootState.ligfinder.FOI});
                let layerName = {
                    'id': "foi",
                    'type': 'fill',
                    'source': "foi", // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#FC44D7', 
                        'fill-opacity':1,
                        'fill-outline-color': '#000000',
                    }
                    
                };
                
                rootState.map.map.addLayer(layerName)
                rootState.map.map.setPaintProperty('foi','fill-color', {
                    property: 'total_score',
                    type: 'interval',
                    stops: [
                        [lowerbound, colorbrewer.Greens[5][0]],
                        [breaks[0], colorbrewer.Greens[5][1]],
                        [breaks[1], colorbrewer.Greens[5][2]],
                        [breaks[2], colorbrewer.Greens[5][3]],
                        [breaks[3], colorbrewer.Greens[5][4]]
                    ]

                })

                rootState.map.isLoading = false
                rootState.legend.attribute = 'total_score'
                rootState.legend.lowerbound = response.data.lowerbound
                rootState.legend.breaks = response.data.breaks
                rootState.legend.colorPalette = state.selectedColorPalette
                
                rootState.legend.univariateToggle =true
            })
            .finally(() =>{
                let legend = document.getElementsByClassName('legend')
                for(let i=0; i<8; i++){
                    let old_div = document.getElementById("class"+i.toString());
                    if(old_div){
                        old_div.remove()
                    }
                }
                for (let i= 0; i< rootState.legend.breaks.length; i++){
                    
                    let div = document.createElement('div');
                    div.id = "class"+i.toString();

                    let span_obj = document.createElement("span");
                    
                    span_obj.style.backgroundColor = colorbrewer[state.selectedColorPalette][rootState.legend.breaks.length][i]
                    span_obj.style.borderRadius = '50%';
                    span_obj.style.display =  'inline-block';
                    span_obj.style.height = "10px";
                    span_obj.style.marginLeft = "5px";
                    span_obj.style.width = "10px";
                    let atag = document.createElement("a");
                    atag.style.marginLeft = "5px";
                    if (i==0){
                        atag.innerHTML = (rootState.legend.lowerbound).toFixed(2) + " - " + (rootState.legend.breaks[0]).toFixed(2)
                    }
                    else{
                        atag.innerHTML = (rootState.legend.breaks[i-1]).toFixed(2) + " - " + (rootState.legend.breaks[i]).toFixed(2)
                    }
                    
                    
                    div.appendChild(span_obj);
                    div.appendChild(atag);
                    legend[0].appendChild(div)
                    
                }
                
            })
        },
    },
    getters:{
        
    }
}
export default proximity
