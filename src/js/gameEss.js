import * as THREE from "three";

export class StackPlane{
    constructor(game, index, prevStack = null, xSize = 1, zSize = 1 ){
        this.game = game;
        this.index = index;
        this.totalStacks = 100;
        this.prevStack = prevStack;
        this.xSize = xSize;
        this.zSize = zSize;
        this.createMesh();
        this.addStack();
        this.clock = new THREE.Clock();
    }

    createMesh() {
        if(this.prevStack){
            this.stack = this.prevStack.clone()
            this.stack.material = new THREE.MeshStandardMaterial({ color: this.generateColor() });
        }
        else{
            this.stack = new THREE.Mesh(
                new THREE.BoxGeometry(this.xSize, 0.3, this.zSize),
                new THREE.MeshStandardMaterial({ color: this.generateColor() })
            );
        }
    }

    addStack() {
        this.stack.position.y +=  0.3;
        this.game.addToScene(this.stack);
    }

    generateColor() {
        const hue = (this.index / this.totalStacks) * 360;
        const saturation = 70;
        const lightness = 40;
        const color = new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100);
        return color;
    }
    
    getPosition(){
        return this.stack.getWorldPosition(new THREE.Vector3());
    }

    moveStack(){
        const time = this.clock.getElapsedTime();
        if(this.index%2 == 0){
            this.stack.position.x = 1.2*Math.cos(time);
        }
        else {
            this.stack.position.z = 1.2*Math.cos(time);
        }
        this.startAnimation();
    }

    resizeStack(){
        if(this.prevStack){
            console.log(1 - this.prevStack.getWorldPosition(new THREE.Vector3()).distanceTo(this.stack.getWorldPosition(new THREE.Vector3())));
            const scaleValue = Math.abs(1 - this.prevStack.getWorldPosition(new THREE.Vector3()).distanceTo(this.stack.getWorldPosition(new THREE.Vector3())));
            if(this.index%2 == 0){
                this.stack.scale.x = scaleValue;
            }
            else {
                this.stack.scale.z = scaleValue;
            }
            return scaleValue;
        }
    }

    startAnimation(){
        this.animation = requestAnimationFrame(()=>this.moveStack());
    }

    stopStack(){
        cancelAnimationFrame(this.animation);
    }
}

