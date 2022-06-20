import { HTTP } from '../../utils/http-common';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import maplibregl from 'maplibre-gl'
import { createHtmlAttributesNewspaperDataset } from '../../utils/createHtmlAttributesNewspaperDataset';
import { createDuplicatePointAttributesNewspaper } from '../../utils/createDuplicatePointAttributesNewspaper';
import { createHtmlAttributesParliamentDataset } from '../../utils/createHtmlAttributesParliamentDataset';
import { createDuplicatePointAttributesParliament } from '../../utils/createDuplicatePointAttributesParliament';


const geoparsing = {
    namespaced: true,
    state:{
        toggle: false,
        items: ['Circle', 'Heat Map', 'Point Cluster', '2D Hexagon', '3D Hexagon', 'No Style'],
        switch1: false,
        switch2: false,
        geocodedData: null,
        newspaperData: null,
        hexagonVisible: true,
        datasetOptions: [
            { name: 'Parliament Database', value: 'parliament' },
            { name: 'News Paper', value: 'newspaper' },
            
        ],
        datasetMode: null,
        parliamentPdfLink: null,
        newspaperMailLink: null,
        wordFrequency: [],
        toolMode:null,
        dates: ['2022-01-05', '2022-01-20'],
        maxDate: null,
        minDate: null,
        topics: [
            'BauGB',
            'Erbbaurechts',
            'Grundvermogen',
            'Hochwasser',
            'Immo',
            'Verkaufsrecht'
        ],
        topicItems: [
            'BauGB',
            'Erbbaurechts',
            'Grundvermogen',
            'Hochwasser',
            'Immo',
            'Verkaufsrecht'
        ],
        topicQueryModes:["AND", "OR"],
        selectedTopicQueryMode: "OR"
    },
    mutations:{
        setGeoparsingToggle(state){
            console.log(state.toggle)
            state.toggle=!state.toggle;
        },
        geoparsingToggle(state){
            state.toggle=false
        },
        setToolModeStylization(state){
            state.toolMode= "stylization"
        },
        setToolModeFiltering(state){
            state.toolMode= "filtering"
        },
        setToolModeTopic(state){
            state.toolMode= "topic"
        }
        
    },
    actions:{
        getGeocodedPoints({state, rootState, dispatch}){
            dispatch('removeStyles');
            HTTP
            .get('get-geocoded-points')
            .then(response => {
                state.geocodedData = response.data
                rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': response.data});
                rootState.map.map.addLayer({
                    'id': 'geocoded',
                    'type': 'circle',
                    'source': 'geocoded',
                    'paint': {
                        'circle-color': '#8931e0'
                    }
                });
                dispatch('computeParliamentDateRange')
                
            })
        },
        computeParliamentDateRange({state}){
            let dateArray = []
            for (let i=0; i<state.geocodedData.features.length; i++){
                dateArray.push(state.geocodedData.features[i].properties.date)
            }
            let sorted = dateArray.slice()
            .sort(function(a, b) {
                return new Date(a) - new Date(b);
            });
            state.maxDate = sorted.pop()
            state.minDate = sorted.shift()
        },
        getNewspaperPoints({state, rootState, dispatch}){
            dispatch('removeStyles');
            HTTP
            .get('get-geocoded-newspaper-points')
            .then(response => {
                state.newspaperData = response.data
                rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': response.data});
                rootState.map.map.addLayer({
                    'id': 'geocoded',
                    'type': 'circle',
                    'source': 'geocoded',
                    'paint': {
                        'circle-color': '#8931e0'
                    }
                });
                dispatch('computeNewspaperDateRange')
                
            })
        },
        computeNewspaperDateRange({state}){
            let dateArray = []
            for (let i=0; i<state.newspaperData.features.length; i++){
                dateArray.push(state.newspaperData.features[i].properties.doc_num)
            }
            let sorted = dateArray.slice()
            .sort(function(a, b) {
                return new Date(a) - new Date(b);
            });
            state.maxDate = sorted.pop()
            state.minDate = sorted.shift()
        },
        removeStyles({rootState}){

            const mapLayer = rootState.map.map.getLayer('geocoded');
            const stylelayer = rootState.map.map.getLayer('stylelayer');
            const hexagonlayer = rootState.map.map.getLayer('hexagon');
            const hexagonlayer2D = rootState.map.map.getLayer('hexagon2D');
            const clustercount = rootState.map.map.getLayer('clustercount');
            if(typeof hexagonlayer !== 'undefined'){
                rootState.map.map.removeLayer('hexagon')
            }
            if(typeof hexagonlayer2D !== 'undefined'){
                rootState.map.map.removeLayer('hexagon2D')
            }
            if(typeof mapLayer !== 'undefined'){
                if(typeof stylelayer !== 'undefined'){
                    rootState.map.map.removeLayer('stylelayer')
                }
                
                if(typeof clustercount !== 'undefined'){
                    rootState.map.map.removeLayer('clustercount')
                }
                
                rootState.map.map.removeLayer('geocoded')
                rootState.map.map.removeSource('geocoded')

            }
            
        },
                
        changeStyle({state, rootState, dispatch}, payload){
            let points =null
            if (state.datasetMode=='parliament'){
                points = state.geocodedData
            }
            else{
                points = state.newspaperData
            }
            if (payload === "Circle"){
                dispatch('removeStyles');
                rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': points});
                rootState.map.map.addLayer({
                    'id': 'geocoded',
                    'type': 'circle',
                    'source': 'geocoded',
                    'paint': {
                        'circle-color': '#8931e0'
                    }
                });
            }
            else if (payload === "Heat Map"){
                
                dispatch('removeStyles');
                rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': points});
                rootState.map.map.addLayer({
                    id: 'stylelayer',
                    type: 'heatmap',
                    source: 'geocoded',
                    maxzoom: 19,
                    paint: {
                     
                      // increase intensity as zoom level increases
                      'heatmap-intensity': {
                        stops: [
                          [11, 1],
                          [15, 3]
                        ]
                      },
                      // assign color values be applied to points depending on their density
                      'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(236,222,239,0)',
                        0.2, 'rgb(208,209,230)',
                        0.4, 'rgb(166,189,219)',
                        0.6, 'rgb(103,169,207)',
                        0.8, 'rgb(28,144,153)'
                      ],
                      // increase radius as zoom increases
                      'heatmap-radius': {
                        stops: [
                          [11, 15],
                          [15, 20]
                        ]
                      },
                      // decrease opacity to transition into the circle layer
                      'heatmap-opacity': {
                        default: 1,
                        stops: [
                          [14, 1],
                          [15, 0]
                        ]
                      },
                    }
                });
                rootState.map.map.addLayer(
                    {
                      id: 'geocoded',
                      type: 'circle',
                      source: 'geocoded',
                      minzoom: 14,
                      paint: {
                        // increase the radius of the circle as the zoom level and dbh value increases
                        'circle-radius': {
                          property: 'dbh',
                          type: 'exponential',
                          stops: [
                            [{ zoom: 15, value: 1 }, 5],
                            [{ zoom: 15, value: 62 }, 10],
                            [{ zoom: 22, value: 1 }, 20],
                            [{ zoom: 22, value: 62 }, 50]
                          ]
                        },
                        'circle-color': 
                           ' #8931e0'
                        ,
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        'circle-opacity': {
                          stops: [
                            [14, 0],
                            [15, 1]
                          ]
                        }
                      }
                    }
                );
            }
            else if (payload === "Point Cluster"){
                dispatch('removeStyles');
                
                rootState.map.map.addSource('geocoded', {
                    type: 'geojson',
                    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                    data:points,
                    cluster: true,
                    clusterMaxZoom: 19, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });
                rootState.map.map.addLayer({
                    id: 'stylelayer',
                    type: 'circle',
                    source: 'geocoded',
                    filter: ['has', 'point_count'],
                    paint: {
                    'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                    ],
                    'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                    ]
                    }
                });
                     
                rootState.map.map.addLayer({
                    id: 'clustercount',
                    type: 'symbol',
                    source: 'geocoded',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });
                rootState.map.map.addLayer({
                    id: 'geocoded',
                    type: 'circle',
                    source: 'geocoded',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                    'circle-color': '#8931e0',
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                    }
                });
            }
            else if (payload === "2D Hexagon"){
                
                dispatch('removeStyles');
                const myDeckLayer = new MapboxLayer({
                    id: 'hexagon2D',
                    type: HexagonLayer,
                    data: points.features,
                    getPosition: f => f.geometry.coordinates,
                    pickable: true,
                    visible: state.hexagonVisible,
                    radius: 1000,
                    elevationScale: 10,
                    extruded: false,
                    coverage: 1,
                    upperPercentile: 100,
                    autoHighlight: true,
                    elevationRange: [0, 3000],
                    //getRadius: d => d.size,
                    getColor: [255, 0, 0]
                });
                rootState.map.map.addLayer(myDeckLayer);
            }
            else if (payload === "3D Hexagon"){
                
                dispatch('removeStyles');
                const myDeckLayer = new MapboxLayer({
                    id: 'hexagon',
                    type: HexagonLayer,
                    data: points.features,
                    getPosition: f => f.geometry.coordinates,
                    pickable: true,
                    visible: state.hexagonVisible,
                    radius: 1000,
                    elevationScale: 10,
                    extruded: true,
                    coverage: 1,
                    upperPercentile: 100,
                    autoHighlight: true,
                    elevationRange: [0, 3000],
                    //getRadius: d => d.size,
                    getColor: [255, 0, 0]
                });
                rootState.map.map.addLayer(myDeckLayer);
            }
        
        },
        newspaperPopup({state, rootState, dispatch}, e){
            state.wordFrequency = []
            let coordinates
            if (e.features.length==1){
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                let clickedPointDate = e.features[0].properties.doc_num
                HTTP
                .post('get-word-frequency',{
                    date: clickedPointDate
                })
                .then(response => {
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                    }
                })

                let pdflink = e.features[0].properties.URL
                let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
                state.newspaperMailLink= matches[0]

                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)

                if (e.features[0].properties['URL']){
                    delete e.features[0].properties['URL']
                }
                
                popup.setDOMContent(createHtmlAttributesNewspaperDataset(rootState, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency))
                
                popup.addTo(rootState.map.map);
            
            }
            else{
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]

                let list = e.features
                console.log(list)
                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                popup.setDOMContent(createDuplicatePointAttributesNewspaper(rootState,dispatch, popup, list))
                
                popup.addTo(rootState.map.map);
            
            }
        },
        addSelectedDuplicatePointNewspaper({state, rootState}, payload){
            console.log(state, payload)
            var selectedfeature = payload.list.filter(a => a.properties.id == payload.id);
            console.log(selectedfeature, "selectedfeature")
            let clickedPointDate = selectedfeature[0].properties.doc_num
            HTTP
            .post('get-word-frequency',{
                date: clickedPointDate
            })
            .then(response => {
                for (let i in response.data) {
                    rootState.geoparsing.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                }
                //state.wordFrequency= response.data
                console.log(response.data)
            })

            let pdflink = selectedfeature[0].properties.URL
            let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
            state.newspaperMailLink= matches[0]

            let popup = new maplibregl.Popup()
            popup.setLngLat([selectedfeature[0].properties.lon, selectedfeature[0].properties.lat])

            if (selectedfeature[0].properties['URL']){
                delete selectedfeature[0].properties['URL']
            }
            popup.setDOMContent(createHtmlAttributesNewspaperDataset(rootState, selectedfeature[0].properties.lon, selectedfeature[0].properties.lat, selectedfeature[0].properties, rootState.geoparsing.wordFrequency))
            
            popup.addTo(rootState.map.map);
        },
        parliamentPopup({state, rootState, dispatch}, e){
            state.wordFrequency = []
            let coordinates 
            if (e.features.length==1){
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                let clickedDocNum = e.features[0].properties.doc_num
                HTTP
                .post('get-word-frequency-parliament',{
                    docNum: clickedDocNum
                })
                .then((response)=>{
                    console.log(response.data)
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                    }
                })
                let pdflink = e.features[0].properties.hyperlink
                let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
                state.parliamentPdfLink= matches[0]

                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                delete e.features[0].properties['hyperlink'];
                popup.setDOMContent(createHtmlAttributesParliamentDataset(rootState, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency))
                
                popup.addTo(rootState.map.map);

            }
            else{
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]

                let list = e.features
                console.log(list)
                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                popup.setDOMContent(createDuplicatePointAttributesParliament(rootState,dispatch, popup, list))
                
                popup.addTo(rootState.map.map);
            
            }
            
        },
        addSelectedDuplicatePointParliament({state,rootState}, payload){
            var selectedfeature = payload.list.filter(a => a.properties.id == payload.id);
            state.wordFrequency = []
            let clickedDocNum = selectedfeature[0].properties.doc_num
            HTTP
                .post('get-word-frequency-parliament',{
                    docNum: clickedDocNum
                })
                .then((response)=>{
                    console.log(response.data)
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                }
            })
            let pdflink = selectedfeature[0].properties.hyperlink
            let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
            state.parliamentPdfLink= matches[0]

            let popup = new maplibregl.Popup()
            popup.setLngLat([selectedfeature[0].properties.lon, selectedfeature[0].properties.lat])
            delete selectedfeature[0].properties['hyperlink'];
            popup.setDOMContent(createHtmlAttributesParliamentDataset(rootState, selectedfeature[0].properties.lon, selectedfeature[0].properties.lat, selectedfeature[0].properties, rootState.geoparsing.wordFrequency))
            
            popup.addTo(rootState.map.map);
        },
        dateFilter({state, rootState, dispatch}){
            HTTP
            .post('geoparsing-date-filter',{
                dates: state.dates,
                datasetMode: state.datasetMode
            })
            .then(response=>{
                console.log(response.data)
                if (state.datasetMode=='parliament'){
                    if (response.data.features!=null){
                        dispatch('removeStyles')
                        state.geocodedData = response.data
                        rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': response.data});
                        rootState.map.map.addLayer({
                            'id': 'geocoded',
                            'type': 'circle',
                            'source': 'geocoded',
                            'paint': {
                                'circle-color': '#8931e0'
                            }
                        });
                    }
                    else{

                        dispatch('alert/openCloseAlarm', {text: "No feature found for the selected dates", background: "#FFD700"}, { root:true })
                    }
                    
                }
                else if (state.datasetMode=='newspaper'){
                    if (response.data.features!=null){
                        dispatch('removeStyles')
                        state.newspaperData = response.data
                        rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': response.data});
                        rootState.map.map.addLayer({
                            'id': 'geocoded',
                            'type': 'circle',
                            'source': 'geocoded',
                            'paint': {
                                'circle-color': '#8931e0'
                            }
                        });
                    }
                    else{

                        dispatch('alert/openCloseAlarm', {text: "No feature found for the selected dates", background: "#FFD700"}, { root:true })

                    }
                    
                }
            })
        },
        topicFilter({state, rootState, dispatch}){
            HTTP
            .post('geoparsing-topic-filter',{
                topics: state.topics,
                topicQueryMode: state.selectedTopicQueryMode
            })
            .then((response)=>{
                console.log(response.data)
                if (response.data.features!=null){
                    dispatch('removeStyles')
                    state.geocodedData = response.data
                    rootState.map.map.addSource('geocoded',{'type': 'geojson', 'data': response.data});
                    rootState.map.map.addLayer({
                        'id': 'geocoded',
                        'type': 'circle',
                        'source': 'geocoded',
                        'paint': {
                            'circle-color': '#8931e0'
                        }
                    });
                }
                else{

                    dispatch('alert/openCloseAlarm', {text: "No feature found for the selected topics", background: "#FFD700"}, { root:true })

                }

            })
        }
       
    },
    getters:{

    }

}
export default geoparsing