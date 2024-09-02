import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreejsScene{
    constructor(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#844CB7");
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 2;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(2, 3, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addLights();
    }

    initiate(){
        this.animate();
        window.addEventListener("resize", this.windowResizeHandler)
    }

    windowResizeHandler(){
        console.log(this.renderer)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addLights(){
        const ambient =  new THREE.AmbientLight();
        const directional = new THREE.DirectionalLight();
        const directional2 = new THREE.DirectionalLight();
        directional2.position.set(1,1,1);
        this.addToScene(ambient)
        this.addToScene(directional)
        this.addToScene(directional2)
    }

    addToScene(obj){
        this.scene.add(obj);
    }

    removeFromScene(obj){
        this.scene.remove(obj);
    }

    animate(){
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(() => this.animate());
    }
}

export const group = new THREE.Group();