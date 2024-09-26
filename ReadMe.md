
# Stack it up

An attempt to recreate the classic **Stack** game.

***Experience a modern take on the classic Stack It game! Built with 3D graphics and real-time physics, 'Stack It Up' challenges your precision and reflexes. Play in your browser or dive into the augmented reality version for an immersive experience.***


**Technologies Used**:

* **Three.js** : Handles 3D rendering and animations.
* **Cannon-es.js**: Implements realistic physics simulation.

Play game here -> [Stack it up](https://gopaal24.github.io/Stack-it-game/)\
Try the AR version here -> [Stack it up AR](https://p.plugxr.com/d5efYWf)

## Slicing of stacks

#### src/js/gameEss.js:

```
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
```

### Creating Falling stack 
#### src/js/gameEss.js

```
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
```

## physics

### Basic setup

```
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
    .
    .
    .
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

```

### Creation of static stack physics
#### src/js/gamePhy.js:

```
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
```

### Creation of falling stack physics
#### src/js/gamePhy.js:

```
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
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

