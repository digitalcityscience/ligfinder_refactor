<template>
  <div v-show="$store.state.classification.toggle" class="classification-ui">
        <div>
            <i
                class="fas fa-times mt-1 " 
                style="cursor: pointer; position: absolute; right: 1%"
                @click="setClassificationToggle"   
            >
            </i>
        </div>
         <div class="text-center mt-4 classification-title" >

            Classification
           
        </div>
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
                label="Layer"
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
                label="Choropleth"
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
                    label="1st Attribute"
                    :items="$store.state.classification.attributes"
                    v-model="$store.state.classification.attribute1"
                    ></v-select>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    label="2nd Attribute"
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
                    label="1st Attribute"
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
                    label="Classification Method"
                    :items="$store.state.classification.classificationMethod"
                    v-model="$store.state.classification.selectedClassificationMethod"
                    ></v-select>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-select
                    label="Classes"
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
                    label="Color Palette"
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
                <span style="vertical-align: middle;">1st Color </span>  <span style="vertical-align: middle;"><input type="color" v-model="$store.state.classification.color1" value="#ff0000"></span>
                </v-col>
                
                <v-col
                    cols="12"
                    sm="6"
                >
                <span style="vertical-align: middle;">2nd Color </span>  <span style="vertical-align: middle;"><input type="color" v-model="$store.state.classification.color2" value="#0000FF"></span>
                </v-col>
                
            </v-row>
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="classify">Classify</button>
                <button style="font-size: 0.8vw" class="btn btn-secondary ml-4" @click="resetClassification">Reset</button>
            </div>

        </v-container>
        
      
  </div>
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
        position: absolute;
        font-family: 'Nunito', sans-serif;
        background-color: rgba(255, 255, 255, 1);
        z-index: 900;
        left:1.9vw;
        width: 30vw;
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