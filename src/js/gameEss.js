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
    this.time = 0;
  }

  createMesh() {
    if (this.prevStack) {
      const prevStackSize = this.prevStack.stack.geometry.parameters;
      this.stack = new THREE.Mesh(
        new THREE.BoxGeometry(
          prevStackSize.width,
          prevStackSize.height,
          prevStackSize.depth
        ),
        new THREE.MeshStandardMaterial({ color: this.generateColor() })
      );
      this.stack.position.copy(this.prevStack.stack.position);
    } else {
      this.stack = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.1, 1),
        new THREE.MeshStandardMaterial({ color: this.generateColor() })
      );
    }
  }

  addStack() {
    this.stack.position.y = this.index * 0.1;
    this.game.addToScene(this.stack);
  }

  generateColor() {
    const hue = ((this.index + 15) / this.totalStacks) * 360;
    const saturation = 70;
    const lightness = 40;
    const color = new THREE.Color().setHSL(
      hue / 360,
      saturation / 100,
      lightness / 100
    );
    return color;
  }

  getPosition() {
    return this.stack.getWorldPosition(new THREE.Vector3());
  }

  moveStack() {
    const time = this.clock.getElapsedTime();
    const prevStackSize = this.prevStack.stack.geometry.parameters;
    if (this.index % 2 == 0) {
      this.stack.position.x =
        this.prevStack.stack.position.x +
        (prevStackSize.width + prevStackSize.width * 0.2) * Math.cos(time);
    } else {
      this.stack.position.z =
        this.prevStack.stack.position.z +
        (prevStackSize.depth + prevStackSize.depth * 0.2) * Math.cos(time);
    }
    this.startAnimation();
  }

  resizeStack() {
    let newSize;
    const oldSize = this.prevStack.stack.geometry.parameters;
    newSize = {
      x: oldSize.width,
      y: oldSize.height,
      z: oldSize.depth,
    };
    let distance, direction, axis;


    if (this.index % 2 === 0) {
      distance = Math.abs(
        this.stack.position.x - this.prevStack.stack.position.x
      );
      direction = Math.sign(
        this.stack.position.x - this.prevStack.stack.position.x
      );
      axis = "x";
      if (distance > oldSize.width) {
        newSize.x = 0;
        newSize.y = 0.1;
        newSize.z = 1;
        this.stack.geometry = new THREE.BoxGeometry(0, 0, 0);
        return this.slicedStack(axis, direction, distance, oldSize, newSize, true);
      }
      else if(distance < oldSize.width*0.05) {
        this.stack.geometry = new THREE.BoxGeometry(newSize.x, newSize.y, newSize.z);
        this.stack.position.x = this.prevStack.stack.position.x;
        return this.slicedStack(axis, direction, distance, oldSize, newSize, false);
      }
    } 
    
    
    else {
      distance = Math.abs(
        this.stack.position.z - this.prevStack.stack.position.z
      );
      direction = Math.sign(
        this.stack.position.z - this.prevStack.stack.position.z
      );
      axis = "z";
      if (distance > oldSize.depth) {
        newSize.x = 1;
        newSize.y = 0.1;
        newSize.z = 0;
        this.stack.geometry = new THREE.BoxGeometry(0, 0, 0);
        return this.slicedStack(axis, direction, distance, oldSize, newSize, true);
      }
      else if(distance < oldSize.depth*0.05) {
        this.stack.geometry = new THREE.BoxGeometry(newSize.x, newSize.y, newSize.z);
        this.stack.position.z = this.prevStack.stack.position.z;
        return this.slicedStack(axis, direction, distance, oldSize, newSize, false);
      }
    }


    if (axis === "x") {
      newSize.x = oldSize.width - distance;
      this.stack.position.x =
        this.prevStack.stack.position.x +
        direction * (oldSize.width / 2 - newSize.x / 2);
    } else {
      newSize.z = oldSize.depth - distance;
      this.stack.position.z =
        this.prevStack.stack.position.z +
        direction * (oldSize.depth / 2 - newSize.z / 2);
    }

    this.stack.geometry = new THREE.BoxGeometry(
      newSize.x,
      newSize.y,
      newSize.z
    );

    return this.slicedStack(axis, direction, distance, oldSize, newSize, true);
  }

  slicedStack(axis, direction, distance, oldSize, currSize, shouldFall) {
    const fallStackSize = {
      x: currSize.x,
      y: currSize.y,
      z: currSize.z,
    };

    const fallStackPos = {
      x: this.stack.position.x,
      y: this.stack.position.y - this.index * 0.1,
      z: this.stack.position.z,
    };

    if(shouldFall){
      if (axis == "x") {
        fallStackSize.x = oldSize.width - currSize.x;
        fallStackPos.x =
          this.stack.position.x +
          direction * (currSize.x / 2 + fallStackSize.x / 2);
      } else {
        fallStackSize.z = oldSize.depth - currSize.z;
        fallStackPos.z =
          this.stack.position.z +
          direction * (currSize.z / 2 + fallStackSize.z / 2);
      }
    }
    else{
      fallStackSize.x = 0;
      fallStackSize.y = 0;
      fallStackSize.z = 0;
    }


    const fallingStack = new THREE.Mesh(
      new THREE.BoxGeometry(fallStackSize.x, fallStackSize.y, fallStackSize.z),
      this.stack.material
    );

    fallingStack.position.copy(fallStackPos);
    this.game.addToScene(fallingStack);

    return fallingStack;
  }

  startAnimation() {
    this.animation = requestAnimationFrame(() => this.moveStack());
  }

  stopStack() {
    cancelAnimationFrame(this.animation);
  }
}
