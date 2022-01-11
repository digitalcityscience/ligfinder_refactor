<template>
    <table v-show="$store.state.tools.toggle"  class="table table-sm table-hover table-nonfluid">
        
        <tbody>
            <tr class="tools-icon" @click="ligTool">
                <td id="ligfinder-tool-icon " style="padding-left: 1vw;padding-right: 1vw; cursor:pointer">
                <i class="fas fa-sort-amount-up-alt fa-lg"></i> LIG Finder
                </td>
            </tr>
            <tr class="tools-icon" @click="geoparsingTool">
                <td id="ligfinder-tool-icon" style="padding-left: 1vw;padding-right: 1vw; cursor:pointer">
                <i class="fas fa-search-location fa-lg"></i> Geo-Parsing
                </td>
            </tr>
            <tr class="tools-icon" @click="classificationTool">
                <td id="ligfinder-tool-icon" style="padding-left: 1vw;padding-right: 1vw; cursor:pointer">
                <i class="fas fa-sitemap fa-lg"></i> Classification
                </td>
            </tr>
        </tbody>
       
    </table>
</template>

<script>
export default {
    name: "Tools",
    methods:{
        ligTool(){
           this.$store.commit('tools/setToolsToggle')
           this.$store.commit('ligfinder/setLigfinderToggle')
         
        },
        geoparsingTool(){
           this.$store.commit('tools/setToolsToggle')
           this.$store.commit('geoparsing/setGeoparsingToggle')
         
        },
        classificationTool(){
           this.$store.commit('tools/setToolsToggle')
           this.$store.commit('classification/setClassificationToggle')
         
        }
    }
}
</script>

<style scoped>
    .table{
        position: absolute;
        font-family: 'Nunito', sans-serif;
        font-weight:800;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 999;
        left:1.9vw;
        width: 20vw;
    }
    .table-nonfluid {
        width: auto !important;

    }
   
</style>