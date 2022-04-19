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
            <!--<div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getSelectedFeatures" :disabled="$store.state.geometryAOI.AOI==null">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="resetSelectedFeatures()" :disabled="$store.state.ligfinder.FOI.features.length==0">Filter Zurücksetzen </button>
            </div>-->
            <v-btn
                class="mx-2 mt-3"
                fab
                dark
                x-small
                outlined
                color="green"
                @click="addToAOIList"
                :disabled="$store.state.geometryAOI.AOI==null"
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
                @click="deleteDrawnGeom"
                :disabled="$store.state.geometryAOI.AOI==null"
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
        addToAOIList(){
            this.$store.dispatch("AOI/addGeomDrawAreaToAOIList")
        },
        removeFromAOIList(){
            this.$store.dispatch("AOI/removeGeomDrawAreaFromAOIList")
        },
        deleteDrawnGeom(){
            this.$store.dispatch("AOI/deleteDrawnGeom")
        }
    }
}
</script>

<style scoped>
    
</style>