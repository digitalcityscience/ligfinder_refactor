<template>
    <div>
        <v-select
          :items="$store.state.AOI.items"
          label="AoI Mode"
          outlined
          item-text="name"
          item-value="value"
          
          v-model="$store.state.AOI.selectMode"
          @change="test"
        ></v-select>
        <AdministrativeAOI v-if="$store.state.AOI.selectMode==='administrative'" />
        <GeometryAOI v-if="$store.state.AOI.selectMode==='geometry'" />
        <IsochroneAOI v-if="$store.state.AOI.selectMode==='isochrone'" />
        <Building3D/>
    </div>
</template>

<script>
import AdministrativeAOI from "./AdministrativeAOI"
import GeometryAOI from "./GeometryAOI"
import IsochroneAOI from "./IsochroneAOI"
import Building3D from "./Building3D"

export default {
    name: "AOI",
    components: {
        AdministrativeAOI,
        GeometryAOI,
        IsochroneAOI,
        Building3D
    },
    data(){
        return{
            buildingSwitch: false,
        }
    },
  
    methods:{
        test(v){
            if (v==="geometry"){
                this.$store.dispatch("administrativeAOI/resetAdminLayers")
            }
            else if (v==="isochrone"){
                this.$store.dispatch("administrativeAOI/resetAdminLayers")
                this.$store.dispatch("geometryAOI/removeDrawControl")
            }
            else if (v==="administrative" ){
                this.$store.dispatch("geometryAOI/removeDrawControl")
            }
        },
    }
}
</script>

<style scoped>

</style>