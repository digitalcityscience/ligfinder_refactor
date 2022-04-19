<template>
    <div  class="isochrone-select">
        <div style="width:60%; margin-top: 5%">
           
            <v-select
                :items="$store.state.isochroneAOI.items"
                label="Reisemethode"
                solo
                item-text="name"
                item-value="value"
                v-model="mode"
                
            ></v-select>
            <div class="isochrone-setting mt-4">
                <button @click="showPointDraw" class="btn btn-secondary" id="draw-point"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> &nbsp; Mitte auswählen</button>
                
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