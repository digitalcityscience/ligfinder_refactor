<template>
    <v-dialog activator='#addDataModal' v-model="$store.state.addData.toggle" max-width="50vw" persistent>
        <v-card>
            <v-card-title class="d-flex flex-row-reverse">
                <v-btn icon @click="$store.commit('addData/dropAreaToggle')"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <div class="drag-area" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)"
                    @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>

                    <div class="icon"><i class="fas fa-cloud-upload-alt fa-4x"></i></div>
                    <header id="header1">Drag &amp; Drop Exported Parcels</header>
                    <header id="header2">Supported versions: JSON, GeoJSON </header>

                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "addData",
    methods: {
        onDragOver(){
            document.querySelector(".drag-area").classList.add("active")
            document.querySelector(".drag-area").querySelector("header").textContent = "Release to Upload the File"
        },
        onDragLeave(){
            document.querySelector(".drag-area").classList.remove("active")
            document.querySelector(".drag-area").querySelector("#header1").textContent = "Drag & Drop Exported Parcels."
            document.querySelector(".drag-area").querySelector("#header2").textContent = "Supported versions: JSON, GeoJSON"
        },
        onDrop(event){
            event.preventDefault()
            let file = event.dataTransfer.files[0]
            let fileType = file.type
            let validFileTypes = ['application/json']
            if (validFileTypes.includes(fileType)){
                let reader = new FileReader()
                reader.onload = (e) => {
                    let json = JSON.parse(e.target.result);
                    document.querySelector(".drag-area").classList.remove("active")
                    let toBeRemove = ".json";
                    let filenName = file.name.replace(toBeRemove,'');
                    this.$store.dispatch('addData/addDroppedData', {data: json, name: filenName});
                    // this.$store.commit('addData/closeDropArea');
                    document.querySelector(".drag-area").querySelector("#header1").textContent = "Drag & Drop Exported Parcels."
                    document.querySelector(".drag-area").querySelector("#header2").textContent = "Supported versions: JSON, GeoJSON"
                }
                reader.readAsText(file)

            }
            
            else {
                this.$store.dispatch('alert/openCloseAlarm', {text: "The uploaded file is not valid!"})
                document.querySelector(".drag-area").classList.remove("active")
            }
        }
    }
}
</script>

<style scoped>
.drag-area{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    background: rgb(243, 239, 239);
    flex-direction: column  ;
    border: 1px dashed rgb(90, 88, 88);
    border-radius: 5px;
}
.drag-area.active{
    border: 2px solid rgb(90, 88, 88);
}
.drag-area header{
    font-size: 1rem;
    font-weight: 500;
    margin: 5vh 0 5vh 0;
   
}
.drag-area span{
    font-size: 1rem;
    margin: 1vh 0 2vh 0;
}



</style>