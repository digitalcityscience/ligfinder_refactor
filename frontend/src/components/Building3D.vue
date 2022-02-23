<template>
    <v-switch
        v-if="$store.state.AOI.selected !=='default'"
        v-model="$store.state.AOI.buildingSwitch"
        @click.once="getBuildings"
        @change="toggle3DBuilding"
        :label="`Gebäude: ${$store.state.AOI.buildingSwitch.toString()}`"
    ></v-switch>
</template>

<script>
export default {
    name: 'Building3D',
    methods:{
        getBuildings(){
            this.$store.dispatch("building3D/getBuildings")
        },
        toggle3DBuilding(){
            this.$store.dispatch("building3D/toggle3DBuilding")
        }
    }
}
</script>

<style scoped>

</style>