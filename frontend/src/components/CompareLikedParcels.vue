<template>
  <v-card v-if="$store.state.compareLikedParcels.toggle" class="compare">
    <v-card-title>
            <v-btn
                icon
                @click="closeCompareTable"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
    </v-card-title>
    <v-card-text>
        <table class="table table-hover">
            <thead>
                <tr valign="center">
                        <th class="text-capitalize">{{$t('compareParcels.attr')}}</th>
                        <th  v-for="i in $store.state.compareLikedParcels.likedParcelsJsonResponse.features" :key="i.properties.gid">
                            <v-btn @click="zoomToLikedParcel(i.properties.gid)" color="primary" dark>{{$t('compareParcels.zoomTo')}}</v-btn>
                        </th>

                </tr>
            </thead>
        
            <tbody>
                <tr valign="center" class="data-row" v-for="i in Object.keys($store.state.compareLikedParcels.likedParcelsJsonResponse.features[0].properties)" :key="i.afl">
                    <th class="attrs">{{i}}</th>
                    <th class="values" v-for="j in ($store.state.compareLikedParcels.likedParcelsJsonResponse.features)" :key="j.afl">
                    {{j.properties[i]}}
                    </th>
                </tr>
                
            </tbody>
        </table>
       
    </v-card-text>
        
    </v-card>
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
        background-color: rgba(255, 255, 255, 1);
        margin-left:auto;
        height: 100%;
        max-width:30vw;
        overflow-y: auto;
        pointer-events: all;
    }
.data-row{
    line-height: 1.375rem;
    height: 45px;
}
.data-row>.values{
    font-weight: 400;
}
@media screen and (max-width: 1600px ) {
    .compare{
        max-width:50vw;
    }
    .data-row{
        line-height: 1rem;
        height: 36px;
    }
}
    .table{
        margin-left: 5px;
        margin-right: 5px
    }
</style>