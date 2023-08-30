<template>
<v-scroll-x-transition>

    <div v-show="$store.state.ligfinder.toggle"  class="ligfinder-ui">
        <template >
                  <i
                class="fas fa-times mt-1 " 
                style="cursor: pointer; position: absolute; right: 1%; top:0; z-index:999"
                @click="setLigfinderToggle"   
            >
            </i>
            <v-tabs background-color="cyan accent-4"
                center-active
                dark
                show-arrows
            >
                <v-tabs-slider color="purple darken-4"></v-tabs-slider>
                <v-tab id="aoi" class="" @click="setClickedMenu($event);" >{{ $t('ligfinder.tabs.searchArea') }}</v-tab>
                <v-tab id="area" class="" @click="setClickedMenu($event);">{{ $t('ligfinder.tabs.area') }}</v-tab>
                <v-tab id="criteria" class="" @click="setClickedMenu($event)">{{ $t('ligfinder.tabs.criteria') }}</v-tab>
                <v-tab id="proximity" class="" @click="setClickedMenu($event)">{{ $t('ligfinder.tabs.infra') }}</v-tab>
                <v-tab id="results" class="" @click="setClickedMenu($event)">{{ $t('ligfinder.tabs.results') }}
                    <v-chip color="green"> {{$store.state.ligfinder.FOI.features.length}} </v-chip>
                </v-tab>
                <v-tab id="joinparcels" class="" @click="setClickedMenu($event)">{{ $t('ligfinder.tabs.joinParcels') }}</v-tab>
            </v-tabs>
        </template>
        <div class="mx-4 mt-4">
            <AOI v-if="clickedLigMenue==='aoi'" />
            <Results v-if="clickedLigMenue==='results'" />
            <Area v-if="clickedLigMenue==='area'" />
            <Criteria v-if="clickedLigMenue==='criteria'" />
            <Proximity v-if="clickedLigMenue==='proximity'" />
            <JoinParcels v-if="clickedLigMenue==='joinparcels'" />
           
        </div>
    </div>
</v-scroll-x-transition>

</template>

<script>


import AOI from "./AOI"
import Results from "./Results"
import Area from "./Area"
import Criteria from "./Criteria"
import Proximity from "./Proximity"
import JoinParcels from "./JoinParcels"
export default {
    name: "Ligfinder",
    data(){
        return{
            clickedLigMenue: "aoi"
        }
    },
    methods: {
        setLigfinderToggle(){
            this.$store.commit('ligfinder/setLigfinderToggle')
        },
        setClickedMenu(e){
            this.clickedLigMenue= e.srcElement.id
        },
        
    },
    components: {
        AOI,
        Results,
        Area,
        Criteria,
        Proximity,
        JoinParcels
    }
}
</script>

<style scoped>
    .ligfinder-ui{
        background-color: rgba(255, 255, 255, 1);
        height: 100%;
        overflow-y: scroll;
    }
    .ligfinder-ui::-webkit-scrollbar {
        display: none;
    }
    .badge-notify{
        background:green;
        position:absolute;
        top: 0;
        right: 10px;
    }
    .ligfinder-ui-header .btn{
        font-weight: bold;
        width:20%;
        font-size: 0.8vw
    }
    
</style>