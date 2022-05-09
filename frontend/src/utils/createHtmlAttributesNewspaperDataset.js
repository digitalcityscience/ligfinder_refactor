import WordCloud from "wordcloud";

export const createHtmlAttributesNewspaperDataset = (rootState, zoomLng, zoomLat, listt, wordlist) =>{
    const parentDiv = document.createElement('div');

    const navDiv = document.createElement('div');

    const righarrowBtn = document.createElement('button');
    righarrowBtn.setAttribute('id', 'righarrowBtn');
    const righarrowIcon = document.createElement('i');
    righarrowIcon.setAttribute('class', 'fas fa-angle-right fa-lg');
    navDiv.style.cssText = 'display: inline-block; text-align:center; width: 100%'
    righarrowBtn.style.cssText = 'float: right; color: blue'
    

    const leftarrowBtn = document.createElement('button');
    leftarrowBtn.setAttribute('id', 'leftarrowBtn');
    const leftarrowIcon = document.createElement('i');
    leftarrowIcon.setAttribute('class', 'fas fa-angle-left fa-lg');
    leftarrowBtn.style.cssText = 'float: left; color: gray'
    leftarrowBtn.disabled = true

    navDiv.appendChild(righarrowBtn)
    navDiv.appendChild(leftarrowBtn)
    righarrowBtn.appendChild(righarrowIcon)
    leftarrowBtn.appendChild(leftarrowIcon)
    parentDiv.appendChild(navDiv)


    const tableDiv = document.createElement('div');
    tableDiv.style.cssText = 'max-height: 25vh;overflow: scroll'
    /*const style = document.createElement('style');
    style.innerHTML = `::-webkit-scrollbar {display: none;}`;
    tableDiv.appendChild(style);*/
    const table = document.createElement('table');
    table.setAttribute('class', 'table table-hover');
    const tbody = document.createElement('tbody');
    for (var prop in listt) {
        let tr = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.textContent = prop;
        let th2 = document.createElement('th');
        th2.textContent = listt[prop];
        tr.appendChild(th1)
        tr.appendChild(th2)
        tbody.appendChild(tr)

    }
    table.appendChild(tbody)
    tableDiv.appendChild(table)
    parentDiv.appendChild(tableDiv)

    const canvas = document.createElement("canvas");
    canvas.setAttribute('id', 'canvas');
    canvas.height= "200"
    canvas.width= "200"

    const zoomDiv = document.createElement('div');
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-outline-primary btn-sm mt-2');
    btn.textContent = 'Zoom To';
    zoomDiv.appendChild(btn)
    parentDiv.appendChild(zoomDiv)

    const pdfBtn = document.createElement('button');
    pdfBtn.setAttribute('class', 'btn btn-outline-success btn-sm mt-2');
    pdfBtn.style.cssText = 'float:right'
    pdfBtn.textContent = 'Full Text';
    zoomDiv.appendChild(pdfBtn)

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
        window.open(rootState.geoparsing.newspaperMailLink, '_blank')
    }
    
    righarrowBtn.onclick = function (){
        parentDiv.appendChild(canvas)
        parentDiv.removeChild(tableDiv)
        parentDiv.removeChild(zoomDiv)
        
            
        /*let wordlist = [];
        for (let i in wordFrequency) {
            wordlist.push([wordFrequency[i]["word"], wordFrequency[i]["frequency"]])
        }
            
        console.log(wordlist)*/
        
        WordCloud(document.getElementById('canvas'), {
                    list: wordlist,
                    //fontWeight: 3000,
                    //size: 2,
                    fontFamily: 'Times, serif',
                    gridSize: 1,
                    weightFactor: 6,
                    backgroundColor:'#fff',
                    shuffle: true,
                    
                    }
                );
        
        
            
        document.getElementById('righarrowBtn').disabled = true;
        document.getElementById('righarrowBtn').style.color = "gray";
        document.getElementById('leftarrowBtn').disabled = false;
        document.getElementById('leftarrowBtn').style.color = "blue";

    }
    
    leftarrowBtn.onclick = function(){
        parentDiv.removeChild(canvas)
        parentDiv.appendChild(tableDiv)
        parentDiv.appendChild(zoomDiv)
        document.getElementById('leftarrowBtn').disabled = true;
        document.getElementById('leftarrowBtn').style.color = "gray";

        document.getElementById('righarrowBtn').disabled = false;
        document.getElementById('righarrowBtn').style.color = "blue";
    }
    return parentDiv
}