<template>
    <div>
        <v-dialog v-model="deleteDialog" max-width="35vw" >
          <v-card>
            <v-card-title class="text-h6">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-select
          :items="$store.state.AOI.items"
          label="AoI Mode"
          outlined
          item-text="name"
          item-value="value"
          
          v-model="$store.state.AOI.selectMode"
          @change="test"
        ></v-select>
        <AdministrativeAOI v-if="$store.state.AOI.selectMode==='administrative'" />
        <GeometryAOI v-if="$store.state.AOI.selectMode==='geometry'" />
        <IsochroneAOI v-if="$store.state.AOI.selectMode==='isochrone'" />
        <v-simple-table class="mb-4 mt-4" v-if="$store.state.AOI.AOIs[0].data!==null || $store.state.AOI.AOIs[1].data!==null || $store.state.AOI.AOIs[2].data!==null">
            <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        Name
                    </th>
                    
                    <th class="text-left">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in $store.state.AOI.AOIs"
                :key="item.name"
                >
                    <td v-if="item.data!=null">{{ item.name }}</td>
                    <td v-if="item.data!=null">
                        
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
        <div v-if="$store.state.AOI.AOIs[0].data!=null || $store.state.AOI.AOIs[1].data!=null || $store.state.AOI.AOIs[2].data!=null">

            <v-select
                :items="$store.state.AOI.operators"
                v-model="$store.state.AOI.selectedOperator"
                label="operation"
                solo
                class="select-operator"
            >
            </v-select>
            <button style="font-size: 0.8vw" class="btn btn-info mb-4 mt-4" @click="getParcels()">Suche Starten</button>
            <v-expand-transition><span v-show="$store.state.AOI.expand">total Area</span></v-expand-transition>
        </div>
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
        test(v){
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
    }
}
</script>

<style scoped>

</style>