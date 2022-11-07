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

    // create objects & add to scene
    const robotBody = new THREE.Object3D();
    const foot1 = new THREE.Object3D();
    const foot2 = new THREE.Object3D();
    scene.add(robotBody, foot1, foot2);

    // create geometries for bodies
    /*
    const robotBodyGeometry = new THREE.BoxGeometry(1, 2.5, 1);
    const headGeometry = new THREE.BoxGeometry(.5, 1.5, .5);
    const armGeometry = new THREE.BoxGeometry(.5, 3.5, 1);
    const footGeometry = new THREE.BoxGeometry(1, 3, 1);
    const toeGeometry = new THREE.BoxGeometry(.5, .5, 1);
    */

    const armGeometry = new THREE.BoxGeometry(.5, 3.5, 1);

    // create material for bodies
    const boxMaterial = new THREE.MeshPhongMaterial({emissive: 0x111111});

    // create meshes & add to scene
    /*
    const robotBodyMesh = new THREE.Mesh(robotBodyGeometry, boxMaterial);
    const headMesh = new THREE.Mesh(headGeometry, boxMaterial)
    const arm1Mesh = new THREE.Mesh(armGeometry, boxMaterial);    
    const arm2Mesh = new THREE.Mesh(armGeometry, boxMaterial);
    const foot1Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const foot2Mesh = new THREE.Mesh(footGeometry, boxMaterial);
    const toe1Mesh = new THREE.Mesh(toeGeometry, boxMaterial);
    const toe2Mesh = new THREE.Mesh(toeGeometry, boxMaterial);
    foot1.add(foot1Mesh, toe1Mesh);
    foot2.add(foot2Mesh, toe2Mesh);
    robotBody.add(robotBodyMesh, headMesh, arm1Mesh, arm2Mesh, foot1, foot2);
    */

    const arm1Mesh = new THREE.Mesh(armGeometry, boxMaterial); 
    const arm2Mesh = new THREE.Mesh(armGeometry, boxMaterial); 
    robotBody.add(arm1Mesh,arm2Mesh); 

    // create 4x4 matrices for transformations
    arm1Mesh.matrix.set(1, 2, 3, 4,
      1, 2, 3, 4,
      1, 2, 3, 4,
      1, 2, 3, 4 )
    arm1Mesh.updateMatrix();   
      
    
    const arm2PosSetup = new THREE.Matrix4();
    arm2PosSetup.set( 11, 12, 13, 14,
       21, 22, 23, 24,
       31, 32, 33, 34,
       41, 42, 43, 44 );

    const foot1PosSetup = new THREE.Matrix4();
    foot1PosSetup.set( 11, 12, 13, 14,
       21, 22, 23, 24,
       31, 32, 33, 34,
       41, 42, 43, 44 );

    const foot2PosSetup = new THREE.Matrix4();
    foot2PosSetup.set( 11, 12, 13, 14,
       21, 22, 23, 24,
       31, 32, 33, 34,
       41, 42, 43, 44 );
   
    const headPosSetup = new THREE.Matrix4();
    headPosSetup.set( 11, 12, 13, 14,
       21, 22, 23, 24,
       31, 32, 33, 34,
       41, 42, 43, 44 );
   

    // start the animation loop (async)
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();
}

// call main entrypoint
main();
