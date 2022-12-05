import * as THREE from 'three';
import {Camera, Matrix4, Mesh, Object3D, Scene, Vector3, Vector4} from 'three';
import type {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// local from us provided utilities
import * as utils from './lib/utils';
import {createTeddyBear} from "./teddy";

/*******************************************************************************
 * helper functions to build scene (geometry, light), camera and controls.
 ******************************************************************************/

export {createTeddyBear} from './teddy';

export enum Planes {
    "planeX0",
    "planeX1",
    "planeY0",
    "planeY1",
    "planeZ0",
    "planeZ1",
}

/*******************************************************************************
 * Defines Settings and GUI will later be seperated into settings.ts
 ******************************************************************************/

// (default) Settings.
export class Settings extends utils.Callbackable {
    // different setting types are possible (e.g. string, enum, number, boolean)
    near: number = 1;
    far: number = 5;
    fov: number = 40;
    planeX0: boolean = true;
    planeX1: boolean = true;
    planeY0: boolean = true;
    planeY1: boolean = true;
    planeZ0: boolean = true;
    planeZ1: boolean = true;
    rotateX: number = 0;
    rotateY: number = 0;
    rotateZ: number = 0;
    translateX: number = 0;
    translateY: number = 0;
    translateZ: number = 0;
}

// create GUI given a Settings object
export function createGUI(params: Settings): dat.GUI {
    // we are using dat.GUI (https://github.com/dataarts/dat.gui)
    let gui: dat.GUI = new dat.GUI();

    // build GUI
    let cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(params, 'near', 0.25, 5, 0.25).name('Near Plane');
    cameraFolder.add(params, 'far', 0.25, 5, 0.25).name('Far Plane');
    cameraFolder.add(params, 'fov', 1, 180, 1).name('Field of View');

    let planeFolder = gui.addFolder('Planes');
    planeFolder.add(params, 'planeX0').name('Plane left');
    planeFolder.add(params, 'planeX1').name('Plane right');
    planeFolder.add(params, 'planeY0').name('Plane bottom');
    planeFolder.add(params, 'planeY1').name('Plane top');
    planeFolder.add(params, 'planeZ0').name('Plane back');
    planeFolder.add(params, 'planeZ1').name('Plane front');

    let modelFolder = gui.addFolder('Model');
    modelFolder.add(params, 'rotateX', -Math.PI, Math.PI, 0.05).name('RotateX');
    modelFolder.add(params, 'rotateY', -Math.PI, Math.PI, 0.05).name('RotateY');
    modelFolder.add(params, 'rotateZ', -Math.PI, Math.PI, 0.05).name('RotateZ');

    modelFolder.add(params, 'translateX', -2, 2, 0.05).name('TranslateX');
    modelFolder.add(params, 'translateY', -2, 2, 0.05).name('TranslateY');
    modelFolder.add(params, 'translateZ', -2, 2, 0.05).name('TranslateZ');

    return gui;
}

// define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene, near: number, far: number, fov: number) {
    // https://threejs.org/docs/#api/cameras/PerspectiveCamera
    camera.near = near;
    camera.far = far;
    camera.fov = fov;
    camera.position.z = 3;
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix()
    return camera
}

export function createCanonicalCamera() {
    let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
    camera.position.z = 3;
    return camera;
}

export function setupCube(scene: THREE.Scene) {
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let geo = new THREE.EdgesGeometry(geometry);
    let cubeMat = new THREE.LineBasicMaterial({color: 0xff8010, linewidth: 2});
    let wireframe = new THREE.LineSegments(geo, cubeMat);
    wireframe.position.set(0, 0, 0);
    scene.add(wireframe);
    return scene
}

// define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls) {
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.keys = {LEFT: "KeyA", UP: "KeyW", RIGHT: "KeyD", BOTTOM: "KeyS"};
    controls.listenToKeyEvents(document.body);
    controls.minDistance = 0.1;
    controls.maxDistance = 25;
    return controls;
}

