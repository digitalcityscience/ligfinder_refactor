<template>
    <div>
        <v-app-bar color="rgba(0, 48, 99,1)" dense dark style="z-index:999;">
            <v-tabs v-model="tab">
                <v-tab center-active dark v-for="tool in tools" :key="tool.id"
                    @click="getid(tool.id); closeOtherPanels(tool.id)">{{ tool.title }}</v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
            <!-- Header right panel begin -->
            <div class="header-right d-flex">
                <v-col class="searchbar">
                    <v-text-field @focus="searchClosed = false" @blur="searchClosed = true" v-model="address"
                        v-on:keyup.enter="geocodeAddress" :placeholder="$t('panel.searchAddr')"
                        prepend-inner-icon="mdi-magnify " class="expanding-search"
                        :class="{ 'closed': searchClosed && !address }" filled dense clearable
                        style="float:right; width: 300px;" @click:clear="clearGeocodedAddress">
                    </v-text-field>
                </v-col>
                <v-col class="translation d-flex">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-translate</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="text-center">
                            <v-list-item-group v-model="locale" mandatory>
                                <v-list-item v-for="(language, index) in languages" :key="index" :value="language.code">
                                    <v-list-item-content>
                                        <v-list-item-title v-text="language.name"></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                </v-col>
                <v-col class="user d-flex">
                    <template>
                        <div class="text-center">
                            <v-menu v-model="userMenu" :close-on-content-click="false" :nudge-width="200" offset-x>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" icon>
                                        <v-icon>mdi-account</v-icon>
                                    </v-btn>
                                </template>

                                <v-card>
                                    <User />
                                </v-card>
                            </v-menu>
                        </div>
                    </template>
                </v-col>
                <!-- Header right panel end -->
            </div>
        </v-app-bar>
    </div>
</template>

<script>
import $i18n from '../plugins/i18n/i18n'
import {getSupportedLocales} from '../plugins/i18n/i18n'
import User from './User'
export default {
    name: "Panel",
    components:{
        User
    },
    data: () => ({
        tab:0,
        userMenu:false,
        drawer: false,
        group: null,
        mini: true,
        tools: [
            { title: $i18n.t('panel.tools.lig'), icon: 'mdi-map-check', id:'ligfinder' },
            { title: $i18n.t('panel.tools.geo'), icon: 'mdi-nfc-search-variant', id:'geoparsing' },
            { title: $i18n.t('panel.tools.clsf'), icon: 'mdi-sort-descending', id:'classification' }
        ],
        panels: ['ligfinder', 'geoparsing', 'classification'],
        searchClosed: true,
        address: null,
        locale:''
    }),
    methods:{
        clearGeocodedAddress(){
            this.$store.dispatch('geocoder/clearGeocodedAddress')
        },
        getid(id){
            const currentTabID =this.tools[this.tab].id
            if (id=="ligfinder" && id != currentTabID){
                this.$store.commit('ligfinder/setLigfinderToggle')
                if (currentTabID == 'geoparsing') {
                    this.$store.dispatch('geoparsing/hideGeoparsingLayer',id)
                }
            }
            else if (id=="geoparsing" && id != currentTabID){
                this.$store.commit('geoparsing/setGeoparsingToggle')
                if (currentTabID == 'ligfinder') {
                    this.$store.dispatch('administrativeAOI/resetAdminLayers',id)
                }
            }
            else if (id=="classification" && id != currentTabID){
                this.$store.commit('classification/setClassificationToggle')
                if (currentTabID == 'geoparsing') {
                    this.$store.dispatch('geoparsing/hideGeoparsingLayer',id)
                }
                if (currentTabID == 'ligfinder') {
                    this.$store.dispatch('administrativeAOI/resetAdminLayers',id)
                }
            } 
        },
        closeOtherPanels(id){
            for (let i=0; i<this.panels.length; i++){
                if (this.panels[i]!==id){
                    this.$store.commit(this.panels[i]+'/'+this.panels[i]+'Toggle')
                }
            }
        },
        geocodeAddress(){
            this.$store.dispatch('geocoder/geocodeAddress', this.address)
        },
        MouseCoordinateToggle(){
            this.$store.commit('mouseCoordinate/setMouseCoordinateToggle')
        },
        databaseToggle(){
            this.$store.commit('database/setDatabaseToggle')
        },
        tableNames(){
            this.$store.dispatch('database/getTableNames')
            this.$store.dispatch('layers/getTableNames')
        },
        layerToggle(){
            this.$store.commit('layer/setLayerToggle')
        },
        layersToggle(){
            this.$store.commit('layers/setLayersToggle')
        },
        toolsToggle(){
            this.$store.commit('tools/setToolsToggle')
        },
        dropAreaToggle(){
            this.$store.commit('addData/dropAreaToggle')
        },
        userToggle(){
            this.$store.commit('user/setUserToggle')
        },
        changeLocale(code){
            if (this.$i18n.availableLocales.indexOf(code) > -1) {
                this.$i18n.locale = code
                this.tools = this.$store.getters['panel/getMenuTools']
            } 
        }
    },
    watch:{
        locale(n,o){
            if(n != o && o){
                this.changeLocale(n);
            }
        }
    },
    computed:{
        languages(){
            return getSupportedLocales()
        },
        currentLocale(){
            return $i18n.locale
        },
        menuTools(){
            return this.$store.getters.panel.getMenuTools
        }
    }
    
}
</script>

<style>
#main {

    position: absolute;
    z-index:999;
   
}

.expanding-search.v-text-field>.v-input__control>.v-input__slot:before { border-style: none; }
.expanding-search.v-text-field>.v-input__control>.v-input__slot:after { border-style: none; }
.expanding-search.v-text-field>.v-input__control {margin-top:-8px}

.v-input.expanding-search.closed{

    max-width:23px
}
.v-input.expanding-search.closed .v-input__slot{

    background: transparent !important;
    cursor: pointer;

}
.v-input.expanding-search{
    
    transition: max-width 0.3s
}
.header-right{
    height: 100%;
}
.translation{
    flex-flow: column;
    justify-content: center;
    padding-left: 12px;
    padding-right: 0px;
}
.user{
    flex-flow: column;
    justify-content: center;
    padding: 0;
}
.searchbar{
    height: 100%;
}   

</style>