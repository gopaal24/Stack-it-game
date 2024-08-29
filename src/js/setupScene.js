import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreejsScene{
    constructor(){
        this.scene = new THREE.Scene();
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

        this.camera.position.z = 1;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addLights();
    }

    initiate(){
        this.animate();
    }

    addLights(){
        const ambient =  new THREE.AmbientLight();
        const directional = new THREE.DirectionalLight();
        this.addToScene(ambient)
        this.addToScene(directional)
    }

    addToScene(obj){
        this.scene.add(obj);
    }

    animate(){
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(() => this.animate());
    }
}