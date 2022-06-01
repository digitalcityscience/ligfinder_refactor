import { HTTP } from '../../utils/http-common';
import maplibregl from 'maplibre-gl'
const geocoder = {
    namespaced: true,
    state:{
       
    },
    mutations:{
       
    },
    actions:{
        geocodeAddress({state, rootState, dispatch}, payload){
            console.log(state, payload)
            HTTP
            .post('geocode-address', {
                address : payload
            })
            .then(response=>{
                
                if (response.data.status=="success"){
                    const mapLayer = rootState.map.map.getLayer('address');
                    if(typeof mapLayer !== 'undefined'){
                        rootState.map.map.removeImage('custom-marker')
                        rootState.map.map.removeLayer('address')
                        rootState.map.map.removeSource('address')
                        
                    }
                
                    rootState.map.map.loadImage(
                        require('../../assets/marker.png'),
                        (error, image) => {
                        if (error) throw error;
                        
                        rootState.map.map.addImage('custom-marker', image);
                        
                        // Add a GeoJSON source with 2 points
                        rootState.map.map.addSource('address', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': 
                                [
                                    {
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': response.data.location
                                        },
                                        'properties': {
                                            'address': response.data.address
                                        }
                                    },
                        
                                ]
                            }
                        });
                        
                        rootState.map.map.addLayer({
                            'id': 'address',
                            'type': 'symbol',
                            'source': 'address',
                            'layout': {
                                'icon-image': 'custom-marker',
                            }
                        });
                    });

                    rootState.map.map.flyTo({
                        center: response.data.location,
                        zoom: 16,
                        bearing: 0,
                        speed: 0.8,
                        curve: 1,
                        essential: true 
                    })

                    rootState.map.map.on('click', 'address', (e) => {
                        let address = e.features[0].properties.address
                        const coordinates = [e.lngLat.lng, e.lngLat.lat]
                        let popup = new maplibregl.Popup()
                        popup.setLngLat(coordinates)
                        .setHTML(`<p1>${address}</p1>`)
                        
                        popup.addTo(rootState.map.map);
                    })
                }
                else{
                    console.log(response.data)
                    dispatch('alert/openCloseAlarm', {text: response.data.text, background: "#FFD700"}, { root:true })
                }
                
            })

        },
        clearGeocodedAddress({rootState}){
            const mapLayer = rootState.map.map.getLayer('address');
            if(typeof mapLayer !== 'undefined'){
                rootState.map.map.removeImage('custom-marker')
                rootState.map.map.removeLayer('address')
                rootState.map.map.removeSource('address')
                
            }
        }
    },
    getters:{
       
    }

}
export default geocoder