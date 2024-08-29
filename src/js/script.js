import * as THREE from "three";

import { ThreejsScene } from "./setupScene.js";
import { StackPlane } from "./gameEss.js";

const game = new ThreejsScene;
let stack_index = 1;
let stackGroup = new THREE.Group();

game.initiate();

const initialStack = new StackPlane(game, 0);
initialStack.addStack();

game.addToScene(stackGroup);
stackGroup.add(initialStack.stack);
let additionalStack = null;

addAdditionalStack();

function addAdditionalStack(){
    additionalStack = new StackPlane(game, stack_index);
    additionalStack.addStack();
    additionalStack.moveStack();
    stackGroup.add(additionalStack.stack);
}

document.addEventListener("click", ()=>{
    additionalStack.stopStack();
    stack_index += 1;
    addAdditionalStack();
    stackGroup.position.y -= 0.3;
})


game.camera.position.y += 0.3;
game.camera.position.x -= 1;