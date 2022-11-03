import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/* TODOS!!!!!

- change Fonts
- change Texts
- change Pictures
- replace Moon 
- change position of blocks
- make blocks clickable
- add easter eggs
- add "enter" animation 

*/

// Basic Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);


// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.125, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('assets/Space1.jpg');
scene.background = spaceTexture;

// Blocks/Shapes

const agileTexture = new THREE.TextureLoader().load('assets/agil.png');
const agileBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({color: 0xffffff, map: agileTexture }));
scene.add(agileBlock);

const approvedTexture = new THREE.TextureLoader().load('assets/approved.png');
const approvedBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: approvedTexture }));
scene.add(approvedBlock);

const bookingTexture = new THREE.TextureLoader().load('assets/booking.png');
const bookingBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: bookingTexture }));
scene.add(bookingBlock);

const dataScienceTexture = new THREE.TextureLoader().load('assets/data-science.png');
const dataScienceBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: dataScienceTexture }));
scene.add(dataScienceBlock);

const webScraperTexture = new THREE.TextureLoader().load('assets/web-scraper.png');
const webScraperBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: webScraperTexture }));
scene.add(webScraperBlock);

const monitoringTexture = new THREE.TextureLoader().load('assets/monitoring.png');
const monitoringBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: monitoringTexture }));
scene.add(monitoringBlock);

const predictionTexture = new THREE.TextureLoader().load('assets/predicitive-models.png');
const predictionBlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ map: predictionTexture }));
scene.add(predictionBlock);


// Positions

agileBlock.position.z = -5;
agileBlock.position.x = 2;

bookingBlock.position.z = -10;
bookingBlock.position.x = 4;

dataScienceBlock.position.z = -15;
dataScienceBlock.position.x = 6;

monitoringBlock.position.z = -20;
monitoringBlock.position.x = 8;

predictionBlock.position.z = -25;
predictionBlock.position.x = 10;

webScraperBlock.position.z = -30;
webScraperBlock.position.x = 12;

approvedBlock.position.z = -35;
approvedBlock.position.x = 14;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  agileBlock.rotation.y += 0.001;
  agileBlock.rotation.z += 0.001;

  bookingBlock.rotation.y += 0.001;
  bookingBlock.rotation.z += 0.001;

  dataScienceBlock.rotation.y += 0.001;
  dataScienceBlock.rotation.z += 0.001;

  monitoringBlock.rotation.y += 0.001;
  monitoringBlock.rotation.z += 0.001;

  predictionBlock.rotation.y += 0.001;
  predictionBlock.rotation.z += 0.001;

  webScraperBlock.rotation.y += 0.001;
  webScraperBlock.rotation.z += 0.001;

  approvedBlock.rotation.y += 0.001;
  approvedBlock.rotation.z += 0.001;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
