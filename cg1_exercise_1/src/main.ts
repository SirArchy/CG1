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

    // an array of objects whose rotation to update
    //const objects = [];

    // create body and scene graph
    const robotBody = new THREE.Object3D();
    const foot1 = new THREE.Object3D();
    const foot2 = new THREE.Object3D();
    scene.add(robotBody, foot1, foot2);
    const bodyGeometry = new THREE.BoxGeometry(2, 5, 2);
    const armGeometry = new THREE.BoxGeometry(1, 7, 2);
    const footGeometry = new THREE.BoxGeometry(2, 6, 2);
    const toeGeometry = new THREE.BoxGeometry(1, 1, 2);

    
    const boxMaterial = new THREE.MeshPhongMaterial({emissive: 0x111111});
    const bodyMesh = new THREE.Mesh(bodyGeometry, boxMaterial);
    //bodyMesh.scale.set(5, 5, 5);
    const arm1Mesh = new THREE.Mesh(armGeometry, boxMaterial);
    arm1Mesh.position.x = 20;
    arm1Mesh.position.y = 20;
    const arm2Mesh = new THREE.Mesh(armGeometry, boxMaterial);
    arm2Mesh.position.x = 20;
    arm2Mesh.position.y = 20;
    const foot1Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const foot2Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const toe1Mesh = new THREE.Mesh(toeGeometry, boxMaterial);
    const toe2Mesh = new THREE.Mesh(toeGeometry, boxMaterial);
    foot1.add(foot1Mesh, toe1Mesh);
    foot2.add(foot2Mesh, toe2Mesh);
    robotBody.add(bodyMesh,arm1Mesh, arm2Mesh, foot1, foot2);
    //objects.push(bodyMesh);


    // start the animation loop (async)
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();
}

// call main entrypoint
main();
