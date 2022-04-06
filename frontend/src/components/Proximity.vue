<template>
<div v-if="$store.state.ligfinder.FOI.features[0]">
    <v-card
    
  >
    <v-card-text class="mt-0">
      <v-checkbox
        v-model="$store.state.proximity.supermarketCheckbox"
        label="Supermarkt"
      ></v-checkbox>
      <v-row>
        <v-col class="pr-4">
          <v-slider
            :disabled="$store.state.proximity.supermarketCheckbox==false"
            v-model="$store.state.proximity.supermarketWeight"
            class="align-center"
            :max="$store.state.proximity.supermarketMax"
            :min="$store.state.proximity.supermarketMin"
            step= "0.1"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="$store.state.proximity.supermarketWeight"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="font-size: 0.8vw; width: 5vw"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      
    </v-card-text>
    
    <v-card-text class="mt-0">
      <v-checkbox
        v-model="$store.state.proximity.metroCheckbox"
        label="U-Bahn, S-Bahn Station"
      ></v-checkbox>
      <v-row>
        <v-col class="pr-4">
          <v-slider
            :disabled="$store.state.proximity.metroCheckbox==false"
            v-model="$store.state.proximity.metroWeight"
            class="align-center"
            :max="$store.state.proximity.metroMax"
            :min="$store.state.proximity.metroMin"
            step= "0.1"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="$store.state.proximity.metroWeight"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="font-size: 0.8vw; width: 5vw"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      
    </v-card-text>


    <v-card-text class="mt-0">
      <v-checkbox
        v-model="$store.state.proximity.apothekenCHeckbox"
        label="Apotheken"
      ></v-checkbox>
      <v-row>
        <v-col class="pr-4">
          <v-slider
            :disabled="$store.state.proximity.apothekenCHeckbox==false"
            v-model="$store.state.proximity.apothekeWeight"
            class="align-center"
            :max="$store.state.proximity.apothekeMax"
            :min="$store.state.proximity.apothekeMin"
            step= "0.1"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="$store.state.proximity.apothekeWeight"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="font-size: 0.8vw; width: 5vw"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      
    </v-card-text>
    <v-col class="mt-4 " >
        <button style="font-size: 0.8vw" class="btn btn-info" @click="proximityAnalysis">Analyse durchführen</button>
    </v-col>
  </v-card>
  </div>
  <div v-else class="table text-center">
        <p>No Feature Selected</p>
    
  </div>
  
</template>

<script>
export default {
    name:'Proximity',
    data () {
        return {


        }
    },
    methods:{
        proximityAnalysis(){
            this.$store.dispatch("proximity/proximityAnalysis")
        }
    }
}
</script>

<style scoped>

</style>