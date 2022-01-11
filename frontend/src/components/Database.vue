<template>
    <div>
        <table style="max-height: 100px;overflow: scroll;" class="table table-sm table-hover table-bordered table-nonfluid " v-show="$store.state.database.toggle">
            
            <tbody>
                <tr v-for="table in $store.state.database.tableNames" :key="table.id">
                    <td >
                        <button :id="table.name" class="btn btn-sm" @click= "addTable(table); buttonDeactivation(table.name);">
                            <i :id="table.name+'icon'" style="color:green" class="fa fa-plus" aria-hidden="true">
                            </i>
                        </button>
                    </td>
                    <td style="padding-left:1vw; padding-right: 1vw">{{table.name}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Database",
        methods:{
            addTable(table){
                this.$store.dispatch('database/addTable', table)
            },
            buttonDeactivation(e){
                document.getElementById(e).disabled=true;
                document.getElementById(e+'icon').style.color= 'grey'
            },
            
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
        left:1.8vw;
    }

    .table td{
        vertical-align: middle;
    }

    .table-nonfluid {
        width: auto !important;

    }
    .btn{
        outline: none;
        border-style: none;
        background-color:transparent;
    }
    .btn:focus{
        box-shadow: none !important;
    }
</style>