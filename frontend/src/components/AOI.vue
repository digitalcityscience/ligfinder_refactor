<template>
    <div>
        <v-dialog v-model="deleteDialog" max-width="35vw" >
          <v-card>
            <v-card-title class="text-h6">{{ $t('ligfinder.aoi.delete') }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">{{ $t('ligfinder.aoi.cancel') }}</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t('ligfinder.aoi.ok') }}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card class="input-group">
            <v-card-title class="text-subtitle-1">{{ $t('ligfinder.aoi.title') }}</v-card-title>
            <v-card-text>
                <v-select
                  :items="$store.state.AOI.items"
                  :label="$t('ligfinder.aoi.mode')"
                  solo
                  item-text="name"
                  item-value="value"
          
                  v-model="$store.state.AOI.selectMode"
                  @change="toggleAOIModes"
                ></v-select>
            </v-card-text>
        </v-card>
        
        <AdministrativeAOI v-if="$store.state.AOI.selectMode==='administrative'" />
        <GeometryAOI v-if="$store.state.AOI.selectMode==='geometry'" />
        <IsochroneAOI v-if="$store.state.AOI.selectMode==='isochrone'" />
        <v-card class="mt-lg-2 mt-xl-3" v-if="$store.state.AOI.AOIs[0].data !== null || $store.state.AOI.AOIs[1].data !== null || $store.state.AOI.AOIs[2].data !== null">
            <v-card-text>
                <v-simple-table class="mb-4 mt-4" >
                <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left text-capitalize">
                            {{ $t('ligfinder.aoi.name') }}
                        </th>
                    
                        <th class="text-left text-capitalize">
                            {{ $t('ligfinder.aoi.action') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in $store.state.AOI.AOIs"
                    :key="item.name"
                    >
                        <td v-if="item.data != null">
                            <p class="text-body-1 mb-0">{{ item.name }}</p>
                            <p class="text-caption" v-if="item.value == 'administrative'">{{ concatNames(item.data) }}</p>
                        </td>
                        <td v-if="item.data != null">
                            <v-icon
                                small
                                @click="deleteItem(item.value)"
                            >
                            mdi-delete
                            </v-icon>
                        </td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
            <div class="d-flex flex-column">
                <v-select
                    :items="$store.state.AOI.operators"
                    v-model="$store.state.AOI.selectedOperator"
                    :label="$t('ligfinder.aoi.operation')"
                    solo
                    class="select-operator"
                >
                </v-select>
                <v-btn v-if="!$store.state.filtering.appliedAOIFilter" light color="primary" class="mt-4 flex-lg-grow-1 align-self-lg-auto align-self-xl-start" @click="getParcels()">{{ $t('ligfinder.aoi.search') }}</v-btn>     
                <v-btn v-else light color="primary" class="mt-4 flex-lg-grow-1 align-self-lg-auto align-self-xl-start" @click="$store.dispatch('filtering/filterHandler')">{{ $t('ligfinder.filter') }}</v-btn>       
            </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import AdministrativeAOI from "./AdministrativeAOI"
import GeometryAOI from "./GeometryAOI"
import IsochroneAOI from "./IsochroneAOI"

export default {
    name: "AOI",
    components: {
        AdministrativeAOI,
        GeometryAOI,
        IsochroneAOI,
    },
    data(){
        return{
            buildingSwitch: false,
            deleteDialog: false,
            deleteItemValue: null,
        }
    },
  
    methods:{
        toggleAOIModes(v){
            if (v==="geometry"){
                this.$store.dispatch("administrativeAOI/resetAdminLayers")
            }
            else if (v==="isochrone"){
                this.$store.dispatch("administrativeAOI/resetAdminLayers")
                this.$store.dispatch("geometryAOI/removeDrawControl")
            }
            else if (v==="administrative" ){
                this.$store.dispatch("geometryAOI/removeDrawControl")
            }
        },
        getParcels(){
            if (this.$store.state.AOI.selectedOperator== "Union"){
                this.$store.dispatch("AOI/getUnionParcels")
            }
            else{
                this.$store.dispatch("AOI/getIntersectParcels")
            }
            
        },
        deleteItem(value){
            this.deleteItemValue= value
            this.deleteDialog = true
        },
        closeDelete(){
            this.deleteDialog = false
        },
        deleteItemConfirm(){
            this.deleteDialog=false
            this.$store.dispatch("AOI/deleteItemConfirm", this.deleteItemValue)
        },
        concatNames(data){
            let concat = []
            data.forEach((item)=>{
                concat.push(item.name)
            })
            return concat.join(', ')
        }
        
    }
}
</script>

<style scoped>
.v-card.input-group{
    box-shadow: none;
}
</style>