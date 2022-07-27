<template>
<div >
    <div v-show="$store.state.legend.univariateToggle" class="legend">
        <div>
            <i
                class="fas fa-times mt-0" 
                style="cursor: pointer; position:absolute; right: 5px"
                @click="setLegendToggle"   
            >
            </i>
        </div>
        <h5 class="d-flex justify-content-center mt-1">{{$store.state.legend.attribute}}</h5>
        <!--
        <div id="class0"><span id="class0" style="background-color: #723122"></span>{{($store.state.legend.lowerbound).toFixed(2)}} - {{($store.state.legend.breaks[0]).toFixed(2)}}</div>
        <div id="class1"><span id="class1" style="background-color: #723122"></span>{{($store.state.legend.breaks[0]).toFixed(2)}} - {{($store.state.legend.breaks[1]).toFixed(2)}}</div>
        <div id="class2"><span id="class2" style="background-color: #723122"></span>{{($store.state.legend.breaks[1]).toFixed(2)}} - {{($store.state.legend.breaks[2]).toFixed(2)}}</div>
        <div id="class3"><span id="class3" style="background-color: #723122"></span>{{($store.state.legend.breaks[2]).toFixed(2)}} - {{($store.state.legend.breaks[3]).toFixed(2)}}</div>
        <div id="class4"><span id="class4" style="background-color: #723122"></span>{{($store.state.legend.breaks[3]).toFixed(2)}} - {{($store.state.legend.breaks[4]).toFixed(2)}}</div>!-->

    </div>
    <div v-show="$store.state.legend.bivariateToggle" class="bivariatelegend">
        <i
                class="fas fa-times mt-0" 
                style="cursor: pointer; position:absolute; right: 5px"
                @click="setBivariateLegendToggle"
            >
        </i>
       
    </div>
</div>
   
    
</template>

<script>
export default {
    name: "Legend",
    methods: {
        setLegendToggle(){
            this.$store.commit('legend/setLegendToggle')
        },
        setBivariateLegendToggle(){
            this.$store.commit('legend/setBivariateLegendToggle')
        }
    }
    
}
</script>

<style scoped>
.legend {
    position: absolute;
    bottom:2vw;
    right: 1vw;
    z-index: 999;
    max-width: 20vw;
    max-height:30vw;
    background-color: #fff;
    border-radius: 3px;
    padding: 10px;
    font-size: 0.9vw;
}
.bivariatelegend {
    position: absolute;
    bottom:2vw;
    right: 1vw;
    z-index: 999;
    max-width: 20vw;
    max-height:30vw;
    background-color: #fff;
    font-size: 0.9vw;
}

</style>