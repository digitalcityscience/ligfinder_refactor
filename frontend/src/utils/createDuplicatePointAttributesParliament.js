
export const createDuplicatePointAttributesParliament = (rootState, dispatch, popup, list) =>{
    
    const parentDiv = document.createElement('div');
    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'max-height: 30vh;overflow: scroll;'
    
    const table = document.createElement('table');
    table.setAttribute('class', 'table table-hover');
    const tbody = document.createElement('tbody');
    const thead = document.createElement('thead');
    const trhead = document.createElement('tr');
    const thhead = document.createElement('th');
    thhead.textContent = "list of overlaid points" + ": " + "(" + list.length + ")"
    thhead.colSpan="2"
    trhead.appendChild(thhead)
    thead.appendChild(trhead)
    table.appendChild(thead)
    for (var prop in list) {
        let tr = document.createElement('tr');
        tr.setAttribute("id", list[prop]['properties']['id'])
        tr.style.cssText = 'cursor:pointer;'
        let td1 = document.createElement('td');
        
        
        td1.textContent = prop;
        let td2 = document.createElement('td');
        td2.textContent = list[prop]['properties']['doc_num'];
        tr.appendChild(td1)
        tr.appendChild(td2)
        tbody.appendChild(tr)
        tr.onclick = function() {
            popup.remove();
            dispatch('addSelectedDuplicatePointParliament', {'id': parseInt(tr.id), 'list': list});

        }
        

    }
    
    table.appendChild(tbody)
    tableDiv.appendChild(table)
    parentDiv.appendChild(tableDiv)
    
    
    return parentDiv
}