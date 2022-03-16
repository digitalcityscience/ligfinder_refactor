<template>
<div>
  <v-dialog v-model="deleteDialog" max-width="35vw">
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
  <table class="table table-hover " v-if="$store.state.user.userSavedResults">
      <thead>
        <tr >
            <th>restore</th>
            <th >name</th>
            <th >description</th>
            <th >actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in $store.state.user.userSavedResults" :key="result.name" >
          <td >
            <v-icon
                small
                @click="getSavedParcelInstances(result.gids)"
            >
              mdi-restore
            </v-icon>
          </td>
          <td>{{result.name}}</td>
          <td>{{result.description}}</td>
          <td>
            <v-icon
                  small
                  class="mr-2"
                  @click="editItem"
                >
                mdi-pencil
              </v-icon>
            <v-icon
              small
              @click="deleteItem(result.name)"
            >
              mdi-delete
            </v-icon>
          </td>
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
    data () {
      return {
        deleteDialog: false,
        deleteItemName: null
      }
    },
    methods:{
      getSavedParcelInstances(gids){
        this.$store.dispatch("savedResultsTable/getSavedParcelInstances", gids)
      },
      deleteItem(name){
        this.deleteItemName = name
        this.deleteDialog=true
      },
      closeDelete(){
        this.deleteDialog=false
      },
      deleteItemConfirm(){
        this.deleteDialog=false
        this.$store.dispatch("savedResultsTable/deleteItemConfirm", this.deleteItemName)
      },
      editItem(){
        console.log("edit")
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