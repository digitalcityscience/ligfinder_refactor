import { HTTP } from '../../utils/http-common';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import maplibregl from 'maplibre-gl'
import { createHtmlAttributesNewspaperDataset } from '../../utils/createHtmlAttributesNewspaperDataset';
import { createDuplicatePointAttributesNewspaper } from '../../utils/createDuplicatePointAttributesNewspaper';
import { createHtmlAttributesParliamentDataset } from '../../utils/createHtmlAttributesParliamentDataset';
import { createDuplicatePointAttributesParliament } from '../../utils/createDuplicatePointAttributesParliament';
import { createHtmlAttributesElbeDataset } from '../../utils/createHtmlAttributesElbeDataset';
import { createDuplicatePointAttributesElbe } from '../../utils/createDuplicatePointAttributesElbe';


const geoparsing = {
    namespaced: true,
    state:{
        toggle: false,
        items: ['Circle', 'Heat Map', 'Point Cluster', '2D Hexagon', '3D Hexagon', 'No Style'],
        geocodedData: null,
        newspaperData: null,
        elbeData:null,
        datasetOptions: [
            { name: 'Parliament Database', value: 'parliament' },
            { name: 'News Paper', value: 'newspaper' },
            { name: 'Elbewochenblat', value: 'elbe'}
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
            "Immo",
            "Baugb",
            "Hochwasser",
            "Grundvermogen",
            "Erbbaurechts",
            "Vorkaufsrecht",
            "Baulandmobilisierung",
            "Busbeschleunigungsprogramm",
            "Entwicklungsplan",
            "Finanzbehörde",
            "Fernwärme"
        ],
        topicItems: [
            "Immo",
            "Baugb",
            "Hochwasser",
            "Grundvermogen",
            "Erbbaurechts",
            "Vorkaufsrecht",
            "Baulandmobilisierung",
            "Busbeschleunigungsprogramm",
            "Entwicklungsplan",
            "Finanzbehörde",
            "Fernwärme"
        ],
        elbeTopics:[
            "Pandemie",
            "Gesundheit und Soziales",
            "Mobilität",
            "Sport",
            "Politik",
            "Schulen & Bildung",
            "Wohnen",
            "Konzerte & Events",
            "Porträts aus der Nachbarschaft",
            "Zivilgesellschaft",
            "Nicht zugeordnet",
        ],
        elbeTopicItems:[
            "Pandemie",
            "Gesundheit und Soziales",
            "Mobilität",
            "Sport",
            "Politik",
            "Schulen & Bildung",
            "Wohnen",
            "Konzerte & Events",
            "Porträts aus der Nachbarschaft",
            "Zivilgesellschaft",
            "Nicht zugeordnet",
        ],
        topicQueryModes:["AND", "OR"],
        elbeTopicQueryModes:["AND", "OR"],
        selectedTopicQueryMode: "OR",
        elbeSelectedTopicQueryMode:"OR",
        duplicatedNewspaper:false,
        duplicatedNewspaperData:{
            coordiates: null,
            list:null
        },
        duplicatedParliament:false,
        duplicatedParliamentData:{
            coordiates: null,
            list:null
        },
        duplicatedElbe:false,
        duplicatedElbeData:{
            coordiates:null,
            list:null
        }
    },
    mutations:{
        setGeoparsingToggle(state){
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
        },
        resetDate(state){
            state.dates= ['2022-01-05', '2022-01-20']
        }
        
    },
    actions:{
        getGeocodedPoints({state, rootState, dispatch}){
            dispatch("removeStyles").then(() => {
              if (state.geocodedData) {
                rootState.map.map.addSource("geocoded", {
                  type: "geojson",
                  data: state.geocodedData,
                });
                rootState.map.map.addLayer({
                  id: "geocoded",
                  type: "circle",
                  source: "geocoded",
                  paint: {
                    "circle-color": "#8931e0",
                  },
                });
                dispatch("computeParliamentDateRange");
                dispatch("layers/addGeoparsingLayer", "parliament", {
                  root: true,
                });
              } else {
                HTTP.get("get-geocoded-points").then((response) => {
                  state.geocodedData = response.data;
                  rootState.map.map.addSource("geocoded", {
                    type: "geojson",
                    data: response.data,
                  });
                  rootState.map.map.addLayer({
                    id: "geocoded",
                    type: "circle",
                    source: "geocoded",
                    paint: {
                      "circle-color": "#8931e0",
                    },
                  });
                  dispatch("computeParliamentDateRange");
                  dispatch("layers/addGeoparsingLayer", "parliament", {
                    root: true,
                  });
                });
              }
            });
            
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
            dispatch("removeStyles").then(() => {
              HTTP.get("get-geocoded-newspaper-points").then((response) => {
                state.newspaperData = response.data;
                rootState.map.map.addSource("geocoded", {
                  type: "geojson",
                  data: response.data,
                });
                rootState.map.map.addLayer({
                  id: "geocoded",
                  type: "circle",
                  source: "geocoded",
                  paint: {
                    "circle-color": "#8931e0",
                  },
                });
                dispatch("computeNewspaperDateRange");
                dispatch("layers/addGeoparsingLayer", "newspaper", {
                  root: true,
                });
              });
            });
            
        },
        computeNewspaperDateRange({state}){
            let dateArray = []
            for (let i=0; i<state.newspaperData.features.length; i++){
                dateArray.push(state.newspaperData.features[i].properties.date)
            }
            let sorted = dateArray.slice()
            .sort(function(a, b) {
                return new Date(a) - new Date(b);
            });
            state.maxDate = sorted.pop()
            state.minDate = sorted.shift()
        },
        getElbePoints({state,rootState,dispatch}){
            dispatch("removeStyles").then(() => {
                if (state.elbeData) {
                  rootState.map.map.addSource("geocoded", {
                    type: "geojson",
                    data: state.elbeData,
                  });
                  rootState.map.map.addLayer({
                    id: "geocoded",
                    type: "circle",
                    source: "geocoded",
                    paint: {
                      "circle-color": "#8931e0",
                    },
                  });
                  dispatch("computeElbeDateRange");
                  dispatch("layers/addGeoparsingLayer", "elbe", {
                    root: true,
                  });
                } else {
                  HTTP.get("get-geocoded-elbe-points").then((response) => {
                    state.elbeData = response.data;
                    rootState.map.map.addSource("geocoded", {
                      type: "geojson",
                      data: response.data,
                    });
                    rootState.map.map.addLayer({
                      id: "geocoded",
                      type: "circle",
                      source: "geocoded",
                      paint: {
                        "circle-color": "#8931e0",
                      },
                    });
                    dispatch("computeElbeDateRange");
                    dispatch("layers/addGeoparsingLayer", "elbe", {
                      root: true,
                    });
                  });
                }
              });
        },
        computeElbeDateRange({state}){
            let dateArray = []
            for (let i=0; i<state.elbeData.features.length; i++){
                dateArray.push(state.elbeData.features[i].properties.date)
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
            else if (state.datasetMode=='newspaper'){
                points = state.newspaperData
            }
            else {
                points = state.elbeData
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
                    visible: true,
                    radius: 1000,
                    elevationScale: 10,
                    extruded: false,
                    coverage: 1,
                    upperPercentile: 100,
                    autoHighlight: true,
                    elevationRange: [0, 3000],
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
                    visible: true,
                    radius: 1000,
                    elevationScale: 10,
                    extruded: true,
                    coverage: 1,
                    upperPercentile: 100,
                    autoHighlight: true,
                    elevationRange: [0, 3000],
                    getColor: [255, 0, 0]
                });
                rootState.map.map.addLayer(myDeckLayer);
            }
        
        },
        clusterpopup({state, rootState, dispatch}, e){
            let clusterRadius = 55;
            let clickedMouseCoordinate = e.lngLat
            var cluster = rootState.map.map.queryRenderedFeatures(e.point, { layers: ["stylelayer"] });
            let clusterDataset
            if (state.datasetMode == 'parliament') {
                clusterDataset = state.geocodedData
            }
            else if(state.datasetMode == 'newspaper') {
                clusterDataset = state.newspaperData
            }
            else {
                clusterDataset = state.elbeData
            }
			if (cluster[0]) {
                var pointsInCluster = clusterDataset.features.filter(function(f){
                    var pointPixels = rootState.map.map.project(f.geometry.coordinates)
                    var pixelDistance = Math.sqrt(
                        Math.pow(e.point.x - pointPixels.x, 2) + 
                        Math.pow(e.point.y - pointPixels.y, 2) 
                    )
                    return Math.abs(pixelDistance) <= clusterRadius
                })
                if (state.datasetMode == 'parliament') {
                    dispatch('parliamentPopup', {features: pointsInCluster, clusterCenterCoordinate: clickedMouseCoordinate})
                }
                else if (state.datasetMode == 'newspaper') {
                    dispatch('newspaperPopup', {features: pointsInCluster, clusterCenterCoordinate: clickedMouseCoordinate})
                }
                else if (state.datasetMode == 'elbe') {
                    dispatch('elbePopup', {features: pointsInCluster, clusterCenterCoordinate: clickedMouseCoordinate})
                }
                
        
            }
        },
        newspaperPopup({state, rootState, dispatch}, e){
            state.wordFrequency = []
            let coordinates
            if (e.features.length==1){
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                let clickedPointDate = e.features[0].properties.date
                HTTP
                .post('get-word-frequency',{
                    date: clickedPointDate
                })
                .then(response => {
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                    }
                })

                let pdflink = e.features[0].properties.url
                let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
                state.newspaperMailLink= matches[0]

                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)

                if (e.features[0].properties['url']){
                    delete e.features[0].properties['url']
                }
                
                popup.setDOMContent(createHtmlAttributesNewspaperDataset(rootState,dispatch, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency))
                
                popup.addTo(rootState.map.map);
            
            }
            else{
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]

                let list = e.features
                state.duplicatedNewspaperData.coordiates=coordinates
                state.duplicatedNewspaperData.list=list

                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                popup.setDOMContent(createDuplicatePointAttributesNewspaper(rootState,dispatch, popup, list))
                
                popup.addTo(rootState.map.map);
            
            }
        },
        backtoDuplicatedListNewspaper({state, rootState, dispatch}){
            let coordinates = state.duplicatedNewspaperData.coordiates

            let list = state.duplicatedNewspaperData.list
            
            let popup = new maplibregl.Popup()
            popup.setLngLat(coordinates)
            popup.setDOMContent(createDuplicatePointAttributesNewspaper(rootState,dispatch, popup, list))
            
            popup.addTo(rootState.map.map);
            
        },
        addSelectedDuplicatePointNewspaper({state, rootState, dispatch}, payload){

            state.duplicatedNewspaper = true
            var selectedfeature = payload.list.filter(a => a.properties.id == payload.id);
            let clickedPointDate = selectedfeature[0].properties.date
            HTTP
            .post('get-word-frequency',{
                date: clickedPointDate
            })
            .then(response => {
                for (let i in response.data) {
                    rootState.geoparsing.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                }
            })

            let pdflink = selectedfeature[0].properties.url
            let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
            state.newspaperMailLink= matches[0]

            let popup = new maplibregl.Popup()
            popup.setLngLat([selectedfeature[0].properties.lon, selectedfeature[0].properties.lat])
            popup.setDOMContent(createHtmlAttributesNewspaperDataset(rootState,dispatch, selectedfeature[0].properties.lon, selectedfeature[0].properties.lat, selectedfeature[0].properties, rootState.geoparsing.wordFrequency, state.duplicatedNewspaper, popup))          
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
                popup.setDOMContent(createHtmlAttributesParliamentDataset(rootState, dispatch, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency, state.duplicatedParliament, popup))
                
                popup.addTo(rootState.map.map);

            }
            else{
                if (e.clusterCenterCoordinate){
                    coordinates = [e.clusterCenterCoordinate.lng, e.clusterCenterCoordinate.lat]
                }
                else {
                    coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                }

                let list = e.features
                state.duplicatedParliamentData.coordiates=coordinates
                state.duplicatedParliamentData.list=list
                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                popup.setDOMContent(createDuplicatePointAttributesParliament(rootState,dispatch, popup, list))
                
                popup.addTo(rootState.map.map);
            
            }
            
        },
        backtoDuplicatedListParliament({state, rootState, dispatch}){
            let coordinates = state.duplicatedParliamentData.coordiates

            let list = state.duplicatedParliamentData.list
            
            let popup = new maplibregl.Popup()
            popup.setLngLat(coordinates)
            popup.setDOMContent(createDuplicatePointAttributesParliament(rootState,dispatch, popup, list))
            
            popup.addTo(rootState.map.map);
            
        },
        addSelectedDuplicatePointParliament({state,rootState, dispatch}, payload){
            state.duplicatedParliament = true
            var selectedfeature = payload.list.filter(a => a.properties.id == payload.id);
            state.wordFrequency = []
            let clickedDocNum = selectedfeature[0].properties.doc_num
            HTTP
                .post('get-word-frequency-parliament',{
                    docNum: clickedDocNum
                })
                .then((response)=>{
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                }
            })
            let pdflink = selectedfeature[0].properties.hyperlink
            let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
            state.parliamentPdfLink= matches[0]

            let popup = new maplibregl.Popup()
            popup.setLngLat([selectedfeature[0].properties.lon, selectedfeature[0].properties.lat])
            popup.setDOMContent(createHtmlAttributesParliamentDataset(rootState, dispatch, selectedfeature[0].properties.lon, selectedfeature[0].properties.lat, selectedfeature[0].properties, rootState.geoparsing.wordFrequency, state.duplicatedParliament, popup))
            
            popup.addTo(rootState.map.map);
        },
        elbePopup({state, rootState, dispatch}, e){
            state.wordFrequency = []
            let coordinates 
            if (e.features.length==1){
                coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                let clickedDocNum = e.features[0].properties.row_num
                HTTP
                .post('get-word-frequency-elbe',{
                    docNum: clickedDocNum
                })
                .then((response)=>{
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                    }
                }).catch(()=>{
                    dispatch('alert/openCloseAlarm', {text: "The selected point has no wordcloud!", background: "#FFD700"}, { root:true })
                })

                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                delete e.features[0].properties['hyperlink'];
                popup.setDOMContent(createHtmlAttributesElbeDataset(rootState, dispatch, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency, state.duplicatedElbe, popup))
                
                popup.addTo(rootState.map.map);

            }
            else{
                if (e.clusterCenterCoordinate){
                    coordinates = [e.clusterCenterCoordinate.lng, e.clusterCenterCoordinate.lat]
                }
                else {
                    coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                }

                let list = e.features
                state.duplicatedElbeData.coordiates=coordinates
                state.duplicatedElbeData.list=list
                let popup = new maplibregl.Popup()
                popup.setLngLat(coordinates)
                popup.setDOMContent(createDuplicatePointAttributesElbe(rootState,dispatch, popup, list))
                
                popup.addTo(rootState.map.map);
            
            }
            
        },
        backtoDuplicatedListElbe({state, rootState, dispatch}){
            let coordinates = state.duplicatedElbeData.coordiates

            let list = state.duplicatedElbeData.list
            
            let popup = new maplibregl.Popup()
            popup.setLngLat(coordinates)
            popup.setDOMContent(createDuplicatePointAttributesElbe(rootState,dispatch, popup, list))
            
            popup.addTo(rootState.map.map);
            
        },
        addSelectedDuplicatePointElbe({state,rootState, dispatch}, payload){
            state.duplicatedElbe = true
            var selectedfeature = payload.list.filter(a => a.properties.id == payload.id);
            state.wordFrequency = []
            let clickedDocNum = selectedfeature[0].properties.row_num
            console.info('selectedFEature: ',selectedfeature)
            console.info('clickedDocNum: ',clickedDocNum)
            HTTP
                .post('get-word-frequency-elbe',{
                    row_num: clickedDocNum
                })
                .then((response)=>{
                    for (let i in response.data) {
                        state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                }}).catch(()=>{
                    dispatch('alert/openCloseAlarm', {text: "The selected point has no wordcloud!", background: "#FFD700"}, { root:true })
                })

            let popup = new maplibregl.Popup()
            popup.setLngLat([selectedfeature[0].properties.lon, selectedfeature[0].properties.lat])
            popup.setDOMContent(createHtmlAttributesElbeDataset(rootState, dispatch, selectedfeature[0].properties.lon, selectedfeature[0].properties.lat, selectedfeature[0].properties, rootState.geoparsing.wordFrequency, state.duplicatedElbe, popup))
            
            popup.addTo(rootState.map.map);
        },
        dateFilter({state, rootState, dispatch}){
            HTTP
            .post('geoparsing-date-filter',{
                dates: state.dates,
                datasetMode: state.datasetMode
            })
            .then(response=>{
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
                else if (state.datasetMode=='elbe'){
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
                topics: state.topics.map(topic => topic.toLowerCase()),
                topicQueryMode: state.selectedTopicQueryMode
            })
            .then((response)=>{
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
        },
        elbeTopicFilter({state, rootState, dispatch}){
            HTTP
            .post('elbe-topic-filter',{
                topics: state.elbeTopics.map(topic => topic.toLowerCase()),
                topicQueryMode: state.elbeSelectedTopicQueryMode
            })
            .then((response)=>{
                if (response.data.features!=null){
                    dispatch('removeStyles')
                    state.elbeData = response.data
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
        },
        hideGeoparsingLayer({state,rootState,rootGetters,commit},id){
            const mapLayer = rootState.map.map.getLayer('geocoded')
            const geoparsingLayer = rootGetters['layers/getGeocodedLayerName']
            if (mapLayer != 'undefined' && id != 'geoparsing' && geoparsingLayer.length 
                && geoparsingLayer[0].checked == true) {
                    rootState.map.map.setLayoutProperty("geocoded", 'visibility', 'none')
                    commit('layers/handleCheckboxStatus',{tableName:state.datasetMode,isChecked:false},{root:true})
            }   
        }
    },
    getters:{
        datasetMode(state){
            return state.datasetMode
        }
    }

}
export default geoparsing