<template>
    <div v-show="$store.state.ligfinder.toggle"  class="ligfinder-ui">

        <!--<div class="ligfinder-ui-header mt-4" id="ligfinder-ui-header">
            <button id="aoi" class="btn" @click="setClickedMenu($event);">
                SUCHGEBIET
            </button>
            <button id="area" class="btn" @click="setClickedMenu($event);">
                FLÄCHE
            </button>
            <button id="criteria" class="btn" @click="setClickedMenu($event)">
                KRITERIEN
            </button>
            <button id="proximity" class="btn" @click="setClickedMenu($event)">
                INFRASTRUKTUR
            </button>
            <button id="results" class="btn" @click="setClickedMenu($event)">
                ERGEBNISSE
                <span class="badge circle circle-md bg-dar badge-notify mt-4 ">{{$store.state.ligfinder.FOI.features.length}}</span>
            </button>
        </div>-->
        
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
                <v-tab id="aoi" class="" @click="setClickedMenu($event);" >SUCHGEBIET</v-tab>
                <v-tab id="area" class="" @click="setClickedMenu($event);">FLÄCHE</v-tab>
                <v-tab id="criteria" class="" @click="setClickedMenu($event)">KRITERIEN</v-tab>
                <v-tab id="proximity" class="" @click="setClickedMenu($event)">INFRASTRUKTUR</v-tab>
                <v-tab id="results" class="" @click="setClickedMenu($event)">ERGEBNISSE
                    <v-chip color="green"> {{$store.state.ligfinder.FOI.features.length}} </v-chip>
                </v-tab>
            </v-tabs>
        </template>
        <div class="mx-4 mt-4">
            <AOI v-if="clickedLigMenue==='aoi'" />
            <Results v-if="clickedLigMenue==='results'" />
            <Area v-if="clickedLigMenue==='area'" />
            <Criteria v-if="clickedLigMenue==='criteria'" />
            <Proximity v-if="clickedLigMenue==='proximity'" />
           
        </div>
    </div>
</template>

<script>


import AOI from "./AOI"
import Results from "./Results"
import Area from "./Area"
import Criteria from "./Criteria"
import Proximity from "./Proximity"
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
        Proximity
    }
}
</script>

<style scoped>
    .ligfinder-ui{
        position: absolute;
        font-family: 'Nunito', sans-serif;
        background-color: rgba(255, 255, 255, 1);
        z-index: 900;
        left:1.9vw;
        width: 40vw;
        height: 100vh;
        overflow-y: scroll;
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