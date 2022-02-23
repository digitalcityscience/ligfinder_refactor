<template>
    <div  class="isochrone-select">
        <div style="width:60%; margin-top: 10%">
            <label for="">Reisemethode</label>
            <select name="geometry" class="form-select form-control" v-model="mode" >
                <option value="" disabled selected hidden>Bitte Reisemethode auswählen</option>
                <option value="walk_network" >gehen </option>
                <option value="bike_network" >Radfahren</option>
                <option value="drive_network" >Fahren</option>
        
            </select>
            <div class="isochrone-setting mt-4">
                <button @click="showPointDraw" class="btn btn-secondary" id="draw-point"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> &nbsp; Mitte auswählen</button>
                <span v-if="$store.state.isochroneAOI.center.coordinates!==''" class="text-success mx-3">
                    
                    lng: {{($store.state.isochroneAOI.center.coordinates[0]).toFixed(4)}} &nbsp;
                    lat: {{($store.state.isochroneAOI.center.coordinates[1]).toFixed(4)}}
                </span>
                <div class="input-group mt-3">
                    <span class="input-group-text"><i class="far fa-clock"></i></span>
                    <input type="text" id="time" name="time" v-model="time" class="form-control" aria-label="Amount (to the nearest dollar)">
                    <span class="input-group-text">min.</span>
                </div>
                <button style="font-size: 0.8vw" class="btn btn-info mt-3" @click="getIsochrone()">Isochrone bekommen</button>
            </div>
            
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getParcels()">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="reset()" :disabled="$store.state.ligfinder.FOI.features.length==0">Filter Zurücksetzen </button>
            </div>
            
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
              const button = document.getElementById('draw-point')
              button.disabled = true
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
            
        }
    }
}
</script>

<style scoped>

</style>