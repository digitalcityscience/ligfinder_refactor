<template>
    <v-card  class="isochrone-select">
        <v-card-subtitle class="text-capitalize">{{ $t('ligfinder.aoi.isochrone.mode') }}</v-card-subtitle>
        <v-card-text>
                    <v-btn-toggle
                    v-model="mode"
                    tile
                    group
                >
                    <v-btn outlined value="walk_network" >
                        <v-icon
                            color="primary"
                        >
                            mdi-walk
                        </v-icon>
                    </v-btn>
                    <v-btn value="bike_network">
                    <v-icon
                            color="primary"
                        >
                            mdi-bike
                        </v-icon>
                    </v-btn>
                    <v-btn value="drive_network">
                    <v-icon
                            color="primary"
                        >
                            mdi-car
                        </v-icon>
                    </v-btn>
                </v-btn-toggle>
                <div class="isochrone-setting mt-4">
                <p class="text-capitalize">{{ $t('ligfinder.aoi.isochrone.center') }}</p>
                <v-btn id="draw-point" @click="showPointDraw"
                    icon
                >
                    <v-icon
                            color="primary"
                        >
                            mdi-map-marker-radius
                        </v-icon>
                </v-btn>
                <p class="text-capitalize mt-4">{{ $t('ligfinder.aoi.isochrone.travelTime') }}</p>
                <v-text-field
                    type="number"
                    v-model="time"
                    id="time"
                    name="time"
                    :suffix="$t('ligfinder.aoi.isochrone.min')"
                    prepend-icon="mdi-clock-outline"
                    solo
                ></v-text-field>
                <div class="d-flex flex-column">
                    <v-btn color="primary" light class="mt-3 flex-grow-lg-1 align-self-lg-auto align-self-xl-start" @click="getIsochrone()" :disabled="mode==null || time==null || $store.state.isochroneAOI.center==null">{{ $t('ligfinder.aoi.isochrone.get') }}</v-btn>
                </div>
            </div>
            
            
            
        </v-card-text>
        <v-card-actions class="d-flex flex-wrap justify-space-around">
            <v-btn
                dark
                class="m-1 flex-grow-1"
                color="green"
                @click="addToAOIList"
                :disabled="$store.state.isochroneAOI.AOI==null"
            >
            {{$t('ligfinder.aoi.isochrone.add2List')}}
            </v-btn>
            <v-btn
                dark
                class="m-1 flex-grow-1"
                color="red"
                @click="deleteIsochroneAOI"
                :disabled="$store.state.isochroneAOI.AOI==null"
            >
            {{$t('ligfinder.aoi.isochrone.rmSelection')}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "IsochroneAOI",
    data(){
        return {
            time: null,
            mode: null
        }
    },
    methods: {
        showPointDraw(){
              this.$store.dispatch('isochroneAOI/showPointDraw');
              //const button = document.getElementById('draw-point')
              //button.disabled = true
        },
        getIsochrone(){
            this.$store.dispatch('isochroneAOI/getIsochrone', {time: this.time, center: this.$store.state.isochroneAOI.center, mode: this.mode });
        },
        getParcels(){
            this.$store.dispatch('isochroneAOI/getParcels', {time: this.time, center: this.$store.state.isochroneAOI.center, mode: this.mode });
            const button = document.getElementById('draw-point')
            button.disabled = false
        },
        reset(){
            this.$store.dispatch('isochroneAOI/reset')
            
        },
        addToAOIList(){
            this.$store.dispatch("AOI/addIsochroneAreaToAOIList")
        },
        deleteIsochroneAOI(){
            this.$store.dispatch("isochroneAOI/deleteIsochroneAOI")
        }
    }
}
</script>

<style scoped>

</style>