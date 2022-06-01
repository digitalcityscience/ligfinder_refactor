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

        <v-col
            v-show="$store.state.geoparsing.toolMode =='filtering'"
            cols="12"
            lg="10"
        >
            <v-menu
                ref="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dateRangeText"
                        label="Date"
                        :hint="'available dates: ' + $store.state.geoparsing.minDate + '~' + $store.state.geoparsing.maxDate"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="$store.state.geoparsing.dates"
                    no-title
                    range
                ></v-date-picker>
            </v-menu>
            <v-btn small outlined color="cyan" class="mt-6" @click="dateFilter">
                apply
            </v-btn>
      </v-col>
        
    </div>
</template>

<script>

export default {
    name: "Geoparsing",
    data () {
      return {
          
      }
    },
    computed: {
      dateRangeText () {
        return this.$store.state.geoparsing.dates.join(' ~ ')
      },
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
        },
        dateFilter(){
            this.$store.dispatch('geoparsing/dateFilter')
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
        width: 25vw;
        height: 100vh;
    }
    .geoparsing-title{
        font-weight: bold;
        font-size: 1.5vw
    }
</style>