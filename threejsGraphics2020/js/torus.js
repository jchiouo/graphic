/***********
 * torus.js
 * Jan 2023
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
   let maxRays = 300
   let maxRad = 1
   let starburstFnc = makeStarburstFnc(maxRays, maxRad)
   let root = createSphereF(starburstFnc,200,15);
   scene.add(root);

}

function makeStarburstFnc(maxRays, maxRad) {
     function fnc() {
        return starburst(maxRays, maxRad);
     }
     return fnc;
}

function starburst(maxRays, maxRad) {
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
    if (Math.random() < 0.5) {
        nbrRays = getRandomInt(4, 25);
    }
    for (let i = 0; i < nbrRays; i++) {
        // dest is a point on some origin-centered sphere
        // of radius between 0.1 and maxRad
        let r = getRandomFloat(0.1, maxRad);
        let dest = getRandomPointOnSphere(r);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, black);
    }
    let args = {vertexColors: true, linewidth: 2};
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
}


function createSphereF(fnc, n, rad) {
    let root = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
        let obj = fnc(i, n);
        let p = getRandomPointsOnTorus(16,4,1000);
        for (x=0; x < p.length; x++) {
           obj.position.set(p[x].x, p[x].y, p[x].z);
           root.add(obj);
        }
    }
    root.rotateX(90);
    return root;
}

function getRandomPointsOnTorus(R, r, count){
    let pts = [];

    let counter = 0;
    let COUNT = count;
    while(counter < COUNT){
        let U = Math.random();
        let V = Math.random();
        let W = Math.random();
        let theta = 2 * Math.PI * U;
        let phi = 2 * Math.PI * V;
        if(W <= ((R + r * Math.cos(theta)) / (R + r))){
            pts.push(new THREE.Vector3(
                (R + r * Math.cos(theta)) * Math.cos(phi),
                (R + r * Math.cos(theta)) * Math.sin(phi),
                r * Math.sin(theta)
            )); 
            counter++;
        } 
    }
    return pts;
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

