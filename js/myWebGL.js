var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight); //with a smaller size, lower resolution, blur
document.body.appendChild(renderer.domElement); //add the renderer to the body, which is a canvas element

//add a cube
var geometry = new THREE.BoxGeometry(2,2,2,10,10,10);
var material = new THREE.MeshBasicMaterial({color: 0x9900FF, wireframe :true});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;


function render(){
	requestAnimationFrame(render);// create a loop that causes the renderer to draw the scene 60 times per second.
	//Basically, anything you want to move or change while the game / app is running has to go through the render loop.
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	
	renderer.render(scene, camera);
}

render();

