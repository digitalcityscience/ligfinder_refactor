<template>
    
    <div v-if="$store.state.ligfinder.FOI.features[0]" class= "table-responsive">
        <table id="datatable" class="table table-hover ">
            <thead >
                <tr >
                    <th v-for="i in Object.keys($store.state.ligfinder.FOI.features[0].properties)" :key="i.afl">{{i}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in $store.state.ligfinder.FOI.features" :key="i.properties.gid" @click="zoomToSelectedFeature(i.properties.gid)">
                    <td v-for="j in Object.keys($store.state.ligfinder.FOI.features[0].properties)" :key="j.afl">
                        {{i.properties[j]}}
                    </td>
                </tr>
                
            </tbody>
        </table>
        <div class = "export-result-table" >
          <button type="button" class="btn btn-outline-secondary mt-4 mb-4" @click="exporResultsJson">Export JSON
              <i class="fas fa-cloud-download-alt"></i>
          </button>
          <button type="button" class="btn btn-outline-secondary mt-4 mb-4 ml-2" @click="exporResultsSHP">Export SHP
              <i class="fas fa-cloud-download-alt"></i>
          </button>
        </div>
        
    </div>
    <div v-else class="text-center">
        <p>No Feature Selected</p>
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

        }
    },
    mounted(){
        $.extend( $.fn.dataTable.defaults, {
            searching: false,
        } );
        $('#datatable').DataTable();
    },
    methods:{
        zoomToSelectedFeature(gid){
            this.$store.dispatch('results/zoomToSelectedFeature', gid)
    },
    exporResultsJson(){
        this.$store.dispatch('results/exporResultsJson')
    },
    exporResultsSHP(){
        this.$store.dispatch('results/exporResultsSHP')
    }
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