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
        const stackBody = new CANNON.Body({mass: 0});
        stackBody.addShape(stackShape);
        stackBody.position.copy(this.currentStack.position);
        this.world.addBody(stackBody)
        
    }
    
    makeFallingStack(stack){
        this.fallingStack = stack;
        const stackShape = new CANNON.Box(new CANNON.Vec3(this.fallingStack.scale.x, this.fallingStack.scale.y, this.fallingStack.scale.z));
        this.fallbody = new CANNON.Body({mass: 1});
        this.fallbody.position.copy(this.fallingStack.position);
        this.world.addBody(this.fallbody);

        this.simulate();
    }

    simulate(){
        this.delta = Math.min(this.clock.getDelta(), 0.1);
        this.world.step(this.delta);

        this.fallingStack.position.copy(this.fallbody.position);
        this.fallingStack.quaternion.set(this.fallbody.quaternion.x, this.fallbody.quaternion.y, this.fallbody.quaternion.z, this.fallbody.quaternion.w);

        requestAnimationFrame(() => this.simulate())
    }
}