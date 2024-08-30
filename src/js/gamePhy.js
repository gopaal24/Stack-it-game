import * as THREE from "three";
import * as CANNON from "cannon";

export class GamePhys{
    constructor(game){
        this.world = new CANNON.World();
        this.game = game;
        this.world.gravity.set(0, -9.8, 0);

        this.clock = new THREE.Clock();
    }

    makeStaticCopy(stack){
        this.currentStack = stack;
        const stackShape = new CANNON.Box(new CANNON.Vec3(this.currentStack.scale.x, this.currentStack.scale.y, this.currentStack.scale.z));
        this.stackBody = new CANNON.Body({mass: 0});
        this.stackBody.addShape(stackShape);
        this.stackBody.position.copy(this.currentStack.position);
        this.world.addBody(this.stackBody)

        this.simulate();
    }

    simulate(){
        this.delta = Math.min(this.clock.getDelta(), 0.1);
        this.world.step(this.delta);

        requestAnimationFrame(() => this.simulate())
    }
}