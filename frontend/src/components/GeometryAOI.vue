<template>
    <div  class="geometry-select">
        <div style="width:60%; margin-top: 10%">
            <label for="">Geometrietyp</label>
            <select name="geometry" class="form-select form-control" @input="getGeomArea($event);">
                <option value="" disabled selected hidden>Bitte Geometrietyp auswählen</option>
                <option value="polygon" >Polygon</option>
         
            </select>
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getSelectedFeatures">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" >Filter Zurücksetzen </button>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: "GeometryAOI",
    data(){
        return{
        }
    },
    methods:{
       getGeomArea(event){
            this.$store.dispatch("geometryAOI/getGeomArea", event.target.value)
       },
       getSelectedFeatures(){
           this.$store.dispatch("geometryAOI/getSelectedFeatures")
       }
    }
}
</script>

<style scoped>
    
</style>