

export const createHtmlAttributes = (rootState, zoomLng, zoomLat, list) =>{
    /*var response = "<div style='max-height: 25vh;overflow: scroll;'><table class = 'table table-hover '> <tbody>";
    for (var prop in list) {
        response += "<tr> <th>" + prop + "</th> " + "<th>" + list[prop] + "<th> <tr>";
    }
    response += "</tbody></table></div>";*/
    const parentDiv = document.createElement('div');
    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'max-height: 25vh;overflow: scroll;'
    /*const style = document.createElement('style');
    style.innerHTML = `::-webkit-scrollbar {display: none;}`;
    tableDiv.appendChild(style);*/
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