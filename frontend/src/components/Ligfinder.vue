<template>
    <div v-show="$store.state.ligfinder.toggle"  class="ligfinder-ui">
       
        <div>
            <i
                class="fas fa-times mt-1 " 
                style="cursor: pointer; position: absolute; right: 1%"
                @click="setLigfinderToggle"   
            >
            </i>
        </div>
           
        <div class="ligfinder-ui-header mt-4" id="ligfinder-ui-header">
            <button id="aoi" class="btn" @click="setClickedMenu($event);">
                SUCHGEBIET
            </button>
            <button id="area" class="btn" @click="setClickedMenu($event);">
                FLÄCHE
            </button>
            <button  class="btn ">
                KRITERIEN
            </button>
            <button id="proximity" class="btn" @click="setClickedMenu($event)">
                INFRASTRUKTUR
            </button>
            <button id="results" class="btn" @click="setClickedMenu($event)">
                ERGEBNISSE
                <span class="badge circle circle-md bg-dar badge-notify mt-4 ">{{$store.state.ligfinder.FOI.features.length}}</span>
            </button>
        </div>
        <div class="mx-4 mt-4">
            <AOI v-if="clickedLigMenue==='aoi'" />
            <Results v-if="clickedLigMenue==='results'" />
            <Area v-if="clickedLigMenue==='area'" />
            <Proximity v-if="clickedLigMenue==='proximity'" />
           
        </div>
    </div>
</template>

<script>


import AOI from "./AOI"
import Results from "./Results"
import Area from "./Area"
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