<template>
    <div id="joined-parcels" v-if="$store.state.ligfinder.FOI.features[0]">
        <v-card
            flat
            color="transparent"
        >
            <v-subheader>{{ $t('ligfinder.joinParcels.minAggrArea') }} {{$store.state.joinParcels.slider}} m<sup>2</sup></v-subheader>

            <v-card-text>
            <v-row>
                <v-col class="pr-4">
                <v-slider
                    v-model="$store.state.joinParcels.slider"
                    class="align-center"
                    :max="$store.state.joinParcels.max"
                    :min="$store.state.joinParcels.min"
                    hide-details
                >
                    <template v-slot:append>
                    <v-text-field
                        v-model="$store.state.joinParcels.slider"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                    ></v-text-field>
                    </template>
                </v-slider>
                
                <v-btn light color="primary" class="m-2 mt-4" @click="getTouchedParcels" >{{ $t('ligfinder.joinParcels.search') }}</v-btn>
                <v-switch
                    v-if="$store.state.joinParcels.toggleSwitch"
                    v-model="$store.state.joinParcels.layerVisibility"
                    @click="toggleJoinParcelVisibility"
                    :label="$t('ligfinder.joinParcels.toggleVis')"
                ></v-switch>
                    
                </v-col>
            </v-row>
            </v-card-text>
            
        </v-card>
        <div :style="{marginBottom:'40px'}"   v-if="$store.state.joinParcels.toggleSwitch">
            <table id="datatable" class="table table-hover" v-if="$store.state.joinParcels.touchingParcels">
                <thead >
                    <tr >
                        <th >{{ $t('ligfinder.joinParcels.ids') }}</th>
                        <th >{{ $t('ligfinder.joinParcels.area') }}</th>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr v-for="i in $store.state.joinParcels.touchingParcels.features" :key="i.properties.ids[0]" @click="zoomToSelectedFeature(i)">
                        <td>
                            {{i.properties.ids}}
                        </td>
                        <td>
                            {{parseFloat(i.properties.area).toFixed(2)}} m<sup>2</sup>
                            
                        </td>
                        
                    </tr>
                    
                    
                </tbody>
            </table>
        </div>
        
        

    </div>
    <div v-else class="table text-center">
        <p>{{ $t('ligfinder.joinParcels.noFeature') }}</p>
    
    </div>

</template>

<script>
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 
import * as turf from 'turf'

export default {
    mounted(){
        $.extend( $.fn.dataTable.defaults, {
            searching: false,
        });
        $('#datatable').DataTable({
            "ordering": false,
            "columnDefs": [ {
                "targets": 'no-sort',
                "orderable": false,
                "order": []
            } ]
        });
    },
    methods: {
        getTouchedParcels(){
            this.$store.dispatch('joinParcels/getTouchedParcels')
        },
        toggleJoinParcelVisibility(){
            this.$store.dispatch('joinParcels/toggleJoinParcelVisibility')
            //this.$store.map.map.setLayoutProperty()
        },
        zoomToSelectedFeature(clickedFeature){
            console.log(clickedFeature)
            let bounds = turf.bbox(clickedFeature);
            this.$store.state.map.map.fitBounds(bounds);
        }
    }
  }
</script>

<style scoped>
.table tr {
    cursor: pointer;
}




</style>