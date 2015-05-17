// set the scene size
var WIDTH = 400,
  HEIGHT = 300;

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera =  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.z = 300;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

//set up the sphere vars
var radius = 50, segments = 16, rings = 16;
var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x9900FF});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

//add an ambient light
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var pointLight =  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = -10;
pointLight.position.y = 100;
pointLight.position.z = 80;

// add to the scene
scene.add(pointLight);

function render(){
	//requestAnimationFrame(render);// create a loop that causes the renderer to draw the scene 60 times per second.
	//Basically, anything you want to move or change while the game / app is running has to go through the render loop.
	sphere.rotation.y += 0.01;
	//cube.rotation.y += 0.01;
	
	renderer.render(scene, camera);
}

render();


