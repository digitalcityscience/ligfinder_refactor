export const createHtmlAttributesParliamentDataset = (rootState, zoomLng, zoomLat, list) =>{
   
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

    const pdfBtn = document.createElement('button');
    pdfBtn.setAttribute('class', 'btn btn-outline-success btn-sm');
    pdfBtn.style.cssText = 'float:right'
    pdfBtn.textContent = 'Read pdf';
    zoomDiv.appendChild(pdfBtn)

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

    pdfBtn.onclick = function() {
        window.open(rootState.geoparsing.parliamentPdfLink, '_blank')
    }
    return parentDiv
}