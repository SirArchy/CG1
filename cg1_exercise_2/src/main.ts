// external dependencies
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// local from us provided utilities
import type * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';

// helper lib, provides exercise dependent pre written Code
import * as helper from './helper';
import {createCanonicalCamera, createTeddyBear, setupPlanes, toggleClippingPlane, updateCanonical} from './helper';

function callback(changed: utils.KeyValuePair<helper.Settings>) {
    switch (changed.key) {
        case "rotateX": {
            bear.rotation.x = changed.value
            break
        }
        case  "rotateY": {
            bear.rotation.y = changed.value
            break
        }
        case  "rotateZ": {
            bear.rotation.z = changed.value
            break
        }
        case "translateX": {
            bear.position.x = changed.value
            break
        }
        case "translateY": {
            bear.position.y = changed.value
            break
        }
        case "translateZ": {
            bear.position.z = changed.value
            break
        }
        case "near": {
            screenCamera.near = changed.value
            break
        }
        case "far": {
            screenCamera.far = changed.value
            break
        }
        case "fov": {
            screenCamera.fov = changed.value
            break
        }
        case "planeX0":
        case "planeX1":
        case "planeY0":
        case "planeY1":
        case "planeZ0":
        case "planeZ1":
            toggleClippingPlane(rendererCanonical, changed.key)
            break
    }
    screenCamera.updateProjectionMatrix()
    cameraHelper.update()
    updateCanonical(bear, sceneCanonical, screenCamera)
}

/*******************************************************************************
 * Main entrypoint.
 ******************************************************************************/

let settings: helper.Settings;
let screenCamera: THREE.PerspectiveCamera;
let worldCamera: THREE.PerspectiveCamera;
let canonicalCamera: THREE.OrthographicCamera;
let cameraHelper: THREE.CameraHelper
let bear: THREE.Object3D
let scene = new THREE.Scene();
let sceneCanonical = new THREE.Scene();

let rendererCanonical = new THREE.WebGLRenderer({
    antialias: true
});
setupPlanes(rendererCanonical)


function main() {
    let root = Application("Camera");
    root.setLayout([["world", "canonical", "screen"]]);
    root.setLayoutColumns(["1fr", "1fr", "1fr"]);
    root.setLayoutRows(["100%"]);

    let screenDiv = createWindow("screen");
    root.appendChild(screenDiv);

    // create RenderDiv
    let worldDiv = createWindow("world");
    root.appendChild(worldDiv);

    // create canonicalDiv
    let canonicalDiv = createWindow("canonical");
    root.appendChild(canonicalDiv);

    const rendererScreen = new THREE.WebGLRenderer({
        antialias: true
    });

    const rendererWorld = new THREE.WebGLRenderer({
        antialias: true
    });

    // set scene background
    scene.background = new THREE.Color();

    // create bear
    bear = createTeddyBear()
    scene.add(bear)

    // clone canonical scene from regular scene
    sceneCanonical = scene.clone()

    // create screen camera
    screenCamera = new THREE.PerspectiveCamera();
    helper.setupCamera(screenCamera, scene, 1, 5, 40);

    // create screenCamera helper
    cameraHelper = new THREE.CameraHelper(screenCamera)
    scene.add(cameraHelper)

    // create world camera
    worldCamera = new THREE.PerspectiveCamera();
    helper.setupCamera(worldCamera, scene, 1, 20, 40);

    // create canonical camera
    canonicalCamera = createCanonicalCamera()

    // ---------------------------------------------------------------------------
    // create Settings and create GUI settings
    settings = new helper.Settings();
    helper.createGUI(settings);
    settings.addCallback(callback);

    // animate scenes
    new RenderWidget(screenDiv, rendererScreen, screenCamera, scene).animate();
    new RenderWidget(worldDiv, rendererWorld, worldCamera, scene).animate();
    new RenderWidget(canonicalDiv, rendererCanonical, canonicalCamera, sceneCanonical).animate();

    // create orbit controls
    let screenControls = new OrbitControls(screenCamera, screenDiv);
    helper.setupControls(screenControls);
    helper.setupControls(new OrbitControls(worldCamera, worldDiv));
    helper.setupControls(new OrbitControls(canonicalCamera, canonicalDiv));

    //update initial canonical view and cameraHelper
    updateCanonical(bear, sceneCanonical, screenCamera)
    cameraHelper.update()

    // update canonical view on screen camera change
    screenControls.addEventListener("change", () => {
        cameraHelper.update()
        updateCanonical(bear, sceneCanonical, screenCamera)
    })
}

// call main entrypoint
main();
