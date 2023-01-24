/***********
 * ziggurat.js
 * January 2023
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
 
    let torus = ziggurat(14,15,1,16, 100, 0.90);
    scene.add(torus);
}


function ziggurat(nbrLevels, radius, height, radial_segments, tubular_segments, sfactor) {
    let sf = 1;
    let ypos = 0.0;
    root = new THREE.Object3D();
    for (let i = 0; i < nbrLevels; i++) {
        let base = zigguratBase(radius, height, radial_segments, tubular_segments,sf);
        base.position.z += ypos;
        root.add(base);
        ypos += height;
        sf *= sfactor;
        radius -= height;
        radial_segments *= sfactor;
        height *= 1.01;
        tubular_segments *= sfactor; 
    }
    let geom1 = new THREE.SphereGeometry(height/2,20,20);  
    let matArgs1 = {color: getRandomColor()};
    let mat1 = new THREE.MeshBasicMaterial(matArgs1);  
    let base = new THREE.Mesh(geom1,mat1);
    base.position.z += ypos + height*.7;
    root.add(base); 
    root.rotateX(-90);
    return root;
}

function zigguratBase(radius, height, radial_segments, tubular_segments, sf) {
   let geom = new THREE.TorusGeometry(radius,height,radial_segments,tubular_segments)
   let matArgs = {color: getRandomColor()};
   let mat = new THREE.MeshBasicMaterial(matArgs);
   let base = new THREE.Mesh(geom, mat);
   base.position.z = height * .99;
   return base;
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

