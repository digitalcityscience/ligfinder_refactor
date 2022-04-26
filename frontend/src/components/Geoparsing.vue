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
            ml-3
        >
            <v-select
                :items="$store.state.geoparsing.datasetOptions"
                label="Geoparsing Results"
                solo
                item-text="name"
                item-value="value"
                style="width:50%"
                v-model="$store.state.geoparsing.datasetMode"
                @change="removeStyles(), getPoints()"
                :style="{marginTop:'8vh'}"   
            >
            </v-select>
        </v-container>
       
        <v-container v-show="$store.state.geoparsing.datasetMode">
            <v-bottom-navigation
                color="cyan"
                grow
            >
                <v-btn @click="setToolModeStylization">
                    <span>Stylization</span>

                    <v-icon>mdi-palette-outline</v-icon>
                </v-btn>

                <v-btn @click="setToolModeFiltering">
                    <span>Filtering</span>

                    <v-icon>mdi-filter-outline</v-icon>
                </v-btn>

    
            </v-bottom-navigation>
        </v-container>

        <v-container
            v-show="$store.state.geoparsing.datasetMode == 'parliament' && $store.state.geoparsing.toolMode =='stylization'"
            
            class="px-0"
            fluid
            ml-3
        >
           
            <v-col
                class="px-0"
                cols="20"
                sm="6"
            >
                <v-select
                    v-if="$store.state.geoparsing.datasetMode == 'parliament'"
                    :items="$store.state.geoparsing.items"
                    label="Rendering Style"
                    v-on:change="changeStyle"
                >
                </v-select>
            </v-col>

        </v-container>

        <v-container
            v-show="$store.state.geoparsing.datasetMode == 'newspaper' && $store.state.geoparsing.toolMode =='stylization'"
            class="px-0"
            fluid
            ml-3
        >
            <v-col
                class="px-0"
                cols="20"
                sm="6"
            >
                <v-select
                    v-if="$store.state.geoparsing.datasetMode == 'newspaper'"
                    :items="$store.state.geoparsing.items"
                    label="Rendering Style"
                    v-on:change="changeStyle"
                
                >
                </v-select>
            </v-col>

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
    methods:{
        setGeoparsingToggle(){
            this.$store.commit('geoparsing/setGeoparsingToggle')
        },
        getGeocodedPoints(){
            this.$store.dispatch('geoparsing/getGeocodedPoints')
        },
        getNewspaperPoints(){
            this.$store.dispatch('geoparsing/getNewspaperPoints')
        },
        getPoints(){
            if(this.$store.state.geoparsing.datasetMode == 'parliament'){
                this.$store.dispatch('geoparsing/getGeocodedPoints')
            }
            else if (this.$store.state.geoparsing.datasetMode == 'newspaper'){
                this.$store.dispatch('geoparsing/getNewspaperPoints')
            }
        },
        changeStyle(e){
            if (e=='No Style'){
                this.$store.dispatch('geoparsing/removeStyles')
            }
            else{
                this.$store.dispatch('geoparsing/changeStyle', e)
            }
            
        },
        
        removeStyles(){
            this.$store.dispatch('geoparsing/removeStyles')
        },
        setToolModeStylization(){
            this.$store.commit('geoparsing/setToolModeStylization')
        },
        setToolModeFiltering(){
            this.$store.commit('geoparsing/setToolModeFiltering')
        }
        
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