<template>

<div>
    <v-card
    class="mx-auto"
    max-height="50vh"
    
    >
        <v-container fluid>
    
        <v-list-group
            :value="false"
        >
            <template v-slot:activator>
            <v-list-item-title>Kriterien</v-list-item-title>
            </template>
                <v-list-group
                    :value="false"
                    no-action
                    sub-group
                    v-for="item in $store.state.criteria.criteria.items"
                    :key="item.id"
                    :id="item.id"
                    @click="getId(item.name)"
                >
                    <template v-slot:activator>
                        <v-list-item>
                            <v-list-item-action>
                                <v-checkbox :input-value="$store.state.criteria.active"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-title v-text="item.name">
                            </v-list-item-title>
                            
                        </v-list-item>
                    </template>

                        <!-------------------children----------------->
                        <template v-for="child1 in item.children">
                            <v-list-group
                                :value="false"
                                no-action
                                sub-group
                                v-if="child1.children" 
                                :key="child1.id"
                                
                            >
                                <template v-slot:activator>
                                    <v-list-item >
                                        <v-list-item-action>
                                            <v-checkbox :id="(child1.id).toString()" :input-value="$store.state.criteria.active" ></v-checkbox>
                                        </v-list-item-action>
                                        <v-list-item-title v-text="child1.name">
                                        </v-list-item-title>
                                        
                                    </v-list-item>
                                </template>
                                <template v-for="child2 in child1.children">
                                    <v-list-group
                                    :value="false"
                                    no-action
                                    sub-group
                                    v-if="child2.children" 
                                    :key="child2.id"
                                    
                                    >
                                        <template v-slot:activator>
                                            <v-list-item class="child2">
                                                <v-list-item-action>
                                                    <v-checkbox :id="(child2.id).toString()" :input-value="$store.state.criteria.active" ></v-checkbox>
                                                </v-list-item-action>
                                                <v-list-item-title v-text="child2.name">
                                                </v-list-item-title>
                                                
                                            </v-list-item>
                                        </template>
                                        <template v-for="child3 in child2.children">
                                            <v-list-group
                                                :value="false"
                                                no-action
                                                sub-group
                                                v-if="child3.children" 
                                                :key="child3.id"
                                    
                                            >
                                                <template v-slot:activator>
                                                    <v-list-item class="child3">
                                                        <v-list-item-action>
                                                            <v-checkbox :id="(child3.id).toString()" :input-value="$store.state.criteria.active" ></v-checkbox>
                                                        </v-list-item-action>
                                                        <v-list-item-title v-text="child3.name">
                                                        </v-list-item-title>
                                                        
                                                    </v-list-item>
                                                </template>
                                                <template v-for="child4 in child3.children">
                                                    <v-list-item
                                                        v-if="child4.children==null" 
                                                        :key="child4.id"
                                                        class="child4"
                                                        >
                                                            <v-list-item-action>
                                                                <v-checkbox :id="(child4.id).toString()" :input-value="$store.state.criteria.active" @change="getchecked(child4)" ></v-checkbox>
                                                            </v-list-item-action>
                                                            <v-list-item-title v-text="child4.name">
                                                            </v-list-item-title>
                                                    
                                                    </v-list-item>
                                                </template>
                                            </v-list-group>
                                        </template>
                                        <template v-for="child3 in child2.children">
                                            <v-list-item
                                                v-if="child3.children==null" 
                                                :key="child3.id"
                                                class="child4"
                                                >
                                                    <v-list-item-action>
                                                        <v-checkbox :id="(child3.id).toString()" :input-value="$store.state.criteria.active" @change="getchecked(child3)" ></v-checkbox>
                                                    </v-list-item-action>
                                                    <v-list-item-title v-text="child3.name">
                                                    </v-list-item-title>
                                            
                                            </v-list-item>
                                        </template>

                                    </v-list-group>
                                
                                </template>
                                <template v-for="child2 in child1.children">
                                   <v-list-item
                                    v-if="child2.children==null" 
                                    :key="child2.id"
                                    class="child3"
                                    >
                                        <v-list-item-action>
                                            <v-checkbox :id="(child2.id).toString()" :input-value="$store.state.criteria.active" @change="getchecked(child2)" ></v-checkbox>
                                        </v-list-item-action>
                                        <v-list-item-title v-text="child2.name">
                                        </v-list-item-title>
                                
                                    </v-list-item>
                                </template>
                               
                            
                            </v-list-group>
                            
                            

                        </template>
                        <template v-for="child1 in item.children" >
                            <v-list-item
                                v-if="child1.children==null" 
                                :key="child1.id"
                                class="child1"
                            >
                                <v-list-item-action>
                                    <v-checkbox :id="(child1.id).toString()" :input-value="$store.state.criteria.active" @change="getchecked(child1)" ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-title v-text="child1.name">
                                </v-list-item-title>
                                
                            </v-list-item>
                        </template>
                        
                </v-list-group>
        
        </v-list-group>
        
        </v-container>
        
    </v-card >
    <v-card>
        <v-container class="mt-2 addedcriteria"  >
            <p class="mt-1 ml-1">Marked Criteria</p>
            <template v-for="tag in $store.state.criteria.checkedTags">
                <v-chip :draggable="true" v-if="$store.state.criteria.checkedTags.length" :key="tag.name"
                    class="ma-1"
                    @dragstart="startDrag($event, tag)"
                    color="blue"
                    outlined

                >
                    {{tag.name}}
                </v-chip>
            </template>
           
        </v-container>
        

    </v-card>
    <v-card>
        <v-container class="mt-2 addedcriteria" >
           
            <div @drop="onDrop($event)"  @dragenter.prevent @dragover.prevent>
                <p class="mt-1 ml-1">Included Criteria</p>
                <template v-for="tag in $store.state.criteria.includeTags">
                <v-chip :key="tag.name"
                    @dragstart="startDrag($event, tag)"
                    :draggable="true"
                    class="ma-1"
                    color="green"
                    outlined
                    close
                    @click:close="removeTagFromIncludedTags(tag)"

                >
                    {{tag.name}}
                </v-chip>
            </template>

            </div>
        </v-container>
    </v-card>
    <v-card>
        <v-container class="mt-2 mb-2 addedcriteria" >
           
            <div @drop="onDropExcluded($event)" @dragenter.prevent @dragover.prevent>
                <p class="mt-1 ml-1">Excluded Criteria</p>
                <template v-for="tag in $store.state.criteria.excludeTags">
                <v-chip :key="tag.name"
                    @dragstart="startDrag($event, tag)"
                    :draggable="true"
                    class="ma-1"
                    color="red"
                    outlined
                    close
                    @click:close="removeTagFromExcludedTags(tag)"

                >
                    {{tag.name}}
                </v-chip>
            </template>

            </div>
        </v-container>
    </v-card>
    <div class="mt-4 mb-4" >
        <button style="font-size: 0.8vw" class="btn btn-info" @click="applyCriteria()">Suche Starten</button>
    </div>
