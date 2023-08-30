<template>
<v-scroll-x-transition>
  <div v-show="$store.state.classification.toggle" class="classification-ui">
        <div>
            <i
                class="fas fa-times mt-1 " 
                style="cursor: pointer; position: absolute; right: 1%"
                @click="setClassificationToggle"   
            >
            </i>
        </div>
         <div class="text-center mt-4 classification-title" >{{ $t('classification.title') }}</div>
        <v-container
            fluid
            mt-10
        >
            <v-row align="center">

            <v-col
                cols="12"
                sm="6"
            >
                <v-select
                :items="this.addedLayersNames"
                :label="$t('classification.layer')"
                v-model="$store.state.classification.selectedLayer"
                @change="selectAttributes"
                ></v-select>
            </v-col>
            <v-col
                
                cols="12"
                sm="6"
                
            >
                <v-select
                :items="$store.state.classification.choroplethMethod"
                item-text="name"
                :label="$t('classification.choropleth')"
                v-model="$store.state.classification.selectedChoroplethMethod"
                ></v-select>
            </v-col>
            

            </v-row>

            <v-row v-if="$store.state.classification.selectedChoroplethMethod === 'Bivariate'" align="center">
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.1stAttr')"
                    :items="$store.state.classification.attributes"
                    v-model="$store.state.classification.attribute1"
                    ></v-select>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.2ndAttr')"
                    :items="$store.state.classification.attributes"
                    v-model="$store.state.classification.attribute2"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row v-else align="center">
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.1stAttr')"
                    :items="$store.state.classification.attributes"
                    v-model="$store.state.classification.attribute1"
                    ></v-select>
                </v-col>
                
            </v-row>

            <v-row align="center">
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.method')"
                    :items="$store.state.classification.classificationMethod"
                    v-model="$store.state.classification.selectedClassificationMethod"
                    ></v-select>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.classes')"
                    :items="$store.state.classification.classes"
                    v-model="$store.state.classification.selectedClass"
                    ></v-select>
                </v-col>
                
            </v-row>
            <v-row v-if="$store.state.classification.selectedChoroplethMethod==='Univariate'" align="center">
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    :label="$t('classification.palette')"
                    :items="this.colorBrewerItems"
                    v-model="$store.state.classification.selectedColorPalette"
                    ></v-select>
                </v-col>
                
            </v-row>
            <v-row v-if="$store.state.classification.selectedChoroplethMethod==='Bivariate'" align="center">
                <v-col
                    cols="12"
                    sm="6"
                >
                <span style="vertical-align: middle;">{{$t('classification.1stColor')}} </span>  <span style="vertical-align: middle;"><input type="color" v-model="$store.state.classification.color1" value="#ff0000"></span>
                </v-col>
                
                <v-col
                    cols="12"
                    sm="6"
                >
                <span style="vertical-align: middle;">{{$t('classification.2ndColor')}} </span>  <span style="vertical-align: middle;"><input type="color" v-model="$store.state.classification.color2" value="#0000FF"></span>
                </v-col>
                
            </v-row>
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="classify">{{$t('classification.classify')}}</button>
                <button style="font-size: 0.8vw" class="btn btn-secondary ml-4" @click="resetClassification">{{$t('classification.reset')}}</button>
            </div>

        </v-container>
        
      
  </div>
</v-scroll-x-transition>
</template>

<script>
import colorbrewer from "colorbrewer"
export default {
    name: "Classification",
    methods:{
        setClassificationToggle(){
            this.$store.commit('classification/setClassificationToggle')
        },
        selectAttributes(e){
            this.$store.dispatch('classification/selectAttributes', e)
        },
        classify(){
            this.$store.dispatch('classification/classify')
        },
        resetClassification(){
            this.$store.dispatch('classification/resetClassification')
        }

    },
    computed:{
        addedLayersNames(){
            let addedLayersNames = []
            for (let i=0; i<this.$store.state.layers.addedLayers.length; i++){
                addedLayersNames.push(this.$store.state.layers.addedLayers[i].name)
            }
            return addedLayersNames
        },
        colorBrewerItems(){
            
            return Object.keys(colorbrewer)
        }
        
        
    }
}
</script>

<style scoped>
    .classification-ui{
        background-color: rgba(255, 255, 255, 1);
        height: 100%;
        overflow-y: scroll;
    }
    .classification-title{
        font-weight: bold;
        font-size: 1.5vw
    }
    .gg{
        position:absolute;
        right: 2vw
    }
    
</style>