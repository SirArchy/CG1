import * as THREE from 'three';
import {Vector3} from 'three';

import type {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export function setupLight(scene: THREE.Scene) {
    // add two point lights and a basic ambient light
    // https://threejs.org/docs/#api/lights/PointLight
    const light = new THREE.PointLight(0xffffcc, 1, 100);
    light.position.set(10, 30, 15);
    light.matrixAutoUpdate = true;
    scene.add(light);

    const light2 = new THREE.PointLight(0xffffcc, 1, 100);
    light2.position.set(10, -30, -15);
    light2.matrixAutoUpdate = true;
    scene.add(light2);

    //https://threejs.org/docs/#api/en/lights/AmbientLight
    scene.add(new THREE.AmbientLight(0x999999));
    return scene;
}

// define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    // https://threejs.org/docs/#api/cameras/PerspectiveCamera
    camera.near = 0.01;
    camera.far = 10;
    camera.fov = 70;
    camera.position.z = 1;
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
    camera.matrixAutoUpdate = true;
    return camera
}

// define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls) {
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableZoom = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 5;
    return controls;
}

export enum Axes {
    x = "X",
    y = "Y",
    z = "Z",
}

export const backgroundColor = "#F5DADF"
export const defaultMaterial = new THREE.MeshPhongMaterial({color: "#FD5DA8"});
export const selectedMaterial = new THREE.MeshPhongMaterial({color: "#AF69EE"});

export function createRobotGeometry(scene: THREE.Scene) {
    let axesGroup = new THREE.Group()
    axesGroup.visible = false
    scene.add(axesGroup)

    let Body = new THREE.Group()
    scene.add(Body)

    let torso = createTorso(new Vector3().set(1, 1.5, 0.5));
    Body.add(torso)

    let headJoint = addJoint(new Vector3().set(0, 1, 0), torso)
    addBodyPart(new Vector3().set(0.5, 0, 0), new Vector3().set(0, 0.4, 0), headJoint, true);

    let armLJoint = addJoint(new Vector3().set(0.675, 0.5, 0), torso)
    addBodyPart(new Vector3().set(0.85, 0.5, 0.5), new Vector3().set(0.425, 0, 0), armLJoint);

    let armRJoint = addJoint(new Vector3().set(-0.675, 0.5, 0), torso)
    addBodyPart(new Vector3().set(0.85, 0.5, 0.5), new Vector3().set(-0.425, 0, 0), armRJoint);

    let legLJoint = addJoint(new Vector3().set(0.275, -0.85, 0), torso)
    let legL = addBodyPart(new Vector3().set(0.45, 0.9, 0.5), new Vector3().set(0, -0.45, 0), legLJoint);

    let footLJoint = addJoint(new Vector3().set(0, -0.362, 0.3), legL)
    addBodyPart(new Vector3().set(0.45, 0.175, .3), new Vector3().set(0, 0, 0.15), footLJoint);

    let legRJoint = addJoint(new Vector3().set(-0.275, -0.85, 0), torso)
    let legR = addBodyPart(new Vector3().set(0.45, 0.9, 0.5), new Vector3().set(0, -0.45, 0), legRJoint);

    let footRJoint = addJoint(new Vector3().set(-0, -0.362, 0.3), legR)
    addBodyPart(new Vector3().set(0.45, 0.175, 0.3), new Vector3().set(0, 0, 0.15), footRJoint);

    updateChildren(torso)
    return {torso, axesHelpers: axesGroup}
}

export function updateAxesHelpers(object: THREE.Object3D, group: THREE.Group) {
    object.type != "Mesh" && addAxesHelper(object, group)
    object.children.forEach(child => updateAxesHelpers(child, group))
}

export function addJoint(translation: THREE.Vector3, parent: THREE.Mesh) {
    let joint = new THREE.Object3D()
    joint.userData = translation
    joint.matrix.copy(getTranslationMatrix(translation))

    parent.add(joint)
    return joint
}

export function addBodyPart(scale: THREE.Vector3, translation: THREE.Vector3, parent: THREE.Object3D, isSphere?: boolean) {
    let geometry = isSphere ? new THREE.SphereGeometry(scale.x) : new THREE.BoxGeometry(scale.x, scale.y, scale.z)
    let object = new THREE.Mesh(geometry, defaultMaterial)
    object.userData = translation
    object.matrix.copy(getTranslationMatrix(translation))

    parent.add(object)
    return object
}

export function createTorso(translation: THREE.Vector3) {
    let geometry = new THREE.BoxGeometry(translation.x, translation.y, translation.z)
    let torso = new THREE.Mesh(geometry, defaultMaterial)
    torso.userData = new THREE.Vector3()

    return torso
}

export function addAxesHelper(object: THREE.Object3D, group: THREE.Group) {
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.matrixWorld.copy(object.matrixWorld)
    group.add(axesHelper)
}

export function rotate(mesh: THREE.Mesh, axis: Axes, deg: number) {
    let rotationMatrix = new THREE.Matrix4()
    switch (axis) {
        case Axes.x:
            rotationMatrix.set(
                1, 0, 0, 0,
                0, Math.cos(deg), -Math.sin(deg), 0,
                0, Math.sin(deg), Math.cos(deg), 0,
                0, 0, 0, 1
            )
            break
        case Axes.y:
            rotationMatrix.set(
                Math.cos(deg), 0, Math.sin(deg), 0,
                0, 1, 0, 0,
                -Math.sin(deg), 0, Math.cos(deg), 0,
                0, 0, 0, 1
            )
            break
        case Axes.z:
            rotationMatrix.set(
                Math.cos(deg), -Math.sin(deg), 0, 0,
                Math.sin(deg), Math.cos(deg), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            )
            break
    }

    let rotationOrigin = (mesh.parent?.type != "Group" ? mesh.parent : mesh) as THREE.Object3D
    rotationOrigin.matrix.multiply(rotationMatrix)
    updateChildren(rotationOrigin)
}

export function getTranslationMatrix(translation: THREE.Vector3) {
    return new THREE.Matrix4().set(
        1, 0, 0, translation.x,
        0, 1, 0, translation.y,
        0, 0, 1, translation.z,
        0, 0, 0, 1
    )
}

export function resetChildren(object: THREE.Object3D) {
    object.matrix.copy(getTranslationMatrix(object.userData as THREE.Vector3))
    object.matrixWorld.multiplyMatrices(object.parent!.matrixWorld, object.matrix)
    object.children.forEach(child => resetChildren(child))
}

export function updateChildren(object: THREE.Object3D) {
    object.matrixWorld.multiplyMatrices(object.parent!.matrixWorld, object.matrix)
    object.children.forEach(grandChild => updateChildren(grandChild))
}
