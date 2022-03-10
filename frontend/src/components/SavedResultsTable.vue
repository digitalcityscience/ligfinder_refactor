<template>
<div>
    
  <table class="table table-hover " v-if="$store.state.user.userSavedResults">
      <thead>
        <tr >
            <th >name</th>
            <th >description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in $store.state.user.userSavedResults" :key="result.name" @click="getSavedParcelInstances(result.gids)">
          <td>{{result.name}}</td>
          <td>{{result.description}}</td>
        </tr>
      </tbody>
  </table>
  <div v-else>
    <span>No Result History</span>
  </div>

    
</div>
</template>

<script>
  export default {
    methods:{
      getSavedParcelInstances(gids){
        this.$store.dispatch("savedResultsTable/getSavedParcelInstances", gids)
      }
    }
  }
</script>

<style scoped>
tbody tr:hover{
  cursor: pointer;
}
.table{
    display: block !important;
    overflow-x: auto !important;
    overflow-y: scroll !important;
    width: 100% !important;
    max-height:50vh;
}
.table::-webkit-scrollbar {
  display: none;
}
</style>