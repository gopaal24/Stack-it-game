import * as THREE from "three";
import * as CANNON from "cannon";
import CannonDebugger from "cannon-es-debugger";
export class GamePhys {
  constructor(game, stackList) {
    this.world = new CANNON.World();
    this.game = game;
    this.world.gravity.set(0, -9.8, 0);
    this.stackList = [];
    this.list = stackList;

    this.clock = new THREE.Clock();

    this.cannonDebugger = new CannonDebugger(this.game.scene, this.world, {
      color: 0x00ff00,
    });
  }

  makeStaticCopy(stack) {
    this.currentStack = stack;
    const size = this.currentStack.geometry.parameters;
    const stackShape = new CANNON.Box(
      new CANNON.Vec3(size.width / 2, size.height / 2, size.depth / 2)
    );
    this.stackBody = new CANNON.Body({ mass: 0 });
    this.stackBody.addShape(stackShape);
    this.stackBody.position.copy(this.currentStack.position);

    this.world.addBody(this.stackBody);
    this.stackList.push(this.stackBody);

    return this.stackBody;
  }

  shiftStaticDown() {
    this.stackList.forEach((stackBody, index) => {
      stackBody.position.y = -0.1 * (this.stackList.length - index - 1);
    });
  }

  makeFallingStack(stack) {
    this.fallingStack = stack;
    const size = this.fallingStack.geometry.parameters;
    const stackShape_fall = new CANNON.Box(
      new CANNON.Vec3(size.width / 2, size.height / 2, size.depth / 2)
    );
    this.fallbody = new CANNON.Body({ mass: 1 });
    this.fallbody.addShape(stackShape_fall);
    this.fallbody.position.copy(this.fallingStack.position);
    this.world.addBody(this.fallbody);
    this.simulate();
  }

  simulate() {
    this.world.fixedStep();

    this.fallingStack.position.copy(this.fallbody.position);
    this.fallingStack.quaternion.set(
      this.fallbody.quaternion.x,
      this.fallbody.quaternion.y,
      this.fallbody.quaternion.z,
      this.fallbody.quaternion.w
    );

    // this.cannonDebugger.update();

    requestAnimationFrame(() => this.simulate());
  }
}
