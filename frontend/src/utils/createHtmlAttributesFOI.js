

export const createHtmlAttributesFOI = (rootState, store, likedParcel, zoomLng, zoomLat, list) =>{
    
    const parentDiv = document.createElement('div');
    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'max-height: 25vh;overflow: scroll;'
    const table = document.createElement('table');
    table.setAttribute('class', 'table table-hover');
    const tbody = document.createElement('tbody');
    for (var prop in list) {
        let tr = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.textContent = prop;
        let th2 = document.createElement('th');
        th2.textContent = list[prop];
        tr.appendChild(th1)
        tr.appendChild(th2)
        tbody.appendChild(tr)

    }
    table.appendChild(tbody)
    tableDiv.appendChild(table)
    parentDiv.appendChild(tableDiv)
    const zoomDiv = document.createElement('div');
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
    btn.textContent = 'Zoom To';
    zoomDiv.appendChild(btn)

    const compareBtn = document.createElement('button');
    compareBtn.setAttribute('class', 'btn btn-outline-success btn-sm');
    compareBtn.setAttribute('id', 'compare-btn');
    //compareBtn.disabled = true;
    if (rootState.compareLikedParcels.likedParcels.length>1){
        compareBtn.disabled = false;
    }
    else{
        compareBtn.disabled = true;
    }
    
    compareBtn.style.cssText = 'float:right'
    compareBtn.textContent = 'compare';
    zoomDiv.appendChild(compareBtn)

    const startbtn = document.createElement('button');
    startbtn.style.cssText = 'display: inline-block; text-align:center; width: 100%;'

    const startIcon = document.createElement('i');
    startIcon.setAttribute('class', 'fa fa-star fa-lg');
    startIcon.style.cssText = 'color: #FFD700'

    const emptyStartIcon = document.createElement('i');
    emptyStartIcon.setAttribute('class', 'far fa-star fa-lg');

    let starredGids = rootState.compareLikedParcels.likedParcels
    
    if(starredGids.indexOf(likedParcel) == -1){
        startbtn.appendChild(emptyStartIcon)
    }
    else{
        startbtn.appendChild(startIcon)
    }


    zoomDiv.appendChild(startbtn)

    startbtn.onclick = function(){
        if(starredGids.indexOf(likedParcel) == -1){
            startbtn.removeChild(emptyStartIcon)
            startbtn.appendChild(startIcon)
        }
        else{
            startbtn.removeChild(startIcon)
            startbtn.appendChild(emptyStartIcon)
        }
        store.dispatch('compareLikedParcels/addLikedParcel', likedParcel);
    }

    compareBtn.onclick = function(){
        store.dispatch('compareLikedParcels/compare');
    }

    parentDiv.appendChild(zoomDiv)
    btn.onclick = function() {
        rootState.map.map.flyTo({
            center: [
                zoomLng,
                zoomLat
            ],
            zoom: 16,
            bearing: 0,
            speed: 0.8,
            curve: 1,
            essential: true 
        });
            
    }
    return parentDiv
}