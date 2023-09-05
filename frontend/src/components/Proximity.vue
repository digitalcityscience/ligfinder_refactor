<template>
<div v-if="$store.state.ligfinder.FOI.features[0]">
    <v-card
    
  >
    <div v-for="item in $store.state.proximity.parameters"  :key="item.value">
      <v-card-text class="mt-0">
      <v-checkbox
        color="primary"
        v-model="item.checked"
        :label="item.name"
        :dense="false"
        hide-details
        @mousedown="disableWeight(item.value); changeSlider(item.value)"
      ></v-checkbox>
      <v-row class="mt-4">
        <v-col >
            
          <v-slider
            :disabled="item.checked==false"
            v-model="item.weight"
            @change="changeSlider(item.value)"
            class="align-center"
            :max="$store.state.proximity.apothekeMax"
            :min="$store.state.proximity.apothekeMin"
            track-color="primary"
            thumb-label="always"
            :thumb-size="27"
            thumb-color="primary"
            step= "0.01"
            hide-details
          >
            <template v-slot:append>
              <span style="font-size: 0.8vw">{{(item.weight).toFixed(2)}}</span>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      
    </v-card-text>
    </div>
    
    <v-col class="mt-4 " >
        <v-btn light color="success" class="m-2" @click="equalizeWeight">{{ $t('ligfinder.proximity.eqWeight') }}</v-btn>

        <v-btn light color="primary" class="m-2" @click="proximityAnalysis">{{ $t('ligfinder.proximity.analyze') }}</v-btn>
    </v-col>
  </v-card>
  </div>
  <div v-else class="table text-center">
    <p>{{ $t('ligfinder.proximity.noFeature') }}</p>
  </div>
  
</template>

<script>
export default {
    name:'Proximity',
    data () {
        return {

        }
    },
    computed: {
      
    },
    methods:{
      disableWeight(item){

        this.$store.commit("proximity/disableWeight", item)
      },
      changeSlider(item){
        this.$store.commit("proximity/changeSlider", item)
      },
      proximityAnalysis(){
        this.$store.dispatch("proximity/proximityAnalysis")
      },
      equalizeWeight(){
        this.$store.commit("proximity/equalizeWeight")
      }
    }
}
</script>

<style scoped>

</style>