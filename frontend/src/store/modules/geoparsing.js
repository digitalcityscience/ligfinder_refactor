import { HTTP } from '../../utils/http-common';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import maplibregl from 'maplibre-gl'
import { createHtmlAttributesParliamentDataset } from '../../utils/createHtmlAttributesParliamentDataset';
import { createHtmlAttributesNewspaperDataset } from '../../utils/createHtmlAttributesNewspaperDataset';

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
        wordFrequency: []
    },
    mutations:{
        setGeoparsingToggle(state){
            state.toggle=!state.toggle;
        },
        
    },
    actions:{
        getGeocodedPoints({state, rootState}){
            if (state.geocodedData == null){
                HTTP
                .get('get-geocoded-points')
                .then(response => {
                    state.geocodedData = response.data
                    rootState.map.map.on('click', 'geocoded', (e) => {
                        if (state.datasetMode == 'parliament'){
                            
                            let pdflink = e.features[0].properties.hyperlink
                            let matches = pdflink.match(/\bhttps?:\/\/\S+/gi);
                            state.parliamentPdfLink= matches[0]
                            const coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                            }
                            let popup = new maplibregl.Popup()
                            popup.setLngLat(coordinates)
                            delete e.features[0].properties['hyperlink'];
                            popup.setDOMContent(createHtmlAttributesParliamentDataset(rootState, coordinates[0], coordinates[1], e.features[0].properties))
                            
                            popup.addTo(rootState.map.map);
                        }            
                    })

                })
            }
        },
        getNewspaperPoints({state, rootState}){
            if (state.newspaperData == null){
                HTTP
                .get('get-geocoded-newspaper-points')
                .then(response => {
                    state.newspaperData = response.data
                    rootState.map.map.on('click', 'geocoded', (e) => {
                        if (state.datasetMode == 'newspaper'){
                            state.wordFrequency = []
                            const coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                            let clickedPointDate = e.features[0].properties.doc_num
                            HTTP
                            .post('get-word-frequency',{
                                date: clickedPointDate
                            })
                            .then(response => {
                                
                                for (let i in response.data) {
                                    state.wordFrequency.push([response.data[i]["word"], response.data[i]["frequency"]])
                                }
                                //state.wordFrequency= response.data
                                console.log(response.data)
                            })
                            
                            let popup = new maplibregl.Popup()
                            popup.setLngLat(coordinates)
                            popup.setDOMContent(createHtmlAttributesNewspaperDataset(rootState, coordinates[0], coordinates[1], e.features[0].properties, state.wordFrequency))
                            
                            popup.addTo(rootState.map.map);
                        }
                    })
                
                })
            }
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
                
        changeStyle({state, rootState}, payload){
            let points =null
            if (state.datasetMode=='parliament'){
                points = state.geocodedData
            }
            else{
                points = state.newspaperData
            }
            if (payload === "Circle"){
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
                const hexagonlayer = rootState.map.map.getLayer('hexagon');
                if(typeof hexagonlayer !== 'undefined'){
                    rootState.map.map.setLayoutProperty('hexagon', 'visibility', 'none');
                }
                const hexagonlayer2D = rootState.map.map.getLayer('hexagon2D');
                if(typeof hexagonlayer2D !== 'undefined'){
                    rootState.map.map.setLayoutProperty('hexagon2D', 'visibility', 'none');
                }
                
                const mapLayer = rootState.map.map.getLayer('geocoded');
                const stylelayer = rootState.map.map.getLayer('stylelayer');
                //const hexagonlayer = rootState.map.map.getLayer('hexagon');
                const clustercount = rootState.map.map.getLayer('clustercount');
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
                const hexagonlayer = rootState.map.map.getLayer('hexagon');
                if(typeof hexagonlayer !== 'undefined'){
                    rootState.map.map.setLayoutProperty('hexagon', 'visibility', 'none');
                }
                const hexagonlayer2D = rootState.map.map.getLayer('hexagon2D');
                if(typeof hexagonlayer2D !== 'undefined'){
                    rootState.map.map.setLayoutProperty('hexagon2D', 'visibility', 'none');
                }
                const mapLayer = rootState.map.map.getLayer('geocoded');
                const stylelayer = rootState.map.map.getLayer('stylelayer');
                
                const clustercount = rootState.map.map.getLayer('clustercount');
                //const hexagonlayer = rootState.map.map.getLayer('hexagon');
                if(typeof mapLayer !== 'undefined'){
                    if(typeof stylelayer !== 'undefined'){
                        rootState.map.map.removeLayer('stylelayer')
                    }
                    if(typeof clustercount !== 'undefined'){
                        rootState.map.map.removeLayer('clustercount')
                    }
                    /*if(typeof hexagonlayer !== 'undefined'){
                        rootState.map.map.removeLayer('hexagon')
                    }*/
                    rootState.map.map.removeLayer('geocoded')
                    rootState.map.map.removeSource('geocoded')
 
                }
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
                    // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
                    // with three steps to implement three types of circles:
                    //   * Blue, 20px circles when point count is less than 100
                    //   * Yellow, 30px circles when point count is between 100 and 750
                    //   * Pink, 40px circles when point count is greater than or equal to 750
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
        
        }
       
    },
    getters:{

    }

}
export default geoparsing