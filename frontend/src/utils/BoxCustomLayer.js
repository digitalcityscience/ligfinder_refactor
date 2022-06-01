import maplibregl from 'maplibre-gl'

const THREE = window.THREE;
class BoxCustomLayer {
    constructor(options) {
        this.id = options.id;
        this.centerLngLat = options.geomcenter;
        THREE.Object3D.DefaultUp.set(0, 0, 1);
        
    }

    type = 'custom';
    renderingMode = '3d';
  
    async onAdd(map, gl) {
      this.camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 1e6);
      // this.camera = new THREE.Camera();
  
      
      this.center = maplibregl.MercatorCoordinate.fromLngLat(this.centerLngLat, 0);
      const {x, y, z} = this.center;
      this.cameraTransform = new THREE.Matrix4()
        .makeTranslation(x, y, z)
        .scale(new THREE.Vector3(1, -1, 1));
  
      this.map = map;
      this.scene = this.makeScene();
  
      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
  
      this.renderer.autoClear = false;
  
    }
  
    makeScene() {
      const scene = new THREE.Scene();
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
  
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      scene.add(new THREE.HemisphereLight(skyColor, groundColor, 0.25));
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(-70, -70, 100).normalize();
      // Directional lights implicitly point at (0, 0, 0).
      scene.add(directionalLight);
  
      const group = new THREE.Group();
      group.name = '$group';
      // The models are all in meter coordinates. This shifts them to Mapbox world coordinates.
      group.scale.setScalar(this.center.meterInMercatorCoordinateUnits());
  
      const geometry = new THREE.BoxGeometry( 10, 10, 10 );
      geometry.translate(0, 0.02, 0);
      
      const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
      });
      const cube = new THREE.Mesh( geometry, material );
      
      cube.geometry.rotateZ(Math.PI * 0.25);

      group.add(cube);
      scene.add(group);
    
      return scene;
    }


    render(gl, matrix) {
      this.camera.projectionMatrix = new THREE.Matrix4()
        .fromArray(matrix)
        .multiply(this.cameraTransform);
      
      this.renderer.state.reset();
      this.renderer.render(this.scene, this.camera);
      
      
    }
    
  }
  


export default BoxCustomLayer;