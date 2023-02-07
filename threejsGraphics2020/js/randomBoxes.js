/***********
 * triangle015.js
 * A simple triangle with orbit control
 * M. Laszlo
 * September 2019
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    const light = new THREE.AmbientLight( 0xffffff, 0.01 ); 
    scene.add( light );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.01);
    directionalLight.position.set(0,6,0);
    scene.add( directionalLight );
    let boxes = randomBoxes(100,5,20,5,60);
    scene.add(boxes);
}

function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight) {
  
  root = new THREE.Object3D();
  // Add a gray floor
  var floorGeometry = new THREE.PlaneGeometry(200, 200);
 
  let floorMaterial = new THREE.MeshLambertMaterial({ emissive: 0x808080, transparent: false});
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = -Math.PI / 2;
 
  root.add(floor);

  // Add random boxes to the scene
  for (var i = 0; i < nbrBoxes; i++) {
    // Create the box geometry
    var side = minSide + Math.random() * (maxSide - minSide);
    var height = minHeight + Math.random() * (maxHeight - minHeight);
    var boxGeometry = new THREE.BoxGeometry(side, height, side);

    // Create the box material with random color
    var hue = Math.random();
    var saturation = 0.8 + 0.15 * Math.random();
    var lightness = 0.3 + 0.4 * Math.random();
    let matArgs1 = {emissive: getRandomColor(), transparent: true, opacity: 0.8};
    let mat1 = new THREE.MeshLambertMaterial(matArgs1);  
    let box = new THREE.Mesh(boxGeometry, mat1);
    box.material.color.setHSL(hue, saturation, lightness);
    // Position the box randomly on the floor
 
    let positionX = -100 + Math.random() * 200;
    if (positionX >= 0) {
       if ((positionX + side) <= 100) {
         box.position.x = positionX;
       } 
       else {
          box.position.x = positionX - (side - (100 - positionX));
       } 
    }
    else {
       if (positionX < 0) {
          if ((positionX - side) >= -100) {
              box.position.x = positionX
          }
          else {
             box.position.x = positionX + (side - (positionX + 100));
          }
       }
       
    }

    let positionZ = -100 + Math.random() * 200;
    if (positionZ >= 0) {
       if ((positionZ + side) <= 100) {
         box.position.z = positionZ;
       } 
       else {
          box.position.z = positionZ - (side - (100 - positionZ));
       } 
    }
    else {
       if (positionZ < 0) {
          if ((positionZ - side) >= -100) {
              box.position.z = positionZ
          }
          else {
             box.position.z = positionZ + (side - (positionZ + 100));
          }
       }
       
    }
 
    box.position.y = height / 2;
    
    // Add the box to the scene
    root.add(box);
  }

  return root;
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

