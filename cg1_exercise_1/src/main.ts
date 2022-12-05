// external dependencies
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import RenderWidget from './lib/rendererWidget';
import {Application, createWindow, Window} from './lib/window';

// put your imports here
import {degToRad} from './lib/utils';
import * as helper from './helper';
import {
    Axes,
    backgroundColor,
    createRobotGeometry,
    defaultMaterial,
    resetChildren,
    rotate,
    selectedMaterial,
    updateAxesHelpers
} from './helper';

/*******************************************************************************
 * Main entrypoint. Previously declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let rendererDiv: Window;
let selectedPart = new THREE.Mesh()
let childIndex = 0

export function switchSelected(currentSelected: THREE.Mesh) {
    selectedPart.material = defaultMaterial
    selectedPart = currentSelected
    currentSelected.material = selectedMaterial
}

function main() {
    const root = Application("Robot");
    root.setLayout([["renderer"]]);
    root.setLayoutColumns(["100%"]);
    root.setLayoutRows(["100%"]);

    // ---------------------------------------------------------------------------
    // create RenderDiv
    rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);

    // create renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // important exercise specific limitation, do not remove this line
    THREE.Object3D.DefaultMatrixAutoUpdate = false;

    // create scene
    const scene = new THREE.Scene();

    //set background
    scene.background = new THREE.Color();
    scene.background.set(backgroundColor)
    scene.matrixWorld.copy(scene.matrix);

    //create robot + axes
    let {torso, axesHelpers} = createRobotGeometry(scene)

    //select torso
    switchSelected(torso)

    helper.setupLight(scene);

    camera = new THREE.PerspectiveCamera();
    helper.setupCamera(camera, scene);

    controls = new OrbitControls(camera, rendererDiv);
    helper.setupControls(controls);

    // start the animation loop (async)
    const wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();

    document.addEventListener("keypress", e => {
        switch (e.key) {
            case "w":
                if (selectedPart.uuid != torso.uuid) {
                    switchSelected(selectedPart.parent?.parent as THREE.Mesh)
                    childIndex = 0
                }
                return
            case "s":
                if (selectedPart.children.length > 0) {
                    switchSelected(selectedPart.children[0].children[0] as THREE.Mesh)
                    childIndex = 0
                }
                return;
            case "d":
                if (selectedPart.uuid != torso.uuid) {
                    selectedPart.parent!.parent!.children.length == childIndex + 1 && (childIndex = -1)
                    switchSelected(selectedPart.parent!.parent!.children[++childIndex].children[0] as THREE.Mesh)
                }
                return;
            case "a":
                (childIndex == 0 && selectedPart.uuid != torso.uuid) && (childIndex = selectedPart.parent!.parent!.children.length)
                switchSelected(selectedPart.parent!.parent!.children[--childIndex].children[0] as THREE.Mesh)
                return;
            case "c":
                updateAxesHelpers(torso, axesHelpers.clear())
                axesHelpers.visible = !axesHelpers.visible
                return;
            case "r":
                resetChildren(torso)
                switchSelected(torso as THREE.Mesh)
                updateAxesHelpers(torso, axesHelpers.clear())
        }
    })

    document.addEventListener("keydown", e => {
        switch (e.key) {
            case "ArrowUp":
                rotate(selectedPart, Axes.x, degToRad(-2))
                break
            case "ArrowDown":
                rotate(selectedPart, Axes.x, degToRad(2))
                break
            case "ArrowLeft":
                rotate(selectedPart, Axes.z, degToRad(2))
                break
            case "ArrowRight":
                rotate(selectedPart, Axes.z, degToRad(-2))
                break
        }
        updateAxesHelpers(torso, axesHelpers.clear())
    })
}

// call main entrypoint
main();
