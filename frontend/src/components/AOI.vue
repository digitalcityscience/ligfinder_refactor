<template>
    <div>
        <select @change="test($event.target.value)"  v-model="$store.state.AOI.selected" name="aoi" style="width:80%; margin-left: auto; margin-right: auto" class="form-select form-control">
            <option value="default" disabled selected hidden>Bitte Bereichssuchmethode auswählen</option>
            <option value="administrative" >Verwaltungsgebiet</option>
            <option value="geometry">Geometrie</option>
            <option value="isochrone">Umkreis/Isochrone</option>  
        </select>
        <AdministrativeAOI v-if="$store.state.AOI.selected==='administrative'" />
        <GeometryAOI v-if="$store.state.AOI.selected==='geometry'" />
        <IsochroneAOI v-if="$store.state.AOI.selected==='isochrone'" />
        <v-switch
            v-if="$store.state.AOI.selected !=='default'"
            v-model="$store.state.AOI.buildingSwitch"
            @click.once="getBuildings"
            :label="`Gebäude: ${$store.state.AOI.buildingSwitch.toString()}`"
        ></v-switch>
    </div>
</template>

<script>
import AdministrativeAOI from "./AdministrativeAOI"
import GeometryAOI from "./GeometryAOI"
import IsochroneAOI from "./IsochroneAOI"
export default {
    name: "AOI",
    components: {
        AdministrativeAOI,
        GeometryAOI,
        IsochroneAOI
    },
    data(){
        return{
            selected : "default",
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
        getBuildings(){
            this.$store.dispatch("ligfinder/getBuildings")
        }
    }
}
</script>

<style scoped>

</style>