import { setupGround, updateGround } from "./ground.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"


const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreen = document.querySelector('[data-start-screen]')

setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener("keydown", handleStart, {once: true})

setupGround()

let lastTime
let speedScale
let score
function update(time) {
    if(lastTime == null) {
       lastTime = time
       window.requestAnimationFrame(update)
       return
    }
    const delta = time - lastTime
    
    updateGround(delta, speedScale)
    updateSpeedScale(delta)
    updateCactus(delta, speedScale)
    updateDino(delta, speedScale)
    updateScore(delta)
    if(checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)

}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollison(rect, dinoRect))
}

function isCollison(rect1, rect2) {
    return (
         rect1.left < rect2.right &&
         rect1.top < rect2.bottom &&
         rect1.right > rect2.left && 
         rect1.bottom > rect2.top
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}
function updateScore(delta) {
    score += delta * .01
    scoreElem.textContent = Math.floor(score)
}


function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreen.classList.add("hide")
    window.requestAnimationFrame(update)

}

function handleLose() {
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once: true})
        startScreen.classList.remove("hide")
    }, 100)
}

function setPixelToWorldScale() {
    let worldToScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToScale}px`
}