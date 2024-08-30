import * as THREE from "three";

export class StackPlane {
    constructor(game, index, prevStack = null) {
        this.game = game;
        this.index = index;
        this.totalStacks = 100;
        this.prevStack = prevStack;
        this.createMesh();
        this.addStack();
        this.stepTimer = null;
        this.clock = new THREE.Clock();
    }

    createMesh() {
        if (this.prevStack) {
            this.stack = this.prevStack.clone();
            this.stack.material = new THREE.MeshStandardMaterial({ color: this.generateColor() });

            this.stack.scale.copy(this.prevStack.scale);
        } else {
            this.stack = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.1, 1),
                new THREE.MeshStandardMaterial({ color: this.generateColor() })
            );
        }
    }

    addStack() {
        this.stack.position.y += 0.1;
        this.game.addToScene(this.stack);
    }

    generateColor() {
        const hue = (this.index / this.totalStacks) * 360;
        const saturation = 70;
        const lightness = 40;
        const color = new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100);
        return color;
    }

    getPosition() {
        return this.stack.getWorldPosition(new THREE.Vector3());
    }

    moveStack() {
        const time = this.clock.getElapsedTime();
        if (this.index % 2 == 0) {
            this.stack.position.x = this.prevStack.position.x + (this.prevStack.scale.x + 0.2)* Math.cos(time);
        } else {
            this.stack.position.z = this.prevStack.position.z + (this.prevStack.scale.z + 0.2)* Math.cos(time);
        }
        this.startAnimation();
    }

    resizeStack() {
        if (this.prevStack) {
            const prevPos = this.prevStack.position;
            const currentPos = this.stack.position;
            
            let distance, direction, axis;
            if (this.index % 2 === 0) {
                distance = Math.abs(currentPos.x - prevPos.x);
                direction = Math.sign(currentPos.x - prevPos.x);
                axis = 'x';
            } else {
                distance = Math.abs(currentPos.z - prevPos.z);
                direction = Math.sign(currentPos.z - prevPos.z);
                axis = 'z';
            }

            const prevSize = this.prevStack.scale[axis];
            const overlap = Math.max(0, prevSize - distance);
            const scaleValue = overlap / prevSize;

            if (axis === 'x') {
                this.stack.scale.x = scaleValue * this.prevStack.scale.x;
                this.stack.position.x = prevPos.x + (direction * (prevSize - overlap) / 2);
            } else {
                this.stack.scale.z = scaleValue * this.prevStack.scale.z;
                this.stack.position.z = prevPos.z + (direction * (prevSize - overlap) / 2);
            }

            // Adjust the position to align with the edge of the previous stack
            if (scaleValue > 0) {
                if (axis === 'x') {
                    this.stack.position.x = prevPos.x + (direction * (prevSize - overlap) / 2);
                } else {
                    this.stack.position.z = prevPos.z + (direction * (prevSize - overlap) / 2);
                }
            }

            return scaleValue;
        }
    }

    startAnimation() {
        this.animation = requestAnimationFrame(() => this.moveStack());
    }

    stopStack() {
        cancelAnimationFrame(this.animation);
    }
}