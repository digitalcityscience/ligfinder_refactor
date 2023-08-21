<template>
    
    <div v-if="$store.state.ligfinder.FOI.features[0]" class= "table-responsive">
        <table id="datatable" class="table table-hover ">
            <thead >
                <tr >
                    <th v-for="i in Object.keys($store.state.ligfinder.FOI.features[0].properties)" :key="i.afl">{{i}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in $store.state.ligfinder.FOI.features" :key="i.gid" @click="zoomToSelectedFeature(i.properties.gid)">
                    <td v-for="j in Object.keys($store.state.ligfinder.FOI.features[0].properties)" :key="j.afl">
                        {{i.properties[j]}}
                    </td>
                </tr>
                
            </tbody>
        </table>


        <v-select
                :items="$store.state.results.saveReultsItems"
                :label="$t('ligfinder.results.save')"
                solo
                item-text="name"
                item-value="value"
                style="width:40%"
                v-model="$store.state.results.saveReultsMode"
                
                :style="{marginTop:'8vh'}"   
        >
        </v-select>
        <v-row>
            <v-col cols="12">
                <v-select
                        v-if="$store.state.results.saveReultsMode=='export'"
                        :items="$store.state.results.exportItems"
                        :label="$t('ligfinder.results.export')"
                        solo
                        item-text="name"
                        item-value="value"
                        style="width:50%"
                        v-model="$store.state.results.exportMode"
                        @change="exportResult"
                                  
                >
                </v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" v-if="$store.state.results.saveReultsMode=='save'">
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
            </v-col>
        </v-row>        
    </div>
    <div v-else class="text-center">
        <p>{{$t('ligfinder.results.noFeature')}}</p>
    </div>

</template>

<script>
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

export default {
name: "Results",
    data () {
        return {
            marker: true,
            iconIndex: 0,
        }
    },
    mounted(){
        $.extend( $.fn.dataTable.defaults, {
            searching: false,
        } );
        $('#datatable').DataTable();
    },
    computed: {
      
    },
    methods:{
        zoomToSelectedFeature(gid){
            this.$store.dispatch('results/zoomToSelectedFeature', gid)
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
.table{
    display: block !important;
    overflow-x: auto !important;
    overflow-y: auto !important;
    width: 100% !important;
    max-height:70vh;
    font-size: 0.6vw;
}
.table tr {
    cursor: pointer;
}
table.dataTable tbody td {
    border-bottom: 1px solid rgba(0, 0, 0, .2);
}



</style>