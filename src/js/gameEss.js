import * as THREE from "three";

export class StackPlane{
    constructor(game, index) {
        this.game = game;
        this.index = index;
        this.totalStacks = 100;
        this.createMesh();
        this.clock = new THREE.Clock();
    }

    createMesh() {
        this.stack = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.3, 1),
            new THREE.MeshStandardMaterial({ color: this.generateColor() })
        );
    }

    addStack() {
        this.stack.position.y += this.index * 0.3;
        this.game.addToScene(this.stack);
    }

    generateColor() {
        const hue = (this.index / this.totalStacks) * 360;
        
        const saturation = 70;
        const lightness = 40;

        const color = new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100);

        console.log(`Stack ${this.index}: HSL(${hue}, ${saturation}%, ${lightness}%)`, color.getHexString());

        return color;
    }

    moveStack(){
        const time = this.clock.getElapsedTime();
        this.stack.position.x = 0.5*Math.sin(time);
        this.startAnimation();
    }

    startAnimation(){
        this.animation = requestAnimationFrame(()=>this.moveStack());
    }

    stopStack(){
        cancelAnimationFrame(this.animation);
    }
}

