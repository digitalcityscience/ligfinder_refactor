export class AddBaseMapControl {
    constructor(instance,buttonClassName="",buttonID="",eventHandler) {
        this._instance = instance
        this._className = buttonClassName;
        this._buttonID = buttonID
        this._eventHandler = eventHandler
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group';
        const btn = this.createButton()
        this._container.addEventListener('contextmenu',function(e){e.preventDefault()})
        this._container.appendChild(btn)
        btn.addEventListener('click',(e)=>{return this._eventHandler(e,this._buttonID,this._instance)})
        return this._container;
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
    createMapIcon(){
        const icon = document.createElement('i')
        icon.className = "v-icon notranslate mdi mdi-map-outline theme--light"
        icon.setAttribute('aria-hidden',true)
        return icon
    }
    createButton(){
        const i = this.createMapIcon()
        const btn = document.createElement('button')
        btn.id = this._buttonID
        btn.className = this._className
        btn.appendChild(i)
        return btn
    }
}