import axios from "axios"
import maplibregl from 'maplibre-gl'
import {MapboxLayer} from '@deck.gl/mapbox';
//import {Deck} from '@deck.gl/core';
import {PolygonLayer} from '@deck.gl/layers';
const ligfinder = {
    namespaced: true,
    state:{
        toggle: false,
        
        FOI: {'features':[]},
        FOIGid: []
    },
    mutations:{
        setLigfinderToggle(state){
            state.toggle=!state.toggle;
        },
        
    },
    actions:{
        getBuildings({rootState, state}){
            let parcelGid = []

            for(let i =0; i< state.FOI.features.length; i++){
                parcelGid.push(state.FOI.features[i].properties.gid)
              }
            axios
            .post('http://localhost:3000/get-buildings', {
                foi: parcelGid
            })
            .then(response => {
                
                /*rootState.map.map.addSource(("buildings"),{'type': 'geojson', 'data': response.data});
                let layerName = {
                    'id': "buildings",
                    'type': 'fill',
                    'source': "buildings", // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': '#FF0000', 
                        'fill-opacity':0.2,
                        
                    }
                    
                };
                
                // to remove the AOI Layer (area of interest)
                rootState.map.map.addLayer(layerName)*/


                
                
                var start = [9.950503, 53.556423];
                var startAltitude = 0;
                var startCoordinate = maplibregl.MercatorCoordinate.fromLngLat(start, startAltitude);
                var end = [10.144143, 53.632594];
                var endAltitude = 0;
                var endCoordinate = maplibregl.MercatorCoordinate.fromLngLat(end, endAltitude);
                var THREE = window.THREE;
                var material = new THREE.LineBasicMaterial({ color: 0xFF0000});
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(startCoordinate.x, startCoordinate.y, startCoordinate.z));
                geometry.vertices.push(new THREE.Vector3(endCoordinate.x, endCoordinate.y, endCoordinate.z));

                var line = new THREE.Line(geometry, material);
                console.log(line)
                // configuration of the custom layer for a 3D model per the CustomLayerInterface
                var customLayer = {
                    id: "3d-model",
                    type: "custom",
                    renderingMode: "3d",
                    onAdd: function(map, gl) {
                        this.camera = new THREE.Camera();
                        this.scene = new THREE.Scene();

                        // create two three.js lights to illuminate the model
                        var directionalLight = new THREE.DirectionalLight(0xffffff);
                        directionalLight.position.set(0, -70, 100).normalize();
                        this.scene.add(directionalLight);

                        var directionalLight2 = new THREE.DirectionalLight(0xffffff);
                        directionalLight2.position.set(0, 70, 100).normalize();
                        this.scene.add(directionalLight2);

                        this.scene.add(line);
                        
                        this.map = map;

                        // use the Mapbox GL JS map canvas for three.js
                        this.renderer = new THREE.WebGLRenderer({
                        canvas: map.getCanvas(),
                        context: gl,
                        antialias: true
                        });

                        this.renderer.autoClear = false;
                        
                    },
                    render: function(gl, matrix) {
                        var m = new THREE.Matrix4().fromArray(matrix);
                        this.camera.projectionMatrix = m;
                        this.renderer.state.reset();
                        this.renderer.render(this.scene, this.camera);
                        this.map.triggerRepaint();
                    }
                };
                rootState.map.map.addLayer(customLayer);
                
                /*const polygonsData = [
                    {
                      coords: [
                       
                          [9.998177, 53.553836,30],
                          [9.998835, 53.553454, 30],
                          [9.997323, 53.552530,30],
                          [9.996665, 53.552905, 30],
                          [9.998177, 53.553836,30]
                      ]
                    },
                    
                ];*/
                console.log(response.data.features)
                const getOpecity = function(value){
                    if(value<50){
                        return 30
                    }
                    else if (value >=50 && value <=100){
                        return 70
                    }
                    else {
                        return 255
                    }
                }
                const myDeckLayer = new MapboxLayer({
                    id: 'hexagon2DD',
                    type: PolygonLayer,
                    data: response.data.features,
                    _normalize: true,
                    //pickable: true,
                    stroked: true,
                    getPolygon: d => d.properties.geom3d.coordinates[0],
                    getFillColor: d => [0, 0, 255, getOpecity(d.properties.area_clip)],
                    highlightColor: [255, 0, 0],
                    getLineColor:  [0, 0, 0, 255],
                    getLineWidth: 1,
                    filled: true,
                    //extruded: true,
                    //getElevation: 30,
                    //lineWidthMinPixels: 2,
                    //lineWidthMaxPixels: 2,
                    //lineWidthScale: 1,
                    lineWidthUnits: "pixels",
                });
                const ExtrudedBuilding = new MapboxLayer({
                    id: 'hexagon2DDD',
                    type: PolygonLayer,
                    data: response.data.features,
                    _normalize: true,
                    //pickable: true,
                    stroked: true,
                    wireframe: true,
                    lineWidthMinPixels: 1,
                    getPolygon: d => d.geometry.coordinates[0],
                    getFillColor: [0, 255, 0],
                    highlightColor: [255, 0, 0, 255],
                    getLineColor: [80, 80, 80],
                    getLineWidth: 1,
                    filled: true,
                    extruded: true,
                    getElevation: 29,
                    //lineWidthMinPixels: 2,
                    //lineWidthMaxPixels: 2,
                    //lineWidthScale: 1,
                    lineWidthUnits: "pixels",
                });
                  rootState.map.map.addLayer(myDeckLayer);
                  rootState.map.map.addLayer(ExtrudedBuilding);
 
                
                
            })
           
            
        }
    },
    getters:{

    }

}
export default ligfinder