<template>
<div v-if="$store.state.ligfinder.FOI.features[0]">
    <v-card
    
  >
    <div v-for="item in $store.state.proximity.parameters"  :key="item.value">
      <v-card-text class="mt-0">
      <!--<v-checkbox
        v-model="item.checked"
        @click="disableWeight(item.value)"
        :label="item.name"
      ></v-checkbox>-->
      <v-checkbox
        color="cyan"
        v-model="item.checked"
        :label="item.name"
        :dense="false"
        hide-details
        @mousedown="disableWeight(item.value); changeSlider(item.value)"
      ></v-checkbox>
      <v-row>
        <v-col >
            
          <v-slider
            :disabled="item.checked==false"
            v-model="item.weight"
            @change="changeSlider(item.value)"
            class="align-center"
            :max="$store.state.proximity.apothekeMax"
            :min="$store.state.proximity.apothekeMin"
            track-color="blue lighten-4"
            thumb-label="always"
            :thumb-size="27"
            thumb-color="blue"
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
        <button style="font-size: 0.8vw" class="btn btn-success mr-2" @click="equalizeWeight">{{ $t('ligfinder.proximity.eqWeight') }}</button>

        <button style="font-size: 0.8vw" class="btn btn-info" @click="proximityAnalysis">{{ $t('ligfinder.proximity.analyze') }}</button>
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