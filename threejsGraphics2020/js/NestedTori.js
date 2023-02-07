/***********
 * triangle015.js
 * A simple triangle with orbit control
 * M. Laszlo
 * September 2019
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let subject = new Subject();
let Ntori = new THREE.Object3D;

function createScene() {
   const light = new THREE.AmbientLight( 0xffffff, 0.01 ); 
   scene.add( light );
   const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.01);
   directionalLight.position.set(0,6,0);
   scene.add( directionalLight );
   let Ntori = createNestedTori(12,2.2,0.1,32,32);
   scene.add(Ntori);
    
}

function createNestedTori(n,torusOut,torusIn,RadialSeg,TubeSeg) {
   // Create the ring of tori
   root = new THREE.Object3D; 
   orig_torusOut = torusOut;
 
  for (var i = 0; i <  n; i++) {
  
    var torusGeometry = new THREE.TorusGeometry(torusOut, torusIn, RadialSeg, TubeSeg);
  //  let arg1 = {emissive: getRandomColor(), transparent:  true, opacity: 0.8};
   let arg1 = {emissive: getRandomColor() };
    var mat = new THREE.MeshLambertMaterial(arg1);
    var torus = new THREE.Mesh(torusGeometry, mat);
    torus.rps = 0.2;
    root.add(torus);
    torusOut = torusOut - (2 * torusIn);
 
  }

  let arg3 = {Color: 0xffffff, fog: false, emissive: 0xffffff};
  let sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  let sphereMaterial = new THREE.MeshLambertMaterial(arg3);
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.rps = 0.2
  root.add(sphere);
 
  return root;
}


function animate() {
	window.requestAnimationFrame(animate);
    //  update(Ntori);
      Ntori.position.z += 0.01;	
      render();
}

function moveChildren(root, f) {
    let children = root.children;
    children.forEach(function (child, i, children) {
         child.update = f(child, i, children);
         subject.register(child); 
    }); 
}

function update(root) {
    let delta = clock.getDelta();
    let children = root.children;
    let n = children.length;
    for ( var v = 0; v < n; v++ ) {
       let deltaRadians = rpsToRadians(children[v].rps, delta);
       if (isEven(v)) {
             children[v].rotation.x += deltaRadians;
             children[v].rotation.x %= 2 * Math.PI; 
       }
       else {
             children[v].rotation.x -= deltaRadians;
             children[v].rotation.x %= 2 * Math.PI; 
       }
    } 
   
}

function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}

function rpsToRadians(rps, t) {
    return 2 * Math.PI * rps * t;
}
function makeColorAnimator(rate, saturation=1.0, lightness=0.5) {
    function f(child, i, children) {
        child.crate = rate;
        child.cval = i / children.length;
        return function (delta) {
            this.cval += delta * this.crate;
            this.cval = mod(this.cval, 1);
            this.material.color.setHSL(this.cval, saturation, lightness);
        }
    }
    return f;
}

function mod(x, n) {
    return (x % n + n) % n;
}
function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.setAnimationLoop(function () {
         update(Ntori);
         renderer.render(scene, camera);
    }); 
    renderer.render(scene, camera); 
 
  
}


function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	// renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	//camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
     camera.position.z = 5;
	// camera.position.set(0, 0, 30);
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

