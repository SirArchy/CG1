// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RenderWidget from './lib/rendererWidget';
import { Application, createWindow, Window } from './lib/window';

import * as helper from './helper';
// put your imports here

/*******************************************************************************
 * Main entrypoint. Previouly declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/

var camera: THREE.PerspectiveCamera;
var controls: OrbitControls;
var rendererDiv: Window;

function main(){
    var root = Application("Robot");
  	root.setLayout([["renderer"]]);
    root.setLayoutColumns(["100%"]);
    root.setLayoutRows(["100%"]);

    // ---------------------------------------------------------------------------
    // create RenderDiv
    rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);

    // create renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // important exercise specific limitation, do not remove this line
    THREE.Object3D.DefaultMatrixAutoUpdate = false;

    // create scene
    var scene = new THREE.Scene();
    // manually set matrixWorld
    scene.matrixWorld.copy(scene.matrix);

    helper.setupLight(scene);

    // create camera
    camera = new THREE.PerspectiveCamera();
    helper.setupCamera(camera, scene);

    // create controls
    controls = new OrbitControls(camera, rendererDiv);
    helper.setupControls(controls);



    // NEW STUFF

    // create objects & add to scene
    const robotBody = new THREE.Object3D();
    const arm1Joint = new THREE.Object3D();
    const arm2Joint = new THREE.Object3D();
    const foot1Joint = new THREE.Object3D();
    const foot2Joint = new THREE.Object3D();
    const headJoint = new THREE.Object3D();
    const foot1 = new THREE.Object3D();
    const foot2 = new THREE.Object3D();    

    // create geometries for bodies
    const robotBodyGeometry = new THREE.BoxGeometry(2.5, 3, 1);
    const headGeometry = new THREE.BoxGeometry(1, 1, .75);
    const armGeometry = new THREE.BoxGeometry(.5, 2, .5);
    const footGeometry = new THREE.BoxGeometry(.5, 3, .5);
    const toeGeometry = new THREE.BoxGeometry(.5, .5, .5);

    // create material for bodies
    const boxMaterial = new THREE.MeshPhongMaterial({emissive: 0x111111});

    // create meshes
    const robotBodyMesh = new THREE.Mesh(robotBodyGeometry, boxMaterial);
    const headMesh = new THREE.Mesh(headGeometry, boxMaterial)
    const arm1Mesh = new THREE.Mesh(armGeometry, boxMaterial);    
    const arm2Mesh = new THREE.Mesh(armGeometry, boxMaterial);
    const foot1Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const foot2Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const toe1Mesh = new THREE.Mesh(toeGeometry, boxMaterial);
    const toe2Mesh = new THREE.Mesh(toeGeometry, boxMaterial);

    // create scene graph
    scene.add(robotBody);
    robotBody.add(arm1Joint, arm2Joint, foot1Joint, foot2Joint, headJoint);
    foot1Joint.add(foot1);
    foot2Joint.add(foot2);
    foot1.add(foot1Mesh, toe1Mesh);
    foot2.add(foot2Mesh, toe2Mesh);
    arm1Joint.add(arm1Mesh);
    arm2Joint.add(arm2Mesh);
    headJoint.add(headMesh);
    robotBody.add(robotBodyMesh);
    

    // change matrixWorld for first setup
    arm1Mesh.matrixWorld.set(1, 0, 0, 2,
      0, 1, 0, 0.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      arm1Mesh.updateMatrixWorld(); 

    arm2Mesh.matrixWorld.set(1, 0, 0, -2,
      0, 1, 0, 0.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      arm2Mesh.updateMatrixWorld(); 

    foot1Mesh.matrixWorld.set(1, 0, 0, 0.5,
      0, 1, 0, -3.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      foot1Mesh.updateMatrixWorld(); 

    foot2Mesh.matrixWorld.set(1, 0, 0, -0.5,
      0, 1, 0, -3.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      foot2Mesh.updateMatrixWorld(); 

    toe1Mesh.matrixWorld.set(1, 0, 0, 0.5,
      0, 1, 0, -4.75,
      0, 0, 1, .5,
      0, 0, 0, 1,)
      toe1Mesh.updateMatrixWorld(); 

    toe2Mesh.matrixWorld.set(1, 0, 0, -0.5,
      0, 1, 0, -4.75,
      0, 0, 1, .5,
      0, 0, 0, 1,)
      toe2Mesh.updateMatrixWorld(); 

    headMesh.matrixWorld.set(1, 0, 0, 0,
      0, 1, 0, 2.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      headMesh.updateMatrixWorld(); 

    arm1Joint.matrixWorld.set(1, 0, 0, 1,
      0, 1, 0, 0.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      arm1Joint.updateMatrixWorld(); 

    arm2Joint.matrixWorld.set(1, 0, 0, -1,
      0, 1, 0, 0.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      arm2Joint.updateMatrixWorld(); 

    foot1Joint.matrixWorld.set(1, 0, 0, 0.5,
      0, 1, 0, -1,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      foot1Joint.updateMatrixWorld(); 

    foot2Joint.matrixWorld.set(1, 0, 0, -0.5,
      0, 1, 0, -1,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      foot2Joint.updateMatrixWorld(); 

    headJoint.matrixWorld.set(1, 0, 0, 0,
      0, 1, 0, 1.5,
      0, 0, 1, 0,
      0, 0, 0, 1,)
      headJoint.updateMatrixWorld(); 
      
      headJoint.parent

    // start the animation loop (async)
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();

    // implement visible traversal of nodes
    const selectedMaterial = new THREE.MeshPhongMaterial({ color: 0x989796 });
    document.addEventListener("keydown", (evt) => {
      // implement some kind of stack to know what the previous selected node was
      switch (evt.key) {  
      case  "w":
        // select parent node
        robotBodyMesh.material = selectedMaterial;
      case "a": 
         // select previous sibling node

      case "s": 
         // select first child node

      case "d":
         // select next sibling node

      }
    });
}

// call main entrypoint
main();
