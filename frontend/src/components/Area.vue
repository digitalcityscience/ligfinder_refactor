<template>
    <div v-if="$store.state.ligfinder.FOI.features[0]">
        <v-card class="area-filter">
            <v-card-subtitle class="text-subtitle-1 text-capitalize">{{ $t('ligfinder.area.landInM2') }}</v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col class="px-4">
                        <v-range-slider
                        v-model="$store.state.area.areaRange"
                        :max="getParams[1]"
                        :min="getParams[0]"
                        hide-details
                        class="align-center"
                        >
                        <template v-slot:prepend >
                            <v-text-field
                            :value="$store.state.area.areaRange[0]"
                            @change="$set($store.state.area.areaRange, 0, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            label="min"
                            type="number"
                            ></v-text-field>
                        </template>
                        <template v-slot:append>
                            <v-text-field
                            :value="$store.state.area.areaRange[1]"
                            @change="$set($store.state.area.areaRange, 1, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            label="max"
                            type="number"
                            ></v-text-field>
                        </template>
                        </v-range-slider>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-subtitle class="text-subtitle-1 text-capitalize">{{ $t('ligfinder.area.grossFloorInM2') }}</v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col class="px-4">
                        <v-range-slider
                        v-model="$store.state.area.grossFloorAreaRange"
                        :max="getParams[3]"
                        :min="getParams[2]"
                        hide-details
                        class="align-center"
                        >
                        <template v-slot:prepend>
                            <v-text-field
                            :value="$store.state.area.grossFloorAreaRange[0]"
                            @change="$set($store.state.area.grossFloorAreaRange, 0, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            type="number"
                            label="min"
                            ></v-text-field>
                        </template>
                        <template v-slot:append>
                            <v-text-field
                            :value="$store.state.area.grossFloorAreaRange[1]"
                            @change="$set($store.state.area.grossFloorAreaRange, 1, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            type="number"
                            label="max"
                            ></v-text-field>
                        </template>
                        </v-range-slider>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-subtitle class="text-subtitle-1 text-capitalize">{{ $t('ligfinder.area.availableVacantLots') }}</v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col class="px-4">
                        <v-range-slider
                        v-model="$store.state.area.unbuiltAreaRange"
                        :max="getParams[5]"
                        :min="getParams[4]"
                        hide-details
                        class="align-center"
                        >
                        <template v-slot:prepend>
                            <v-text-field
                            :value="$store.state.area.unbuiltAreaRange[0]"
                            @change="$set($store.state.area.unbuiltAreaRange, 0, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            label="min"
                            type="number"
                            ></v-text-field>
                        </template>
                        <template v-slot:append>
                            <v-text-field
                            :value="$store.state.area.unbuiltAreaRange[1]"
                            @change="$set($store.state.area.unbuiltAreaRange, 1, $event)"
                            class="mt-0 pt-0"
                            hide-details
                            label="max"
                            type="number"
                            ></v-text-field>
                        </template>
                        </v-range-slider>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-col class="mt-4" >
                <v-btn light color="primary" class="m-2" @click="areaFilter">{{ $t('ligfinder.area.search') }}</v-btn>
                <v-btn light color="success" class="m-2" @click="applyAreaFilter">{{ $t('ligfinder.area.apply') }}</v-btn>
            </v-col>
        </v-card>
    </div>
    <div v-else class="table text-center">
        <p>{{ $t('ligfinder.area.noFeature') }}</p>
    
    </div>
</template>

<script>
//import $ from 'jquery'
import { mapGetters } from 'vuex'
export default {
    name: "Area",
    data() {
        return {
            areaRange: [1, 9],
            landAreaMin: 0,
            landAreaMax: 100,
            example: null
        }
    },
    components: {
    },
    created() {
        
    },
   
    computed: {
        doneTodos () {
            return this.$store.getters.getParams
        },
        // mix the getters into computed with object spread operator
        ...mapGetters(
            'area', {
            getParams: 'getParams',
            })
    },
    methods:{
        areaFilter(){
           this.$store.dispatch("area/areaFilter")
       },
       applyAreaFilter(){
           this.$store.dispatch("area/applyAreaFilter")
       }
    }
}
</script>

<style scoped>
.area-filter::v-deep .v-input__slider > .v-input__control{
    display: none;
}




</style>