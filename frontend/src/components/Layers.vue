<template>

<v-row no-gutters v-show="$store.state.layers.toggle" >
    <v-col
        sm="3"
    >
    <v-scroll-x-transition>
        
        <v-expansion-panels accordion focusable>
        <v-expansion-panel
            v-for="table in $store.state.layers.tableNames" :key="table.id"
        >
            <v-expansion-panel-header>{{table.name}}</v-expansion-panel-header>
            <v-expansion-panel-content>
                
            visibility: <input type="checkbox" class="form-check-input" :id="table.name" :checked="table.checked" @click.once="addLayer(table, $event)" @change="toggleLayerVisibility(table)" > <br>
            
            <div v-if="$store.state.layers[table.name+'Style']">
                zoom to extent: <span @click= " zoomToTable(table)"><i  class="fa fa-search-plus fa-sm" aria-hidden="true"></i></span><br>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='fill'">
                            <label >fill color:</label>
                            <input style="margin-left: 1vw" type="color" :id="table.name + 'colorslider'" :name="table.name + 'colorslider'" v-model="$store.state.layers[table.name + 'Style'].fillColor"  @click="changeFillColor(table.name)" >
                        </div>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='fill'">
                            <label >outline color:</label>
                            <input style="margin-left: 1vw" type="color" :id="table.name + 'outlinecolorslider'" :name="table.name + 'outlinecolorslider'"  v-model="$store.state.layers[table.name + 'Style'].fillOutlineColor" @click="changeOutlineColor(table.name)" >

                        </div>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='fill'">
                            <label >fill opacity:</label>
                            <input style="margin-left: 1vw" :id="table.name + 'opacityslider'"  :name="table.name + 'opacityslider'" v-model="$store.state.layers[table.name + 'Style'].fillopacity" type="range" step="0.1"  min="0" max="1"  @click="changeOpacity(table.name)" />

                        </div>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='circle'">
                            <label >color:</label>
                            <input style="margin-left: 1vw" type="color" :id="table.name + 'colorslider'" :name="table.name + 'colorslider'" v-model="$store.state.layers[table.name + 'Style']['circle-color']"  @click="changeCircleColor(table.name)" >

                        </div>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='circle'">
                            <label >opacity:</label>
                            <input style="margin-left: 1vw" :id="table.name + 'opacityCircleslider'"  :name="table.name + 'opacityCircleslider'"  v-model="$store.state.layers[table.name + 'Style']['circle-opacity']" type="range" step="0.1"  min="0" max="1"  @click="changeCircleOpacity(table.name)" />

                        </div>
                        <div v-if="$store.state.layers[table.name+'Style'].type==='circle'">
                            <label >radius:</label>
                            <input style="margin-left: 1vw" :id="table.name + 'circleRadiusSlider'"  :name="table.name + 'circleRadiusSlider'" value="3" type="range" step="1"  min="1" max="10"  @click="changeCircleRadius(table.name)" />

                        </div>
                        
                        
                    </div>
            </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
        </v-scroll-x-transition>
    </v-col>
</v-row>

</template>

<script>
import $ from 'jquery'

   

export default {
    name: "Layers",
    
    methods:{
        
        addLayer(p, e){
            console.log(p)
            if (e.target.checked) {
                this.$store.dispatch('layers/addTable', p)
               document.getElementById(p.name+'-icon-collapse').style.display = "block";
            }
        },
        toggleLayerVisibility(table){
            if (table.name=="foi"){
                if(document.querySelector("#"+table.name+":checked")) {
                    this.$store.state.map.map.setLayoutProperty("foi", 'visibility', 'visible');
                } 
                else {
                    this.$store.state.map.map.setLayoutProperty("foi", 'visibility', 'none');
                }
            }
            else{
                for (let i=0; i< this.$store.state.layers.addedTableNames.length; i++){
                    if(this.$store.state.layers.addedTableNames[i].id === table.name) {
                        if(document.querySelector("#"+table.name+":checked")) {
                            this.$store.state.map.map.setLayoutProperty(table.name, 'visibility', 'visible');
                        } 
                        else {
                            this.$store.state.map.map.setLayoutProperty(table.name, 'visibility', 'none');
                        }
                    }
                }
            }
            
        },
        toggleCollapseIcon(table){
            console.log(table)
            $('#'+table+'-icon').toggleClass('fa-plus fa-minus');
        },
        collapse(table){
           let x = document.getElementById(table+'-collapse');
            if (x.style.display === "none") {
                x.style.display = "block";
                
            } else {
                x.style.display = "none";
            }
        },
        changeFillColor(t){
           document.getElementById(t+"colorslider").addEventListener('input', (e) => {
               this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, "fill-color", e.target.value)
           })
                
        },
        changeOpacity(t){
            document.getElementById(t+"opacityslider").addEventListener('input', (e) => {
                this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, 'fill-opacity', Number(e.target.value))
            });
            
        },
        changeOutlineColor(t){
           document.getElementById(t+"outlinecolorslider").addEventListener('input', (e) => {
               this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, 'fill-outline-color', e.target.value)
           })
                
        },
        changeCircleColor(t){
           document.getElementById(t+"colorslider").addEventListener('input', (e) => {
                this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, "circle-color", e.target.value)
           })
                
        },
        changeCircleOpacity(t){
            document.getElementById(t+"opacityCircleslider").addEventListener('input', (e) => {
                this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, 'circle-opacity', Number(e.target.value))
            });
            
        },
        changeCircleRadius(t){
            document.getElementById(t+"circleRadiusSlider").addEventListener('input', (e) => {
                this.value = e.target.value
                this.$store.state.map.map.setPaintProperty(t, 'circle-radius', Number(e.target.value))
            });
        },
         zoomToTable(table){
            this.$store.dispatch('layers/zoomToTable', table.name);
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
        width: 20vw;
    }
</style>