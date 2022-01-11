<template>
    <div v-show="$store.state.geoparsing.toggle" class="geoparsing-ui">
        <div>
            <i
                class="fas fa-times mt-1 " 
                style="cursor: pointer; position: absolute; right: 1%"
                @click="setGeoparsingToggle"   
            >
            </i>
        </div>
        <div class="text-center mt-4 geoparsing-title" >

            GeoParsing
           
        </div>
        <v-container
            class="px-0"
            fluid
            mt-10
            ml-3
        >
            <v-switch
            :label="`Geocoded Point Address`"
            @click.once="getGeocodedPoints"
            @change="toggleLayerVisibility"
            id="geocodelayertoggle"
            v-model="$store.state.geoparsing.switch1"
            ></v-switch>

        </v-container>
        <v-container
            fluid
            ml-3
            v-if="$store.state.geoparsing.switch1"
        >
            <v-row align="center">

            <v-col
                class="px-0"
                cols="20"
                sm="6"
            >
                <v-select
                :items="$store.state.geoparsing.items"
                label="Rendering Style"
                v-on:change="changeStyle"
                
                
                ></v-select>
            </v-col>

            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Geoparsing",
    data () {
      return {
          
      }
    },
    mounted: function(){
        
    },
    
    methods:{
        setGeoparsingToggle(){
            this.$store.commit('geoparsing/setGeoparsingToggle')
        },
        getGeocodedPoints(){
            this.$store.dispatch('geoparsing/getGeocodedPoints')
        },
        changeStyle(e){
            this.$store.dispatch('geoparsing/changeStyle', e)
        },
        toggleLayerVisibility(){
           this.$store.dispatch('geoparsing/toggleLayerVisibility')
        },
        
    }
}
</script>

<style scoped>
    .geoparsing-ui{
        position: absolute;
        font-family: 'Nunito', sans-serif;
        background-color: rgba(255, 255, 255, 1);
        z-index: 900;
        left:1.9vw;
        width: 25vw;
        height: 100vh;
    }
    .geoparsing-title{
        font-weight: bold;
        font-size: 1.5vw
    }
</style>