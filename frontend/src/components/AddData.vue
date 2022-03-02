<template>
   

        <div v-show="$store.state.addData.toggle" class="drag-area" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)" @drop="onDrop($event)"  @dragenter.prevent @dragover.prevent>
            
            <div class="icon"><i class="fas fa-cloud-upload-alt fa-4x"></i></div>
            <header>Drag &amp; Drop to Upload Files. Supported versions: JSON, GeoJSON </header>
            <span>OR</span>
            <button type="button" class="btn btn-outline-dark">Browse File</button>
        </div>
        
    
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
            document.querySelector(".drag-area").querySelector("header").textContent = "Drag & Drop to Upload Files. Supported versions: JSON, GeoJSON"
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
                    this.$store.dispatch('addData/addDroppedData', {data: json, fileName: filenName});
                    this.$store.commit('addData/closeDropArea');
                    document.querySelector(".drag-area").querySelector("header").textContent = "Drag & Drop to Upload Files. Supported versions: JSON, GeoJSON"

                }
                reader.readAsText(file)

            }
            
            else {
                this.$store.dispatch('alert/openCloseAlarm', {text: "The uploaded file is not valid!"})
                console.log("file type not supported")
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
    position: absolute;
    width:50vw;
    z-index: 999;
    left: 50%;
    transform: translate(-50%, 30%);
    height: 60vh;
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