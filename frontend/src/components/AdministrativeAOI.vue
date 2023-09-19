<template>
    <v-card class="administrative-select">
        <v-card-subtitle>
            {{$t('ligfinder.aoi.administrative.title')}}
        </v-card-subtitle>
        <v-card-text>
            <v-select :items="$store.state.administrativeAOI.items" placeholder="Please select AOI type" solo item-text="name" item-value="value"
                v-model="$store.state.administrativeAOI.selectMode" @change="getAdminArea"></v-select>
                <v-autocomplete v-model="pickedSelectionArr" :items="$store.state.administrativeAOI.adminStates" chips small-chips
                    multiple item-text="name" return-object solo
                    :persistent-placeholder="true"
                    :placeholder="$t('ligfinder.aoi.administrative.selectByName')"></v-autocomplete>
            <div class="d-flex flex-wrap justify-space-around">
               <v-btn dark class="m-1 flex-grow-1" color="green" @click="addToAOIList"
                    :disabled="$store.state.administrativeAOI.pickedStates.length == 0">
                    {{$t('ligfinder.aoi.administrative.add2List')}}
                </v-btn>
                <v-btn class="m-1 flex-grow-1" dark color="red" @click="deleteSelectedFeatures"
                    :disabled="$store.state.administrativeAOI.pickedStates.length == 0">
                    {{$t('ligfinder.aoi.administrative.rmSelection')}}
                </v-btn> 
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "AdministrativeAOI",
    methods: {
        getAdminArea(event) {
            this.$store.dispatch("administrativeAOI/getAdminArea", event)
        },
        resetSelectedFeatures() {
            this.$store.commit("administrativeAOI/resetSelectedLayers")
        },
        getSelectedFeatures() {
            this.$store.dispatch("administrativeAOI/getSelectedFeatures")
        },
        resetAdminLayers() {
            this.$store.dispatch("administrativeAOI/resetAdminLayers")
        },
        addToAOIList() {
            this.$store.dispatch("AOI/addAdminAreaToAOIList")
        },
        deleteSelectedFeatures() {
            this.$store.dispatch("administrativeAOI/deleteSelectedDispatcher")
        }

    },
    computed: {
        pickedSelectionArr: {
            set(arr) {
                this.$store.dispatch('administrativeAOI/pickedStatesHandler', arr)
            },
            get() {
                console.log('getting pickedSelectionArr')
                return this.$store.state.administrativeAOI.pickedStates
            }
        }
    }
}
</script>

<style scoped>
.administrative-select.v-list-item__title {
    text-transform: capitalize;
    padding-left: 12px;
}
</style>