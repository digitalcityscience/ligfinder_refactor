<template>
    <v-card  class="geometry-select">
        <v-card-subtitle>
            {{$t('ligfinder.aoi.geometry.title')}}
        </v-card-subtitle>
        <v-card-text>
            <v-select
                :items="$store.state.geometryAOI.items"
                :label="$t('ligfinder.aoi.geometry.mode')"
                solo
                item-text="name"
                item-value="value"
                
                v-model="$store.state.geometryAOI.selectMode"
                @change="getGeomArea"
            ></v-select>
            <div class="d-flex flex-wrap justify-space-around">
                <v-btn
                    dark
                    color="green"
                    @click="addToAOIList"
                    :disabled="$store.state.geometryAOI.AOI == null"
                    class="m-1 flex-grow-1"
                >
                {{ $t('ligfinder.aoi.geometry.add2List') }}
                </v-btn>
                <v-btn
                    class="m-1 flex-grow-1"
                    dark
                    color="red"
                    @click="deleteDrawnGeom"
                    :disabled="$store.state.geometryAOI.AOI == null"
                    
                >
                {{ $t('ligfinder.aoi.geometry.rmSelection') }}
                </v-btn>
            </div>
            
        </v-card-text>
    </v-card>
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