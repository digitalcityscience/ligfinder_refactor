<template>
    
    <div v-if="$store.state.ligfinder.FOI.features[0]" class= "table-responsive">
        <v-data-table
            :headers="$store.state.ligfinder.resultHeaders"
            :items="$store.state.ligfinder.resultItems"
            item-key="afl"
            :disable-filtering="true"
            :disable-sort="true"
            :items-per-page="10"
            @click:row="zoomToSelectedFeature"
        ></v-data-table>
        <v-row class="px-1 mt-2">
           <div class="column text-capitalize">
            <v-select
                :items="$store.state.results.saveReultsItems"
                :label="$t('ligfinder.results.save')"
                solo
                item-text="name"
                item-value="value"
                v-model="$store.state.results.saveReultsMode"
                class="mt-2"  
        >
        </v-select>
        </div> 
        </v-row>
        <v-row class="px-1">
            <div class="column text-capitalize">
                <v-select
                        v-if="$store.state.results.saveReultsMode=='export'"
                        :items="$store.state.results.exportItems"
                        :label="$t('ligfinder.results.export')"
                        solo
                        item-text="name"
                        item-value="value"
                        v-model="$store.state.results.exportMode"
                        @change="exportResult"     
                >
                </v-select>
            </div>
        </v-row>
        <v-row class="px-1">
            <div class="column" v-if="$store.state.results.saveReultsMode=='save'">
                <v-text-field
                    v-if="$store.state.user.loggedIn"
                    v-model="$store.state.results.description"
                    :append-outer-icon="'mdi-floppy' "
                    filled
                    clear-icon="mdi-close-circle"
                    clearable
                    :label="$t('ligfinder.results.desc')"
                    type="text"
                    @keyup.enter="saveData"
                    @click:append-outer="saveData"
                    @click:clear="clearMessage"
                ></v-text-field>
                <v-alert
                    v-else
                    dense
                    outlined
                    type="error"
                >
                    {{$t('ligfinder.results.error')}}
                </v-alert>
            </div>
        </v-row>        
    </div>
    <div v-else class="text-center">
        <p>{{$t('ligfinder.results.noFeature')}}</p>
    </div>

</template>

<script>

export default {
name: "Results",
    data () {
        return {
            marker: true,
            iconIndex: 0,
        }
    },
    computed: {
      
    },
    methods:{
        zoomToSelectedFeature(row)
        {
            this.$store.dispatch('results/zoomToSelectedFeature', row.gid)
        },
        exportResult(e){
            if (e=='json'){
                this.$store.dispatch('results/exporResultsJson')
            }
            // else if (e=='json'){
            //     this.$store.dispatch('results/exporResultsSHP')
            // }
            else {
                this.$store.dispatch('results/exporResultsCSV')
            }
        },
        
        saveData () {
            this.resetIcon()
            this.$store.dispatch('results/saveData')
            this.clearMessage()
        },
        clearMessage () {
            this.$store.state.results.description = null
        },
        resetIcon () {
            this.iconIndex = 0
        },
        

    }
}
</script>

<style scoped>

.table tr:hover {
    cursor: pointer;
}
@media screen and (min-width: 1500px) {
   .column{
    width: 50%;
   }
}
@media screen and (max-width: 1499px) {
   .column{
    width: 100%;
   }
}
</style>