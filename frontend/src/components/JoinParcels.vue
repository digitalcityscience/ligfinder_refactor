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
        <div v-if="$store.state.joinParcels.toggleSwitch">
            <v-data-table
            :headers="headers"
            :items="$store.state.joinParcels.tableData"
            :disable-filtering="true"
            :disable-sort="true"
            :items-per-page="10"
            @click:row="zoomToSelectedFeature"
        ></v-data-table>
        <v-divider></v-divider>

        </div>
        
        

    </div>

</template>

<script>
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import * as turf from 'turf'

export default {
    data() {
        return {
            headers: [{text:"ids",value:"ids"},{text:"area",value:"area"}],
        }
    },
    mounted(){
        
    },
    methods: {
        getTouchedParcels(){
            this.$store.dispatch('joinParcels/getTouchedParcels')
        },
        toggleJoinParcelVisibility(){
            this.$store.dispatch('joinParcels/toggleJoinParcelVisibility')
            //this.$store.map.map.setLayoutProperty()
        },
        zoomToSelectedFeature(row){
            console.log(row)
            let bounds = turf.bbox(row.data.geometry);
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