<template>
<v-scroll-x-transition>

    <v-card v-show="$store.state.geoparsing.toggle" class="geoparsing-ui">
        <v-card-title>{{ $t('geoparsing.title') }}</v-card-title>
        <v-card-text>
        <v-container>
            <v-select
                :items="$store.state.geoparsing.datasetOptions"
                :label="$t('geoparsing.results')"
                solo
                item-text="name"
                item-value="value"
                v-model="$store.state.geoparsing.datasetMode"
                @change="getPoints(), resetDate(), setToolModeStylization()"
                   
            >
            </v-select>
        </v-container>
        <v-divider></v-divider>
        <v-container v-show="$store.state.geoparsing.datasetMode">
            <v-tabs background-color="primary"
                    dark
                    style="border-radius: 4px;"
                    fixed-tabs
                >
                    <v-tab id="aoi" class="" @click="setToolModeStylization" >{{$t('geoparsing.sytlization')}}</v-tab>
                    <v-tab id="area" class="" @click="setToolModeFiltering">{{$t('geoparsing.filtering')}}</v-tab>
                    <v-tab id="criteria" class="" @click="setToolModeTopic">{{$t('geoparsing.topics')}}</v-tab>
                </v-tabs>
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
                    :label="$t('geoparsing.renderingStyle')"
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
                    :label="$t('geoparsing.renderingStyle')"
                    v-on:change="changeStyle"
                
                >
                </v-select>
            </v-col>
        </v-container>
        <v-container
            v-show="$store.state.geoparsing.datasetMode == 'elbe' && $store.state.geoparsing.toolMode =='stylization'"
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
                    v-if="$store.state.geoparsing.datasetMode == 'elbe'"
                    :items="$store.state.geoparsing.items"
                    :label="$t('geoparsing.renderingStyle')"
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
                        :label="$t('geoparsing.date')"
                        :hint="$t('geoparsing.dateHint',{'0':$store.state.geoparsing.minDate,'1':$store.state.geoparsing.maxDate})"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        solo
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="$store.state.geoparsing.dates"
                    no-title
                    range
                ></v-date-picker>
            </v-menu>
            <v-btn color="primary" class="mt-6" @click="dateFilter">
                {{$t('geoparsing.apply')}}
            </v-btn>
        </v-col>

        <v-col 
            cols="12"
            v-show="$store.state.geoparsing.toolMode =='topic' && $store.state.geoparsing.datasetMode == 'parliament'"
        >
            <v-combobox
            v-model="$store.state.geoparsing.topics"
            :items="$store.state.geoparsing.topicItems"
            :label="$t('geoparsing.topics')"
            multiple
            small-chips
            ></v-combobox>
            <v-select
            :items="$store.state.geoparsing.topicQueryModes"
            v-model="$store.state.geoparsing.selectedTopicQueryMode"
            :label="$t('geoparsing.operator')"
            ></v-select>
            <v-btn color="primary"  class="mt-6" @click="topicFilter">
                    {{$t('geoparsing.apply')}}
            </v-btn>
        </v-col>
        <v-col 
            cols="12"
            v-show="$store.state.geoparsing.toolMode =='topic' && $store.state.geoparsing.datasetMode == 'elbe'"
        >
            <v-combobox
            v-model="$store.state.geoparsing.elbeTopics"
            :items="$store.state.geoparsing.elbeTopicItems"
            :label="$t('geoparsing.topics')"
            multiple
            small-chips
            ></v-combobox>
            <v-select
            :items="$store.state.geoparsing.elbeTopicQueryModes"
            v-model="$store.state.geoparsing.elbeSelectedTopicQueryMode"
            :label="$t('geoparsing.operator')"
            ></v-select>
            <v-btn color="primary"  class="mt-6" @click="elbeTopicFilter">
                    {{$t('geoparsing.apply')}}
            </v-btn>
        </v-col>
    </v-card-text>
    </v-card>
</v-scroll-x-transition >

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
        getPoints(){
            if(this.$store.state.geoparsing.datasetMode == 'parliament'){
                this.$store.dispatch('geoparsing/getGeocodedPoints')
            }
            else if (this.$store.state.geoparsing.datasetMode == 'newspaper'){
                this.$store.dispatch('geoparsing/getNewspaperPoints')
            }
            else if (this.$store.state.geoparsing.datasetMode == 'elbe'){
                this.$store.dispatch('geoparsing/getElbePoints')
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
        setToolModeTopic(){
            this.$store.commit('geoparsing/setToolModeTopic')
        },
        dateFilter(){
            this.$store.dispatch('geoparsing/dateFilter')
        },
        resetDate(){
            this.$store.commit('geoparsing/resetDate')
        },
        topicFilter(){
            this.$store.dispatch('geoparsing/topicFilter')
        },
        elbeTopicFilter(){
            this.$store.dispatch('geoparsing/elbeTopicFilter')
        }
        
    }
}
</script>

<style scoped>
    .geoparsing-ui{
        background-color: rgba(255, 255, 255, 1);
        height: 100vh;
    }
    .geoparsing-title{
        font-weight: bold;
        font-size: 1.5vw
    }
</style>