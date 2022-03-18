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
  <v-dialog v-model="editDialog" max-width="35vw">
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit</span>
            </v-card-title>
            <v-col cols="12">
                <v-text-field
                  label="Description"
                  v-model="DescriptionToBeEdited"
                  required
                ></v-text-field>
            </v-col>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeEdit" >Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="editItemConfirm">Save</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
  </v-dialog>
  <table class="table table-hover" v-if="$store.state.user.userSavedResults">
      <thead>
        <tr >
            <th class="no-sort">restore</th>
            <th >name</th>
            <th class="no-sort">description</th>
            <th class="no-sort">actions</th>
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
                  @click="editItem(result.name, result.description)"
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
        deleteItemName: null,
        editDialog: false,
        DescriptionToBeEdited: null,
        nameOfTheColumnToBeEdited: null
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
      editItem(name, description){
        this.nameOfTheColumnToBeEdited = name
        this.DescriptionToBeEdited = description
        this.editDialog=true
      },
      closeEdit(){
        this.editDialog=false
      },
      editItemConfirm(){
        this.editDialog=false
        this.$store.dispatch("savedResultsTable/editItemConfirm", {name: this.nameOfTheColumnToBeEdited, description: this.DescriptionToBeEdited, id: this.$store.state.user.id})
      }
    }
  }
</script>

<style scoped>

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