import { ThreejsScene, group } from "./setupScene.js";
import { StackPlane } from "./gameEss.js";

import * as THREE from "three"; 

const game = new ThreejsScene;
let stack_index = 1;
let stackGroup = group;
let xSize = 1, zSize = 1;

game.initiate();

const initialStack = new StackPlane(game, 0);

let stackList = [];

stackList.push(initialStack.stack);

game.addToScene(stackGroup);
stackGroup.add(initialStack.stack);

let gameStack = new StackPlane(game, stack_index, stackList[0]);
gameStack.moveStack();
stackGroup.add(gameStack.stack);

function addAdditionalStack(){
    gameStack.stopStack();
    stack_index += 1;
    if(stack_index%2 == 0) xSize = gameStack.resizeStack();
    else zSize = gameStack.resizeStack();
    stackList[0] = gameStack.stack;
    gameStack = new StackPlane(game, stack_index, stackList[0], zSize, xSize);
    gameStack.moveStack();
    stackGroup.add(gameStack.stack);
}

document.addEventListener("click", ()=>{
    addAdditionalStack();
    stackGroup.position.y -= 0.3;
})

game.camera.position.y += 0.3;
game.camera.position.x -= 1;