<template>
<div >
    <v-card v-if="$store.state.map.basemapOptionsToggle" class="basemap-options">
        <v-radio-group
            v-model="$store.state.map.activatedStyle"
            mandatory
            dense
            @change="toggleBasemap"
        >
            <v-radio
                :label="$t('basemap.osm')"
                value="lightOSM"
            ></v-radio>
            <v-radio
                :label="$t('basemap.satellite')"
                value="satellieHybrid"
            ></v-radio>
            <v-radio
                :label="$t('basemap.dark')"
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
        toggleBasemap() {
            this.$store.dispatch('map/toggleBasemap')
        }
    }
}
</script>

<style scoped>
.basemap {
    position: absolute;
    right: 10px;
    top: 175px;
    z-index: 999;
}

.basemap .v-btn {
    margin-top: 10px;
    min-width: 20px;
    min-height: 25px;
    width: 29px;
    height: 29px;
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
    top: 88px;
    z-index: 2;
    background-color: white;
    padding-left: 10px;
    padding-right: 10px
}


</style>