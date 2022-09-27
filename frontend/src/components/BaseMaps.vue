<template>
<div >
    <div class="basemap">
        <v-btn v-ripple="{ class: 'primary--text' }" @click="toglleBasemapOptionsPanel">
            <v-icon color="primary">mdi-map-check-outline</v-icon>
        </v-btn>
    </div>
    
    <v-card v-if="$store.state.map.basemapOptionsToggle" class="basemap-options">
    
        <v-radio-group
            v-model="$store.state.map.activatedStyle"
            mandatory
            dense
            @change="toglleBasemap"
        >
            <v-radio
                label="OSM"
                value="lightOSM"
            ></v-radio>
            <v-radio
                label="Satellite"
                value="satellieHybrid"
            ></v-radio>
            <v-radio
                label="Dark"
                value="dark"
            ></v-radio>
        </v-radio-group>
    </v-card>
</div>
</template>

<script>
export default {
    name: 'BaseMaps',
    methods:{
        toglleBasemap() {
            this.$store.dispatch('map/toglleBasemap')
        },
        toglleBasemapOptionsPanel(){
            this.$store.commit('map/toglleBasemapOptionsPanel')
        }
    }
}
</script>

<style scoped>
.basemap {
    position: absolute;
    right: 10px;
    top: 100px;
    z-index: 999;
}

.basemap .v-btn {
    margin-top: 5px;
    min-width: 20px;
    min-height: 25px;
    width: 25px;
    height: 25px;
}
/* removes grey hover effect */
.basemap .v-btn::before{
    background-color: transparent;
}

/* adds icon scale hover effect */
.basemap .v-btn i:hover{
  transform: scale(1.1);
}

.basemap-options{
    position: absolute;
    right: 50px;
    top: 105px;
    z-index: 999;
    background-color: white;
    padding-left: 10px;
    padding-right: 10px
}


</style>