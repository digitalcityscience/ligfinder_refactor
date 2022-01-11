<template>
   <table v-show="$store.state.layer.toggle" class="table table-sm ">
        <thead >
            <tr >
                <th id="layersbutton" style="background-color:transparent; width: 50%;"><span  class="btn btn-sm"  style="font-size: 1vw; width: 100%" @click="layerPanelToggle(); toggleColorButtonLayers() ">Layers</span></th>
                <th id="basemapsbutton" style=" background-color:grey; width: 50%; "><span  class="btn btn-sm" style="font-size: 1vw;  width: 100%" @click="basemapPanelToggle(); toggleColorButtonBasemap() ">Base Maps</span></th>
            </tr>
        </thead>
        <tbody style="width:100%" v-show="$store.state.layer.LayerPanelToggle" class=" b">
           <div v-for="table in $store.state.database.addedTableNames" :key="table">
                <tr >
                    <td  style="width: 10%"><input type="checkbox" class="form-check-input" :id="table"  @change="toggleLayerVisibility(table)" checked ></td>
                    <td  style="width: 10%;"><span @click= " zoomToTable(table)"><i  class="fa fa-search-plus fa-sm" aria-hidden="true"></i></span></td>
                    <td style="width: 80%">{{table}}</td>
                    <td><span  class="icon-collapse" :id="table+'-icon-collapse'" @click="collapse(table)"><i class="fa fa-plus fa-sm"></i></span></td>

                </tr>
                <tr style="background-color: grey; display:none" class="collapse" :id="table+'-collapse'">
                    <div>
                        <label >fill color:</label>
                        <input style="margin-left: 1vw" type="color" :id="table + 'colorslider'" name="colorslider"  value="#FF00FF" v-model="$store.state.database[table+'Style'].fillColor" @change="changeColor(table)" >
                    </div>
                    <div>
                        <label >outline color:</label>
                        <input style="margin-left: 1vw" type="color" :id="table + 'outlinecolorslider'" name="outlinecolorslider"  value="#000000" v-model="$store.state.database[table+'Style'].fillOutlineColor" @change="changeOutlineColor(table)" >
                    </div>
                    <div>
                        <label >fill opacity:</label>
                        <input style="margin-left: 1vw" :id="table + 'opacityslider'"  :name="table + 'opacityslider'" type="range" step="0.1"  min="0" max="1" v-model="$store.state.database[table+'Style'].fillopacity" @change="changeOpacity(table)" />

                    </div>

                </tr>
                        
           </div>
                
            
        </tbody>
        <tbody v-show="$store.state.layer.BasemapsPanelToggle" class="b">
            <tr  v-for="basemap in $store.state.layer.basemaps" :key="basemap.name">
                <td  style="width: 10%"><input class="basemapcheck" type="radio" :id="basemap.name" name="ff" @change= " $store.dispatch('layer/setBasemap', basemap)" :checked="selected===basemap.name"    ></td>
                <td style="width: 90%">{{basemap.name}}</td>
            </tr>
        </tbody>
        

    </table>
</template>

<script>
import $ from 'jquery'


export default {
    name: "Layer",
    data:  function (){
        return{
            selected: 'basic',
            opacity:1,
            fillcolor: '#00FF00',
            outlineFillColor: '#000000'
        }
        
    },
     
    methods:{
        
        collapse(t){
            let x = document.getElementById(t+'-collapse');
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
            
    
        },
        changeOutlineColor(t){
            const outlinecolorslider = document.getElementById(t+"outlinecolorslider");
            outlinecolorslider.addEventListener('input', () => {
                
                console.log(this.$store.state.database[t+"Style"].fillOutlineColor)
                
                this.$store.state.map.map.setPaintProperty(t,'fill-outline-color', this.$store.state.database[t+"Style"].fillOutlineColor)
            });
        },
        changeColor(t){
            const colorslider = document.getElementById(t+"colorslider");
            colorslider.addEventListener('input', () => {
                
                
                this.$store.state.map.map.setPaintProperty(t, "fill-color", this.$store.state.database[t+"Style"].fillColor)
            });
        },
        changeOpacity(t){
           const opacityslider = document.getElementById(t+"opacityslider");
            opacityslider.addEventListener('input', () => {
                
                console.log(this.$store.state.database[t+"Style"].fillopacity)
                
                this.$store.state.map.map.setPaintProperty(t, 'fill-opacity', Number(this.$store.state.database[t+"Style"].fillopacity))
            });
        },
        toggleColorButtonLayers (){
           $( "#layersbutton" ).css( "background-color", "transparent" );
           $( "#basemapsbutton" ).css( "background-color", "grey" );

        },
        toggleColorButtonBasemap(){
            $( "#layersbutton" ).css( "background-color", "grey" );
            $( "#basemapsbutton" ).css( "background-color", "transparent" );
           
        },
        layerPanelToggle(){
            this.$store.commit('layer/setLayerPanelToggle')
        },
        basemapPanelToggle(){
            this.$store.commit('layer/setBasemapPanelToggle')
        },
        toggleLayerVisibility: function(table){

                    if(document.querySelector("#"+table+":checked")) {
                        console.log("checked")
                        this.$store.state.map.map.setLayoutProperty(table, 'visibility', 'visible');
                    } else {
                        console.log("not checked")
                        this.$store.state.map.map.setLayoutProperty(table, 'visibility', 'none');
                    }
        },
        zoomToTable(table){
            this.$store.dispatch('layer/zoomToTable', table);
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
        width: 20vw;
       
    }
    .b {
        position: absolute;
        table-layout: fixed;
        width:100%;  
        z-index: 999;
        background-color: rgba(255, 255, 255, 0.9);
    }

    .table td{
        vertical-align: middle;
    }

    .table-nonfluid {
        width: auto !important;

    }
    
</style>