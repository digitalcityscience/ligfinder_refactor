<template>
<div class="alerts" id="alerts" v-if="$store.state.alert.toggle">
    <i class='fas fa-exclamation-circle'></i> &nbsp;
    No feature found. Please restart your search
</div>
</template>

<script>

export default {
    name:"Alert",
  
}
</script>

<style scoped>
.alerts{
    width: 20vw;
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
}
</style>