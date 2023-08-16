<template>
    <div  class="administrative-select">
        <div style="width:60%; margin-top: 5%">
            
            <v-select
                :items="$store.state.administrativeAOI.items"
                :label="$t('ligfinder.aoi.administrative.level')"
                solo
                item-text="name"
                item-value="value"
                
                v-model="$store.state.administrativeAOI.selectMode"
                @change="getAdminArea"
            ></v-select>
            <v-card
                class="mx-auto mt-2"
                max-height="30vh"
    
            >
                <v-list-group
                    :value="false"
                
                >
                    <template v-slot:activator>
                        <v-list-item-title>{{ $t('ligfinder.aoi.administrative.selectByName') }}</v-list-item-title>
                    </template>
                    
                    <template >
                        <v-list-item v-for="item in $store.state.administrativeAOI.adminStates"  :key="item.name" class="items">
                            
                            <v-checkbox :input-value="$store.state.criteria.active" :id="String(item.name)" @change="getcheckedAdmin(item)"></v-checkbox>
                            <v-list-item-title v-text="item.name">
                            </v-list-item-title>
                            
                        </v-list-item>
                    </template>
                </v-list-group>
            </v-card>
            <!--<div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getSelectedFeatures(); resetAdminLayers() " :disabled='$store.state.administrativeAOI.selectedFeatures.length==0'>Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="resetSelectedFeatures()" :disabled="$store.state.ligfinder.FOI.features.length==0">Filter Zurücksetzen </button>
            </div>-->
            
            <v-btn
                class="mx-2 mt-3"
                fab
                dark
                x-small
                outlined
                color="green"
                @click="addToAOIList"
                :disabled="$store.state.administrativeAOI.selectedFeatures.length==0"
            >
                <v-icon dark>
                    mdi-plus
                </v-icon>
            </v-btn>
            <v-btn
                class="mx-2 mt-3"
                fab
                dark
                x-small
                outlined
                color="red"
                @click="deleteSelectedFeatures"
                :disabled="$store.state.administrativeAOI.selectedFeatures.length==0"
            >
                <v-icon dark>
                    mdi-minus
                </v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdministrativeAOI",
    data(){
        return{
        }
    },
    methods:{
        getAdminArea(event){
            this.$store.dispatch("administrativeAOI/getAdminArea", event)
        },
        resetSelectedFeatures(){
            this.$store.dispatch("administrativeAOI/resetSelectedLayers")
        },
        getSelectedFeatures(){
            this.$store.dispatch("administrativeAOI/getSelectedFeatures")
        },
        resetAdminLayers(){
            this.$store.dispatch("administrativeAOI/resetAdminLayers")
        },
        getcheckedAdmin(item){
            //this.$store.dispatch("administrativeAOI/getcheckedAdmin", item)
            let checkval = document.getElementById(item.name).checked
            document.getElementById(item.name).checked =! checkval
            if (document.getElementById(item.name).checked==true){
                this.$store.dispatch("administrativeAOI/addCheckedAdmin", item)
            }
            else if (document.getElementById(item.name).checked==false){
                this.$store.dispatch("administrativeAOI/removeCheckedAdmin", item)
            }
        },
        addToAOIList(){
            this.$store.dispatch("AOI/addAdminAreaToAOIList")
        },
        deleteSelectedFeatures(){
            this.$store.dispatch("administrativeAOI/deleteSelectedFeatures")
        }
       
    }
}
</script>

<style scoped>
.mx-auto{
    overflow-y: scroll ;
}
.mx-auto::-webkit-scrollbar {
  display: none;
}
</style>