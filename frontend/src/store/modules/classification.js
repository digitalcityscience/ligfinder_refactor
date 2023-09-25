import { HTTP } from '../../utils/http-common';
import colorbrewer from "colorbrewer"
import colorMixer from "../../utils/colorMixer.js"
import hexToRgb from "../../utils/colorConversion.js"
const classification = {
    namespaced: true,
    state: {
        toggle: false,
        selectedLayer:"",
        choroplethMethod: [{'name': 'Univariate', 'disabled': true}, {'name': 'Bivariate', 'disabled': true}],
        selectedChoroplethMethod: "",
        attributes: [],
        attribute1: "",
        attribute2: "",
        classificationMethod : [ "Quantiles", "NaturalBreaks", "JenksCaspall", "EqualInterval"],
        selectedClassificationMethod: "",
        classes: [3,4,5,6,7],
        selectedClass:5,
        gids: [],
        selectedColorPalette: "",
        color1:"#ff0000",
        color2:"#00ff00",
        bivariatedata: null
    },
    mutations:{
        setClassificationToggle(state){
            state.toggle=!state.toggle;
        },
        classificationToggle(state){
            state.toggle=false
        }
        
    },
    actions:{
        selectAttributes({state,rootState}, payload){
            let attss = []
            state.attributes = []
            state.gids = []
            for (let i=0; i<rootState.layers.addedLayers.length; i++){
                if (payload === rootState.layers.addedLayers[i].name){
                    attss = rootState.layers.addedLayers[i].features[0].properties 
                    for(let g=0; g<rootState.layers.addedLayers[i].features.length; g++){
                        state.gids.push(rootState.layers.addedLayers[i].features[g].properties.gid)
                    }
                }
            }
            for (let j=0; j<Object.values(attss).length; j++){
                if(typeof Object.values(attss)[j] == 'number'){
                    if(Object.keys(attss)[j]!=="gid" && Object.keys(attss)[j]!=="__gid" && Object.keys(attss)[j]!=="id" && Object.keys(attss)[j]!=="objectid"){
                        state.attributes.push(Object.keys(attss)[j])
                    }
                        
                }
            }

            //rule-based enabling or disabling choropleth method based on the attribute length

            if (state.attributes.length>=2){
                state.choroplethMethod[0].disabled=false
                state.choroplethMethod[1].disabled=false
            }
            else if (state.attributes.length==1){
                state.choroplethMethod[0].disabled=false
                state.choroplethMethod[1].disabled=true
            }
            else if (state.attributes.length<1){
                state.choroplethMethod[0].disabled=true
                state.choroplethMethod[1].disabled=true
            }
            
        },
        classify({state, rootState}){

            if (state.selectedChoroplethMethod === "Bivariate"){
                rootState.map.isLoading = true
                HTTP
                .post('bivariate-classify', {
                    selectedLayer: state.selectedLayer,
                    selectedChoroplethMethod: state.selectedChoroplethMethod,
                    attribute1: state.attribute1,
                    attribute2: state.attribute2,
                    selectedClassificationMethod: state.selectedClassificationMethod,
                    selectedClass: state.selectedClass,
                    gids: state.gids
                })
                .then(response => {
                    state.bivariatedata = response.data
                    
                })
                .finally(()=>{
                    const palette1 = [colorMixer(hexToRgb(state.color1), [255,255,255], 0.33), colorMixer(hexToRgb(state.color1), [255,255,255], 0.66), colorMixer(hexToRgb(state.color1), [255,255,255], 1)]
                    const palette2 = [colorMixer(hexToRgb(state.color2), [255,255,255], 0.33), colorMixer(hexToRgb(state.color2), [255,255,255], 0.66), colorMixer(hexToRgb(state.color2), [255,255,255], 1)]
                    const bivariatePalette = {
                        'class00': colorMixer(palette1[0], palette2[0], 0.5),
                        'class10': colorMixer(palette1[1], palette2[0], 0.5),
                        'class20': colorMixer(palette1[2], palette2[0], 0.5),
                        'class01': colorMixer(palette1[0], palette2[1], 0.5),
                        'class11': colorMixer(palette1[1], palette2[1], 0.5),
                        'class21': colorMixer(palette1[2], palette2[1], 0.5),
                        'class02': colorMixer(palette1[0], palette2[2], 0.5),
                        'class12': colorMixer(palette1[1], palette2[2], 0.5),
                        'class22': colorMixer(palette1[2], palette2[2], 0.5),
                    }
                    rootState.legend.bivariatePalette = bivariatePalette
    
                  
                    let legend = document.getElementsByClassName('bivariatelegend')
                    let old_table = document.getElementById('bivariatetable')
                    if(old_table){
                        old_table.remove()
                    }
    
                    let table = document.createElement('table')
                    table.id = "bivariatetable"
                    let tbody = document.createElement('tbody')
                    for (let i=2; i>-1; i--){
                        let tr = document.createElement('tr');
                        for (let j=0; j<3; j++){
                            let td = document.createElement('td');
                            td.id = "class"+i.toString()+j.toString();
                            
                            let span = document.createElement('span');
                            span.innerHTML = i.toString()+j.toString()
                            span.style.backgroundColor = 'rgb('+ bivariatePalette['class'+i.toString()+j.toString()][0].toString() +',' + bivariatePalette['class'+i.toString()+j.toString()][1].toString()+',' + bivariatePalette['class'+i.toString()+j.toString()][2].toString()+')'
                            span.style.width = "3vw";
                            span.style.height = "3vw";
                            span.style.display =  'inline-block';
                            td.appendChild(span)
                            tr.appendChild(td)
                        
                        }
                        tbody.appendChild(tr)
                                            
                    }
                     
                    table.appendChild(tbody)                     
                    legend[0].appendChild(table)

                    rootState.legend.bivariateToggle =true
                    rootState.legend.univariateToggle =false
    
                    const mapLayer = rootState.map.map.getLayer('foi');
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeLayer('foi')
                        rootState.map.map.removeSource('foi')
                    }
                    rootState.map.map.addSource(("foi"),{'type': 'geojson', 'data': state.bivariatedata});
                    let layerName = {
                        'id': "foi",
                        'type': 'fill',
                        'source': "foi", // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': [
                                'match',
                                ['get', 'bivariateclass'],
                                "00".toString(),
                                `rgb(${bivariatePalette["class00"][0]},${bivariatePalette["class00"][1]},${bivariatePalette["class00"][2]})`,
                                "10".toString(),
                                `rgb(${bivariatePalette["class10"][0]},${bivariatePalette["class10"][1]},${bivariatePalette["class10"][2]})`,
                                "20".toString(),
                                `rgb(${bivariatePalette["class20"][0]},${bivariatePalette["class20"][1]},${bivariatePalette["class20"][2]})`,
                                "01".toString(),
                                `rgb(${bivariatePalette["class01"][0]},${bivariatePalette["class01"][1]},${bivariatePalette["class01"][2]})`,
                                "11".toString(),
                                `rgb(${bivariatePalette["class11"][0]},${bivariatePalette["class11"][1]},${bivariatePalette["class11"][2]})`,
                                "21".toString(),
                                `rgb(${bivariatePalette["class21"][0]},${bivariatePalette["class21"][1]},${bivariatePalette["class21"][2]})`,
                                "02".toString(),
                                `rgb(${bivariatePalette["class02"][0]},${bivariatePalette["class02"][1]},${bivariatePalette["class02"][2]})`,
                                "12".toString(),
                                `rgb(${bivariatePalette["class12"][0]},${bivariatePalette["class12"][1]},${bivariatePalette["class12"][2]})`,
                                "22".toString(),
                                `rgb(${bivariatePalette["class22"][0]},${bivariatePalette["class22"][1]},${bivariatePalette["class22"][2]})`,
                                /* other */ '#ccc'
                            ], 
                            'fill-opacity':1,
                            'fill-outline-color': '#000000',
                        }
                            
                    }
                        
                    rootState.map.map.addLayer(layerName)
                    rootState.map.isLoading = false
                })
                
            }
            else if (state.selectedChoroplethMethod === "Univariate"){
                HTTP
                .post('classify', {
                    selectedLayer: state.selectedLayer,
                    selectedChoroplethMethod: state.selectedChoroplethMethod,
                    attribute1: state.attribute1,
                    attribute2: state.attribute2,
                    selectedClassificationMethod: state.selectedClassificationMethod,
                    selectedClass: state.selectedClass,
                    gids: state.gids
                })
                .then(response => {
                    
                    function automatedstyle(){
                        let array = [[response.data.lowerbound, colorbrewer[state.selectedColorPalette][response.data.breaks.length][0]]]
                        for (let i=0; i<(response.data.breaks.length)-1; i++){
                            array.push(
                                [response.data.breaks[i], colorbrewer[state.selectedColorPalette][response.data.breaks.length][i+1]]
                            )
                        }
                        return array
                    }
                    rootState.map.map.setPaintProperty(state.selectedLayer,'fill-color', {
                        property: response.data.attribute,
                        type: 'interval',
                        stops:  automatedstyle(),
                        default: "#abaeb3" // for null values
    
                    })
                    rootState.legend.attribute = state.attribute1
                    rootState.legend.lowerbound = response.data.lowerbound
                    rootState.legend.breaks = response.data.breaks
                    rootState.legend.colorPalette = state.selectedColorPalette
                    
                    rootState.legend.univariateToggle =true
                    
                    
                })
                .finally(() =>{
                    if (state.selectedChoroplethMethod === "Univariate"){
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
                    }

                    
                })
            }
            
            
        },
        resetClassification({state, rootState}){
            rootState.map.map.setPaintProperty(state.selectedLayer,'fill-color', "#f21b7f", 'fill-opacity', 1)
            console.log(rootState.legend.univariateToggle)
            rootState.legend.univariateToggle =false
            
        }

    },
    getters:{
       
    }

}
export default classification