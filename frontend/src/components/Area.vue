<template>
    <div v-if="$store.state.ligfinder.FOI.features[0]">
        <v-subheader>Grundstücksfläche in m²</v-subheader>
        <v-card-text>
            <v-row>
                <v-col class="px-4">
                    <v-range-slider
                    v-model="$store.state.area.areaRange"
                    :max="4073828"
                    :min="0"
                    hide-details
                    class="align-center"
                    >
                    <template v-slot:prepend>
                        <v-text-field
                        :value="$store.state.area.areaRange[0]"
                        @change="$set($store.state.area.areaRange, 0, $event)"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="font-size: 0.8vw; width: 5vw"
                        ></v-text-field>
                    </template>
                    <template v-slot:append>
                        <v-text-field
                        :value="$store.state.area.areaRange[1]"
                        @change="$set($store.state.area.areaRange, 1, $event)"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="font-size: 0.8vw; width: 5vw"
                        ></v-text-field>
                    </template>
                    </v-range-slider>
                </v-col>
            </v-row>
        </v-card-text>

        <v-subheader>Vorhandene Bruttogeschossfläche in m² </v-subheader>
        <v-card-text>
            <v-row>
                <v-col class="px-4">
                    <v-range-slider
                    v-model="$store.state.area.grossFloorAreaRange"
                    :max="4073828"
                    :min="0"
                    hide-details
                    class="align-center"
                    >
                    <template v-slot:prepend>
                        <v-text-field
                        :value="$store.state.area.grossFloorAreaRange[0]"
                        @change="$set($store.state.area.grossFloorAreaRange, 0, $event)"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="font-size: 0.8vw; width: 5vw"
                        ></v-text-field>
                    </template>
                    <template v-slot:append>
                        <v-text-field
                        :value="$store.state.area.grossFloorAreaRange[1]"
                        @change="$set($store.state.area.grossFloorAreaRange, 1, $event)"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="font-size: 0.8vw; width: 5vw"
                        ></v-text-field>
                    </template>
                    </v-range-slider>
                </v-col>
            </v-row>
        </v-card-text>

        <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-success" @click="areaFilter">Suche Starten</button>
        </div>
            
        </div>
    <div v-else class="table text-center">
        <p>No Feature Selected</p>
    
    </div>
</template>

<script>
//import $ from 'jquery'
export default {
    name: "Area",
    data() {
        return {
            areaRange: [1, 9],
            landAreaMin: 0,
            landAreaMax: 100
        }
    },
    components: {
    },
    created() {
        
    },
    mounted: function (){
   
    },
    methods:{
        areaFilter(){
           this.$store.dispatch("area/areaFilter")
       }
    }
}
</script>

<style scoped>

.form-range{
    width:80%
}
.rr {
  display: inline-block;
}




</style>