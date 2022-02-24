<template>
    <div  class="geometry-select">
        <div style="width:60%; margin-top: 5%">
            
            <v-select
                :items="$store.state.geometryAOI.items"
                label="Drawing Mode"
                solo
                item-text="name"
                item-value="value"
                
                v-model="$store.state.geometryAOI.selectMode"
                @change="getGeomArea"
            ></v-select>
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getSelectedFeatures" :disabled="$store.state.geometryAOI.AOI==null">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="resetSelectedFeatures()" :disabled="$store.state.ligfinder.FOI.features.length==0">Filter Zurücksetzen </button>
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
            this.$store.dispatch("geometryAOI/getGeomArea", event)
       },
       getSelectedFeatures(){
           this.$store.dispatch("geometryAOI/getSelectedFeatures")
       },
       resetSelectedFeatures(){
            this.$store.dispatch("geometryAOI/resetSelectedLayers")
        },
    }
}
</script>

<style scoped>
    
</style>