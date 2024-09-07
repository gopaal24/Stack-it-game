import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreejsScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#844CB7");
        this.frustumSize = 2;
        this.aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            this.frustumSize * this.aspect / -2,
            this.frustumSize * this.aspect / 2,
            this.frustumSize / 2,
            this.frustumSize / -2,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(2, 3, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addLights();
    }

    initiate() {
        this.animate();
        window.addEventListener("resize", this.windowResizeHandler.bind(this));
    }

    windowResizeHandler() {
        this.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.camera.left = -this.frustumSize * this.aspect / 2;
        this.camera.right = this.frustumSize * this.aspect / 2;
        this.camera.top = this.frustumSize / 2;
        this.camera.bottom = -this.frustumSize / 2;
        this.camera.updateProjectionMatrix();
    }

    addLights() {
        const ambient =  new THREE.AmbientLight();
        const directional = new THREE.DirectionalLight();
        const directional2 = new THREE.DirectionalLight();
        directional2.position.set(1,1,1);
        this.addToScene(ambient);
        this.addToScene(directional);
        this.addToScene(directional2);
    }

    addToScene(obj) {
        this.scene.add(obj);
    }

    removeFromScene(obj) {
        this.scene.remove(obj);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(() => this.animate());
    }
}

export const group = new THREE.Group();