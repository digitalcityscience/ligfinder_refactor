<template>
<div class="alerts" id="alerts" :style="{backgroundColor: $store.state.alert.background}" v-if="$store.state.alert.toggle">
    <i class='fas fa-exclamation-circle'></i> &nbsp;
    {{$store.state.alert.alertText}}
</div>
</template>

<script>

export default {
    name:"Alert",
  
}
</script>

<style scoped>
.alerts{
    max-width: 40vw;
    height: 50px;
    position: absolute;
    z-index: 999;
    right: 5px;
    bottom: 5px;
    background-color: rgb(255, 166, 0);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 1vw;
    padding-left: 1vw;
    opacity: 1;
    animation-duration:1s;
    animation-name:slidein-low;
   
}
@keyframes slidein-low{
   from {
      bottom:-100%;
   }
   
   to {
      bottom:0%;
   }

}
</style>