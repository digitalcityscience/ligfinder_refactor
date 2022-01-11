<template>
  <div v-show = '$store.state.mouseCoordinate.toggle' class="coordinate-panel" >
        <span id="coordinates">
            {{'Lat Lng: ' + Number($store.state.mouseCoordinate.mouseLat).toFixed(4) +
                ', ' + 
                
                Number($store.state.mouseCoordinate.mouseLng).toFixed(4)
            }}
        </span>
               
    </div>
    
</template>

<script>
export default {
    name: 'MouseCoordinatePanel',
    methods:{
        
    }
}
</script>

<style scoped>
    .coordinate-panel{
        z-index: 999;
        position: absolute;
        bottom:0.5vh;
        left: 1.9vw;
        padding-left:5px;
        padding-right:5px;
        color: white;
        background-color: rgb(34, 33, 33);
    }
    

</style>