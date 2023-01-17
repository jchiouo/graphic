/***********
 * Cylinder.js
 * 
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let triangle = makeCylinder(); 
    let axes = new THREE.AxesHelper(10);
    scene.add(triangle);
    scene.add(axes);
}

function makeCylinder() {
   let geom1 = createCylinder(10,7,10);
  
   let args = {vertexColors: true, linewidth:  4}; 
   /* let args = {vertexColors: true}; */
   let mat = new THREE.LineBasicMaterial(args); 
   let line = new THREE.Line(geom1,mat, THREE.LineStrip);
   return line
}
function createCylinder(n, rad, len) {
    let len2 = len / 2;  // half the pyramid's height
    let geom = new THREE.Geometry();
    let red = new THREE.Color(1, 0, 0);
    let inc = 2 * Math.PI / n;
    // push n + 1 vertices
    //  first the apex...
   //  geom.vertices.push(new THREE.Vector3(0, len2, 0));
    for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, len2, rad*sin));
    //    if (i = 0) { let startVector = new THREE.Vector3(rad*cos, len2, rad*sin)};
        geom.colors.push(red);
        geom.vertices.push(new THREE.Vector3(rad*cos, -len2, rad*sin));
        geom.colors.push(red);
        geom.vertices.push(new THREE.Vector3(rad*cos, len2, rad*sin));
        geom.colors.push(red);

    }
    geom.vertices.push(new THREE.Vector3(rad*Math.cos(0), len2, rad*Math.sin(0)));
    geom.colors.push(red);
  //  geom.colors.push(red, red, red, red, red);
    //  ... and then the n vertices of the base
  
    for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, -len2, rad*sin));
        geom.colors.push(red);
    }
    geom.vertices.push(new THREE.Vector3(rad*Math.cos(0), -len2, rad*Math.sin(0)));
    geom.colors.push(red);
 /*   for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, len2, rad*sin));
        geom.colors.push(red);
   
    } */
    // push the n triangular faces...
    for (let i = 1; i < n; i++) {
        let face = new THREE.Face3(i+1, i, 0);
        geom.faces.push(face);
    }
    let face = new THREE.Face3(1, n, 0);
    geom.faces.push(face);
 
    // BASE CODE GOES HERE
  /*  for (let i = 2; i < n; i++) {
       let face = new THREE.Face3(i, i+1, 1);
       geom.faces.push(face);
    } */
  
    // set face normals and return the geometry
    geom.computeFaceNormals();
    return geom;
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

