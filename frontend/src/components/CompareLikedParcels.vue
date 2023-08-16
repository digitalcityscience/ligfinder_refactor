<template>
  <div v-if="$store.state.compareLikedParcels.toggle" class="compare">
        <div class=" mb-2 mt-1 mr-2">
            <i
                class="fas fa-times" 
                style="cursor: pointer; position: absolute; left: 1%"
                @click="closeCompareTable"   
            >
            </i>
        </div>
        <table class="table table-hover">
            <thead>
                <tr align="center" valign="center">
                        <th>{{$t('compareParcels.attr')}}</th>
                        <th  v-for="i in $store.state.compareLikedParcels.likedParcelsJsonResponse.features" :key="i.properties.gid">
                            <button @click="zoomToLikedParcel(i.properties.gid)" class="btn btn-outline-info btn-sm">{{$t('compareParcels.zoomTo')}}</button>
                        </th>

                    </tr>
            </thead>
        
            <tbody>
            
                <tr align="center" valign="center" v-for="i in Object.keys($store.state.compareLikedParcels.likedParcelsJsonResponse.features[0].properties)" :key="i.afl">
                    {{i}}
                    <th v-for="j in ($store.state.compareLikedParcels.likedParcelsJsonResponse.features)" :key="j.afl">
                    {{j.properties[i]}}
                    </th>
                </tr>
                
            </tbody>
        </table>
       
  </div>
</template>

<script>
export default {
    name: 'CompareLikedParcels',
    methods:{
        zoomToLikedParcel(gid){
            this.$store.dispatch('compareLikedParcels/zoomToLikedParcel', gid)            
        },
        closeCompareTable(){
            this.$store.commit('compareLikedParcels/closeCompareTable')
        }
    }
}
</script>

<style scoped>
.compare{
        position: absolute;
        font-family: 'Nunito', sans-serif;
        font-weight:800;
        background-color: rgba(255, 255, 255, 1);
        z-index: 999;
        right:0;
        height: 100%;
        max-width:30vw;
        overflow: auto;
    }
    
    .table{
        margin-left: 5px;
        margin-right: 5px
    }
</style>