<template>
    <div  class="isochrone-select">
        <div style="width:60%; margin-top: 5%">
           
                <p>Reisemodus</p>
                <v-card>

                
                <v-btn-toggle
                    v-model="mode"
                    tile
                    color="blue accent-3"
                    group
                >
                    <v-btn value="walk_network" >
                        <v-icon
                            large
                            color="blue darken-2"
                            small
                        >
                            mdi-walk
                        </v-icon>
                    </v-btn>

                    <v-btn value="bike_network">
                    <v-icon
                            large
                            color="blue darken-2"
                            small
                        >
                            mdi-bike
                        </v-icon>
                    </v-btn>

                    <v-btn value="drive_network">
                    <v-icon
                            large
                            color="blue darken-2"
                            small
                        >
                            mdi-car
                        </v-icon>
                    </v-btn>

       
                </v-btn-toggle>
                </v-card>
                
                <div class="isochrone-setting mt-4">
                <p>Mitte auswählen</p>
                <v-btn id="draw-point" @click="showPointDraw"
                    icon
                    outlined
                    color="indigo"
                >
                    <v-icon
                            color="blue darken-2"
                            small
                        >
                            mdi-map-marker-radius
                        </v-icon>
                </v-btn>

                <p class=" mt-4">Reisezeit</p>
                <div class="input-group mt-3">
                    <span class="input-group-text"><i class="far fa-clock"></i></span>
                    <input type="text" id="time" name="time" v-model="time" class="form-control" aria-label="Amount (to the nearest dollar)">
                    <span class="input-group-text">min.</span>
                </div>
                <button style="font-size: 0.8vw" class="btn btn-info mt-3" @click="getIsochrone()" :disabled="mode==null || time==null || $store.state.isochroneAOI.center==null">Isochrone bekommen</button>
            </div>
            
            
            <!--<div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getParcels()">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="reset()" :disabled="$store.state.ligfinder.FOI.features.length==0">Filter Zurücksetzen </button>
            </div>-->
            <v-btn
                class="mx-2 mt-3"
                fab
                dark
                x-small
                outlined
                color="green"
                @click="addToAOIList"
                :disabled="$store.state.isochroneAOI.AOI==null"
            >
                <v-icon dark>
                    mdi-plus
                </v-icon>
            </v-btn>
            <v-btn
                class="mx-2 mt-3"
                fab
                dark
                x-small
                outlined
                color="red"
                @click="deleteIsochroneAOI"
                :disabled="$store.state.isochroneAOI.AOI==null"
            >
                <v-icon dark>
                    mdi-minus
                </v-icon>
            </v-btn>
            
        </div>
    </div>
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