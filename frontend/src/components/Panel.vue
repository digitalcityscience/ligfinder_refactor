<template>

    <div>
        
    <v-app-bar
      color="#4c5b6e"
      dense
      dark
      style="z-index:999;"

    >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ $t('panel.title') }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-col style= "height:100%">
            <v-text-field
                @focus="searchClosed = false"
                @blur="searchClosed= true"
                v-model="address"
                v-on:keyup.enter="geocodeAddress"
                placeholder="search address"
                prepend-inner-icon="mdi-magnify "
                class="expanding-search"
                :class="{ 'closed': searchClosed && !address }"
                filled
                dense
                clearable
                style="float:right; width: 300px;"
                @click:clear="clearGeocodedAddress"
            >
            </v-text-field>
        </v-col>

    </v-app-bar>

    
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="z-index:9999"
    >
       
        <v-list-item v-if="$store.state.user.loggedIn" class="px-2">
            <v-list-item-avatar color="cyan" style="top: 0.2rem; ">
                <span class="my-span white--text">
                    {{$store.state.user.nameAbbreviation}}
                </span>
            </v-list-item-avatar>

            <v-list-item-title style="top: 0.6rem; ">{{$store.state.user.firstname}} {{$store.state.user.lastname}}</v-list-item-title>

            <v-btn
            icon
            @click.stop="drawer = !drawer"
            >
            <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
        </v-list-item>

        <v-divider v-if="$store.state.user.loggedIn"></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :id="item.id"
           @click.stop="drawer = !drawer"
           @click="getid(item.id); closeOtherPanels(item.id)"
        >
          <v-list-item-icon>
            <v-icon  >{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list-group
          :value="false"
          no-action
          prepend-icon="mdi-cog-outline"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ $t('panel.modules') }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="tool in tools"
            :key="tool.id"
            link
            dense
            @click.stop="drawer = !drawer"
            @click="getid(tool.id); closeOtherPanels(tool.id)"
          >
            <v-list-item-title v-text="tool.title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon dense v-text="tool.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
    </v-navigation-drawer>
    </div>

      

</template>

<script>
import $ from 'jquery'
import $i18n from '../plugins/i18n/i18n'
$(function() {
    $('#mouse-coordinate-icon').click(function () {
        $('#tgl-arrow').toggleClass('fa-angle-double-left fa-angle-double-right');
    });
});
export default {
    name: "Panel",
    components:{
        //MouseCoordinate
    },
    data: () => ({
      drawer: false,
      group: null,
        items: [
            { title: $i18n.t('panel.myAccount'), icon: 'mdi-account-outline', id:'user' },
            { title: $i18n.t('panel.layers'), icon: 'mdi-layers-outline', id:'layers' },
            { title: $i18n.t('panel.addData'), icon: 'mdi-plus', id:'addData' },
        ],
        mini: true,
        tools: [
            { title: $i18n.t('panel.tools.lig'), icon: 'mdi-map-check', id:'ligfinder' },
            { title: $i18n.t('panel.tools.geo'), icon: 'mdi-nfc-search-variant', id:'geoparsing' },
            { title: $i18n.t('panel.tools.clsf'), icon: 'mdi-sort-descending', id:'classification' }
      ],
      panels: ['user', 'layers', 'ligfinder', 'geoparsing', 'classification'],
      searchClosed: true,
      address: null
    }),
    methods:{
        clearGeocodedAddress(){
            this.$store.dispatch('geocoder/clearGeocodedAddress')
        },
        getid(id){
            if (id=="user"){
                this.$store.commit('user/setUserToggle')
            }
            else if (id=="layers"){
                this.$store.commit('layers/setLayersToggle')
                this.$store.dispatch('layers/getTableNames')
            }
            else if (id=="addData"){
                this.$store.commit('addData/dropAreaToggle')
            }
            else if (id=="ligfinder"){
                this.$store.commit('ligfinder/setLigfinderToggle')
            }
            else if (id=="geoparsing"){
                this.$store.commit('geoparsing/setGeoparsingToggle')
            }
            else if (id=="classification"){
                this.$store.commit('classification/setClassificationToggle')
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
   

</style>