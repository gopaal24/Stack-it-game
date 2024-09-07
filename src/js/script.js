import { ThreejsScene, group } from "./setupScene.js";
import { StackPlane } from "./gameEss.js";
import { GamePhys } from "./gamePhy.js";

const game = new ThreejsScene();
let stack_index = 0;
let stackGroup = group;
let stackList = [];
let fallingList = [];
let gameStarted = false;
let score = 0;

const playBtn = document.querySelector(".play-btn > img");


game.initiate();

const initialStack = new StackPlane(game, stack_index);
stack_index += 1;

stackList.push(initialStack);

game.addToScene(stackGroup);
stackGroup.add(initialStack.stack);

let gameStack = new StackPlane(game, stack_index, stackList[stack_index - 1]);
stack_index += 1;
gameStack.moveStack();
stackGroup.add(gameStack.stack);

stackList.push(gameStack);

const phys = new GamePhys(game, stackList);
phys.makeStaticCopy(initialStack.stack)

function addAdditionalStack() {
  gameStack.stopStack();
  const fallingStack = gameStack.resizeStack();
  stackList.push(gameStack);
  phys.makeStaticCopy(gameStack.stack)
  phys.makeFallingStack(fallingStack);
  fallingList[0] = fallingStack;
  gameStack = new StackPlane(game, stack_index, stackList[stack_index]);
  stack_index += 1;
  gameStack.moveStack();
  stackGroup.add(gameStack.stack);
}

document.addEventListener("click", () => {
  if(gameStarted){
    score += 1;
    document.querySelector(".scoreEl > p").textContent = `Score: ${score}`
    if(fallingList[0]) game.removeFromScene(fallingList[0])
    addAdditionalStack();
    gsap.to(stackGroup.position, {
      y: -(stack_index - 2)*0.1,
      duration: 0.2
    })
    phys.shiftStaticDown();
  }
});

playBtn.addEventListener("click", ()=>{
  console.log("clicked")
  document.querySelector(".main-container").style.display = "none";
  setInterval(()=>{
    gameStarted = true
  }, 200)
})