// updates the canonicalViewingWindow
export function updateCanonical(screenBear: Object3D, sceneCanon: Scene, screenCamera: Camera) {
    sceneCanon.clear()
    setupCube(sceneCanon)

    let canonBear = cloneBear(screenBear)

    screenCamera.updateMatrixWorld()
    transformObject(canonBear, screenCamera)

    sceneCanon.add(canonBear)
}

// clones bear from given bear
export function cloneBear(orgBear: THREE.Object3D) {
    let destBear = createTeddyBear()

    destBear.position.copy(orgBear.position)
    destBear.rotation.copy(orgBear.rotation)
    destBear.updateMatrixWorld()

    return destBear
}

// traverses the object while applying transformation
export function transformObject(object: Object3D, screenCamera: Camera) {
    object.traverse(child => transformVertices(child, screenCamera))
}

// transform all vertices of object to NDC
export function transformVertices(object: Object3D, screenCamera: Camera) {
    if (object instanceof Mesh) {
        let vertices = object.geometry.getAttribute("position")
        const vertex = new Vector3();

        // iterate each vertex and transform into NDC
        for (let i = 0; i < vertices.count; i++) {
            vertex.fromBufferAttribute(vertices, i)
            let NDC = getNDC(vertex, object, screenCamera)
            vertices.setXYZ(i, NDC.x, NDC.y, -NDC.z)
        }
    }

    //set matrix to identity
    object.position.set(0, 0, 0)
    object.rotation.set(0, 0, 0)
    object.scale.set(1, 1, 1)
    object.updateMatrix()
}

// return NDC of given vertex
export function getNDC(vertex: THREE.Vector3, object: THREE.Object3D, screenCamera: THREE.Camera) {
    let localPoint = new Vector4(vertex.x, vertex.y, vertex.z, 1)
    let worldSpacePoint = applyMatrix(localPoint, object.matrixWorld)
    let viewSpacePoint = applyMatrix(worldSpacePoint, screenCamera.matrixWorldInverse)
    let clipCoords = applyMatrix(viewSpacePoint, screenCamera.projectionMatrix)
    let w = clipCoords.w

    return new Vector3(clipCoords.x / w, clipCoords.y / w, clipCoords.z / w)
}

// applies matrix4 to a vertex (vector4)
export function applyMatrix(vertex: Vector4, matrix4: Matrix4) {
    let e = matrix4.elements
    return new Vector4().set((e[0] * vertex.x) + (e[4] * vertex.y) + (e[8] * vertex.z) + (e[12] * vertex.w),
        (e[1] * vertex.x) + (e[5] * vertex.y) + (e[9] * vertex.z) + (e[13] * vertex.w),
        (e[2] * vertex.x) + (e[6] * vertex.y) + (e[10] * vertex.z) + (e[14] * vertex.w),
        (e[3] * vertex.x) + (e[7] * vertex.y) + (e[11] * vertex.z) + (e[15] * vertex.w))
}

// toggles specific clipping plane of given renderer
export function toggleClippingPlane(renderer: THREE.WebGLRenderer, planeID: string) {
    let plane = new THREE.Plane(undefined, 1.000001)
    switch (planeID) {
        case "planeX0":
            plane.normal.set(1, 0, 0)
            break
        case "planeX1":
            plane.normal.set(-1, 0, 0)
            break
        case "planeY0":
            plane.normal.set(0, 1, 0)
            break
        case "planeY1":
            plane.normal.set(0, -1, 0)
            break
        case "planeZ0":
            plane.normal.set(0, 0, 1)
            break
        case "planeZ1":
            plane.normal.set(0, 0, -1)
            break
    }

    let filtered = renderer.clippingPlanes.filter(item => (item as THREE.Plane).equals(plane))

    if (filtered.length === renderer.clippingPlanes.length) {
        renderer.clippingPlanes.push(plane)
    } else {
        renderer.clippingPlanes = filtered
    }
}

// toggle on every clipping plane of given renderer
export function setupPlanes(renderer: THREE.WebGLRenderer) {
    Object.values(Planes).forEach(plane => toggleClippingPlane(renderer, plane.toString()))
}
