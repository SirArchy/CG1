// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// local from us provided utilities
import type * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';
import { createTeddyBear, setupCube, Settings } from './helper';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import { Camera, Scene } from 'three';
import { setupScene } from '../../cg1_exercise_0/src/helper';

const teddy = createTeddyBear();
// Defines the callback that should get called
// whenever the settings change (i.e. via GUI)
function callback(changed: utils.KeyValuePair<Settings>) {
  switch (changed.key) {
    case 'rotateX':
      teddy.rotation.x = changed.value
      break;
    case 'rotateY':
      teddy.rotation.y = changed.value
      break;
    case 'rotateZ':
      teddy.rotation.z = changed.value
      break;
    case 'translateX': //does not work properly
      teddy.translateX(changed.value)
      break;
    case 'translateY': //does not work properly
      teddy.translateY(changed.value)
      break;
    case 'translateZ':  //does not work properly
      teddy.translateZ(changed.value)
      break;
    case 'near':
      //camera updateProjectionMatrix
      break;
    case 'near':

      //camera updateProjectionMatrix
      break;
    case 'near':

      //camera updateProjectionMatrix
      break;
  }
}

/*******************************************************************************
 * Main entrypoint.
 ******************************************************************************/

var settings: helper.Settings;

function main(){
  var root = Application("Camera");
  root.setLayout([["world", "canonical", "screen"]]);
  root.setLayoutColumns(["1fr", "1fr", "1fr"]);
  root.setLayoutRows(["100%"]);

  // create sceneDiv
  var screenDiv = createWindow("screen");
  root.appendChild(screenDiv);

  // create RenderDiv
  var worldDiv = createWindow("world");
  root.appendChild(worldDiv);

  // create canonicalDiv
  var canonicalDiv = createWindow("canonical");
  root.appendChild(canonicalDiv);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  settings = new helper.Settings();
  helper.createGUI(settings);
  settings.addCallback(callback);


  //NEW STUFF

  // CREATE SCREEN SPACE

  // Create scence
  var screenScene = new Scene
  setupScene(screenScene);
  screenScene.background = new THREE.Color(0xFFFFFF)
  //setupCube(sceneScreen);

  // Create camera
  var screenCamera = new THREE.PerspectiveCamera();
  // Uses ./helper.ts for setting up the camera.
  helper.setupCamera(screenCamera, screenScene, settings.near, settings.far, settings.fov);

  // Create controls
  var controls = new OrbitControls(screenCamera, screenDiv);
  // Uses ./helper.ts for setting up the controls
  helper.setupControls(controls);

  // add Teddybear
  screenScene.add(teddy)

  // Create renderer
  var renderer = new THREE.WebGLRenderer({
   antialias: true,  // to enable anti-alias and get smoother output
  });      

  // Create renderWidget
  var wid = new RenderWidget(screenDiv, renderer, screenCamera, screenScene, controls);
  // Start the draw loop (this call is async).
  wid.animate();


  // CREATE WORLD SPACE

  // Create scence
  var worldScene = new Scene
  setupScene(worldScene);
  worldScene.background = new THREE.Color(0xFFFFFF)
  //setupCube(sceneScreen);

  // Create camera
  var worldCamera = new THREE.PerspectiveCamera();
  // Uses ./helper.ts for setting up the camera.
  helper.setupCamera(worldCamera, worldScene, settings.near, settings.far, settings.fov);

  // Create controls
  var controls = new OrbitControls(worldCamera, worldDiv);
  // Uses ./helper.ts for setting up the controls
  helper.setupControls(controls);

  // Create renderer
  var renderer = new THREE.WebGLRenderer({
   antialias: true,  // to enable anti-alias and get smoother output
  });

  var wid = new RenderWidget(worldDiv, renderer, worldCamera, worldScene, controls);
  // Start the draw loop (this call is async)
  wid.animate();
  

}

// call main entrypoint
main();
