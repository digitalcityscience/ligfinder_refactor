<template>
    <div>
        <div class='spinner' v-if='$store.state.map.isLoading'>
            <img src='../assets/4.gif' :disabled='$store.state.map.isLoading'
                style="position: absolute; margin:0 auto; left:50%; top: 50%;margin-top: -32px; transform: translate(0, -50%); z-index: 999; width: 64px; height: 64px">
        </div>
        <div class="placeholder">
            <div class="layers-container" v-if="$store.state.layers.toggle">
                <Layers />
            </div>
            <Legend />
            <Alert />
            
            <CompareLikedParcels />
            <BaseMaps />
        </div>
    </div>
</template>

<script>
import Layers from './Layers'
import Legend from './Legend'
import Alert from './Alert'
import CompareLikedParcels from './CompareLikedParcels'
import BaseMaps from './BaseMaps'
export default {
    components: {
        Layers,
        Legend,
        Alert,
        CompareLikedParcels,
        BaseMaps
    },

}
</script>

<style lang="scss" scoped>
.placeholder {
    pointer-events: none;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 48px;
}

.placeholder .placeholder-text {
    margin: auto;
}

.layers-container {
    position: absolute;
    right: 0;
    pointer-events: all;
}
</style>