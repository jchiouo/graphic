/***********
 * polygon.js
 * A polygon
 ***********/
/* show1.html?load=js/polygon.js */

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let red = new THREE.Color(1, 0, 0);
    let blue = new THREE.Color(0,0,1);
    let polygon = regularPolygonMesh(8,5,red,blue);
    let axes = new THREE.AxesHelper(10);
    scene.add(polygon);
    scene.add(axes);
}


function regularPolygonMesh(n,rad, innerColor, outerColor) {
    let geom = new THREE.Geometry();
    let red = new THREE.Color(1, 0, 0);
    let green = new THREE.Color(0, 1, 0);
    let inc = 2 * Math.PI / n;
    
    geom.vertices.push(new THREE.Vector3(0,0,0));
    for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, rad*sin, 0));
       
    }  
    // push the n triangular faces...
    for (let i = 1; i < n; i++) {
        let face = new THREE.Face3(i+1, i, 0);
        geom.faces.push(face);
     //   geom.colors.push(red);
       face.vertexColors.push(outerColor,outerColor,innerColor);
    }
    let face = new THREE.Face3(1, n, 0);
    geom.faces.push(face); 
    face.vertexColors.push(outerColor,outerColor,innerColor); 
 
    let args = {vertexColors:  THREE.VertexColors, side:  THREE.DoubleSide}; 
    let mat = new THREE.MeshBasicMaterial(args); 
    let mesh = new THREE.Mesh(geom, mat);
    return mesh;
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}


function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
	renderer.render(scene, camera);
}


function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}


init();
createScene();
addToDOM();
render();
animate();

