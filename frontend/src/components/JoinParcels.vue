<template>
    <div id="joined-parcels">
        <v-card
            flat
            color="transparent"
        >
            <v-subheader>Minimum Aggregated Area: {{$store.state.joinParcels.slider}} m<sup>2</sup></v-subheader>

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
                
                <button style="font-size: 0.8vw" class="btn btn-info mt-4" @click="getTouchedParcels" >Suche Starten</button>
                <v-switch
                    v-model="$store.state.joinParcels.layerVisibility"
                    @click="toggleJoinParcelVisibility"
                    label="toggle visibility"
                ></v-switch>
                    
                </v-col>
            </v-row>
            </v-card-text>
            
        </v-card>
        <div :style="{marginBottom:'40px'}"   >
            <table id="datatable" class="table table-hover" v-if="$store.state.joinParcels.touchingParcels">
                <thead >
                    <tr >
                        <th >ids</th>
                        <th >area</th>
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

</template>

<script>
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 
import * as turf from 'turf'

export default {
    data () {
      return {
        min: 0,
        max: 100000,
        slider: 1000,
      }
    },
    mounted(){
        $.extend( $.fn.dataTable.defaults, {
            searching: false,
        } );
        $('#datatable').DataTable({
        "columnDefs": [ {
          "targets": 'no-sort',
          "orderable": false,
          "order": []
    } ]
} );
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