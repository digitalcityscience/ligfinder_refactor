<template>
    <div  class="administrative-select">
        <div style="width:60%; margin-top: 10%">
            <label for="">Verwaltungsebene</label>
            <select @change="getAdminArea($event); resetSelectedFeatures()"  name="administrative"  class="form-select form-control">
                <option value="" disabled selected hidden>Bitte Verwaltungsebene auswählen</option>
                <option value="bezirke" >Bezirke</option>
                <option value="stadtteile">Stadtteile</option>
                <option value="gemarkungen">GemarKungen</option>  
                <option value="statistischegebiete">Statistische Gebiete</option>  
            </select>
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-success" @click="getSelectedFeatures(); resetAdminLayers()">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-danger mx-3" @click="resetSelectedFeatures()">Filter Zurücksetzen </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdministrativeAOI",
    data(){
        return{
        }
    },
    methods:{
       getAdminArea(event){
            this.$store.dispatch("administrativeAOI/getAdminArea", event.target.value)
       },
       resetSelectedFeatures(){
           this.$store.dispatch("administrativeAOI/resetSelectedLayers")
       },
       getSelectedFeatures(){
           this.$store.dispatch("administrativeAOI/getSelectedFeatures")
       },
       resetAdminLayers(){
           this.$store.dispatch("administrativeAOI/resetAdminLayers")
       }
    }
}
</script>

<style scoped>
    
</style>