<template>
    <div  class="administrative-select">
        <div style="width:60%; margin-top: 10%">
            <label for="">Verwaltungsebene</label>
            <select @change="getAdminArea($event); resetSelectedFeatures()"  name="administrative"  class="form-select form-control">
                <option value="" disabled selected hidden>Bitte Verwaltungsebene auswählen</option>
                <option value="bezirke" >Bezirke</option>
                <option value="stadtteile">Stadtteile</option>
                <option value="gemarkungen">GemarKungen</option>  
                <option value="statistischegebiete">Statistische Gebiete</option>  
            </select>
            <v-card
                class="mx-auto mt-4"
                max-height="30vh"
    
            >
                <v-list-group
                    :value="false"
                
                >
                    <template v-slot:activator>
                        <v-list-item-title>select area by name </v-list-item-title>
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
            <div class="mt-4" >
                <button style="font-size: 0.8vw" class="btn btn-info" @click="getSelectedFeatures(); resetAdminLayers()">Suche Starten</button>
                <button  style="font-size: 0.8vw" class="btn btn-secondary mx-3" @click="resetSelectedFeatures()">Filter Zurücksetzen </button>
            </div>
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
                this.$store.dispatch("administrativeAOI/getAdminArea", event.target.value)
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
        }
       
    }
}
</script>

<style scoped>
.mx-auto{
    overflow-y: scroll ;
}
</style>