</div>
</template>

<script>

export default {
    name: "Criteria",
    components: {
    },
    
    data(){
        return{

        }
    },
    methods:{
        getId(name){
            console.log(name)
        },
        
        getchecked(child){
            let checkval = document.getElementById(child.id).checked
            document.getElementById(child.id).checked =! checkval
           
            if (document.getElementById(child.id).checked==true){
                this.$store.state.criteria.checkedCriteria.push(child)
                this.$store.state.criteria.checkedTags.push(child)
            }
            else if (document.getElementById(child.id).checked==false){
                let index = this.$store.state.criteria.checkedCriteria.indexOf(child.id);
                let tag = this.$store.state.criteria.checkedTags.indexOf(child.name);
                if(index){
                    this.$store.state.criteria.checkedCriteria.splice(index, 1);
                    this.$store.state.criteria.checkedTags.splice(tag, 1);
                }

            }
            console.log("checkedCriteria", this.$store.state.criteria.checkedTags)
        },
        startDrag (event, item){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            //event.dataTransfer.setData('itemname', item.name)
            //event.dataTransfer.setData('itemcolumn', item.column)
            for (let key of (Object.keys(item))){
                event.dataTransfer.setData(key, item[key])
            }

        },
        onDrop(event){
            let includeTagsName = []
            let itemName = event.dataTransfer.getData("name")
            let itemColumn = event.dataTransfer.getData("columns")
            let filterType = event.dataTransfer.getData("filterType")
            let value
            if (filterType==="value"){
                value = event.dataTransfer.getData("value")
            }
            else{
                value = [0,100]
            }
            
            
            for (let i=0; i<this.$store.state.criteria.includeTags.length; i++){
                includeTagsName.push(this.$store.state.criteria.includeTags[i].name)
                
            }
            if(includeTagsName.includes(itemName)==false){
                this.$store.state.criteria.includeTags.push({"name":itemName, "columns":itemColumn, "filterType":filterType, "value":value})
            }
            
            // to avoid having same tags in excluded and included parts
            for (let i of this.$store.state.criteria.excludeTags){
                if(i.name === itemName){
                    console.log(i)
                    let index = this.$store.state.criteria.excludeTags.indexOf(i);
                    this.$store.state.criteria.excludeTags.splice(index, 1);
                }
            }


        },
        onDropExcluded(event){
            let excludeTagsName = []
            let itemName = event.dataTransfer.getData("name")
            let itemColumn = event.dataTransfer.getData("columns")
            let filterType = event.dataTransfer.getData("filterType")
            let value

            // in the config.json file we have percent and value filterType
            if (filterType==="value"){
                value = event.dataTransfer.getData("value")
            }
            else{
                value = [0,100]
            }
            
            for (let i=0; i<this.$store.state.criteria.excludeTags.length; i++){
                excludeTagsName.push(this.$store.state.criteria.excludeTags[i].name)
                
            }
            if(excludeTagsName.includes(itemName)==false){
                this.$store.state.criteria.excludeTags.push({"name":itemName, "columns":itemColumn, "filterType":filterType, "value":value})
            }

            // to avoid having same tags in excluded and included parts
            for (let i of this.$store.state.criteria.includeTags){
                if(i.name === itemName){
                    console.log(i)
                    let index = this.$store.state.criteria.includeTags.indexOf(i);
                    this.$store.state.criteria.includeTags.splice(index, 1);
                }
            }
            
            
            

        },
        removeTagFromIncludedTags(tagname){
            let tag = this.$store.state.criteria.includeTags.indexOf(tagname);
            this.$store.state.criteria.includeTags.splice(tag, 1);

        },
        removeTagFromExcludedTags(tagname){
            let tag = this.$store.state.criteria.excludeTags.indexOf(tagname);
            this.$store.state.criteria.excludeTags.splice(tag, 1);
            console.log(this.$store.state.criteria.excludeTags)

        },
        applyCriteria(){
            this.$store.dispatch('criteria/applyCriteria')

        }
        
        
    }
    


}
</script>

<style scoped>
.mx-auto{
    overflow-y: scroll;
    
}
.child1{
    margin-left: 2vw;
   
}
.child2{
    margin-left: 3vw;
   
}
.child3{
    margin-left: 6vw;
   
}
.child4{
    margin-left: 10vw;
   
}
.addedcriteria{
    max-height:20vh;
    overflow-y: scroll;
}
</style>