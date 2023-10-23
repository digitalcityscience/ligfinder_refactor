<template>

<div v-if="$store.state.ligfinder.FOI.features[0]" class="criteria-container">
    <v-card class="criteria-list-card">
        <v-sheet class="pa-4 primary">
        <v-text-field
            v-model="search"
            label="Search criteria"
            dark
            flat
            solo-inverted
            hide-details
            clearable
            clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        </v-sheet>
        <v-card-text class="scrollable-treeview">
            <v-treeview
            :items="$store.state.criteria.criteria.items"
            :search="search"
            >
            <template v-slot:append="{ item }">
                <v-btn
                    color="green"
                    dark
                    icon
                    v-if="!item.children"
                    @click="addToIncludedTags(item)"
                >
                    <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn
                    color="red"
                    dark
                    icon
                    v-if="!item.children"
                    @click="addToExcludedTags(item)"
                >
                    <v-icon>mdi-thumb-down</v-icon>
                </v-btn>
            </template>
            </v-treeview>
        </v-card-text>
    </v-card>
    <v-card class="mt-2">
        <v-card-subtitle class="text-subtitle-1 text-capitalize">{{ $t('ligfinder.criteria.included') }}</v-card-subtitle>
        <v-card-text>
            <v-select
                :items="$store.state.criteria.operators"
                v-model="$store.state.criteria.selectedOperator"
                :label="$t('ligfinder.criteria.logical')"
                solo
            ></v-select>
            <template>
                <v-chip  v-for="tag in $store.state.criteria.includeTags" :key="tag.name"
                    class="ma-1"
                    color="green"
                    outlined
                    close
                    @click:close="removeFromIncludedTags(tag)"
                >
                    {{tag.name}}
                </v-chip>
            </template>
        </v-card-text>
    </v-card>
    <v-card class="mt-2">
        <v-card-subtitle class="text-subtitle-1 text-capitalize">{{ $t('ligfinder.criteria.excluded') }}</v-card-subtitle>
        <v-card-text>
            <template>
                <v-chip  v-for="tag in $store.state.criteria.excludeTags" :key="tag.name"
                    class="ma-1"
                    color="red"
                    outlined
                    close
                    @click:close="removeFromExcludedTags(tag)"
                >
                    {{tag.name}}
                </v-chip>
            </template>
        </v-card-text>
    </v-card>
    <div class="mt-4 mb-4" >
        <v-btn light color="primary" class="mt-4 col-4 flex-lg-grow-1 align-self-lg-auto align-self-xl-start" @click="$store.dispatch('filtering/filterHandler')">{{ $t('ligfinder.filter') }}</v-btn>
    </div>
</div>
<div v-else class="text-center">
    <p>{{ $t('ligfinder.criteria.noFeature') }}</p>

</div>
</template>

<script>

export default {
    name: "Criteria",
    components: {
    },
    
    data(){
        return{
            selection:[],
            search:null
        }
    },
    methods:{
        addToIncludedTags(item){
            let value = item.filterType==="value" ? item.value : [0,100]
            let obj ={"name":item.name, "columns":item.columns, "filterType":item.filterType, "value":value}
            this.$store.dispatch('criteria/add2IncludeTags',obj)
            console.log(obj)
        },
        addToExcludedTags(item){
            let value = item.filterType==="value" ? item.value : [0,100]
            let obj ={"name":item.name, "columns":item.columns, "filterType":item.filterType, "value":value}
            this.$store.dispatch('criteria/add2ExcludeTags',obj)
            console.log(obj)
        },
        removeFromIncludedTags(tag){
            this.$store.dispatch('criteria/removeFromIncludeTags',tag)
        },
        removeFromExcludedTags(tag){
            this.$store.dispatch('criteria/removeFromExcludeTags',tag)

        },
        criteriaFilter(){
            this.$store.dispatch('criteria/criteriaFilter')

        },
        applyCriteriaFilter(){
            this.$store.dispatch('criteria/applyCriteriaFilter')

        }


    }
    


}
</script>

<style scoped>
.scrollable-treeview{
    max-height: 29vh;
    overflow-y: scroll;
}
.addedcriteria{
    max-height:20vh;
    overflow-y: scroll;
}
.addedcriteria::-webkit-scrollbar {
  display: none;
}
@media screen and (min-width: 1500px) {
    .criteria-list-card{
        max-height: 35vh;
}
}
@media screen and (max-width: 1499px) {
    .criteria-list-card{
        max-height: 50vh;
}
}

</style>