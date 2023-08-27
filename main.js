/* 
    TODO:
        - dont have GameState, Scene etc, as their own global objects
            put them under Game 
            e.g "const Scene = {}" --> "Game.Scene = {}"
        - special function for ambient sound
        - argument for sound volume
        - better sliders, or just use p5js sliders
            - implement step size
            - read values better (e.g, for volume, I have to set Settings.globalVolume = activeInteractions[1].value, this bad)
        - states need renaming
        - Improve slider

Game design notes

    - Different enemies and platforms need to have different appearance apart from colour
        - better for colour blind people

    - boss fight every 10,000 score or so
        - funny camera zoom in and name
        - dialogue??
        - shoot it to progress
        - bullet hell?
            - different idea for each boss

    - different game modes?
        - all jetpacks
        - no enemies
        - piano tiles mode
        - horizontal mode


*/

// -------------------- GLOBAL VARIABLES --------------------
let plr = new Player()// storess player object
let visiblePlatforms = [] // all currently visible platforms
let visibleEnemies = [] // all currently visible enemies 
let visiblePowerups = [] // all currently visible powerups

let activeInteractions = [] // all current active interactible screen elements

let frameTimes = []
let avgFrames = 0

// -------------------- PRELOAD --------------------
// runs once before setup()
function preload() {
    let t = Date.now()

    loadSoundFiles()
    loadSpriteFiles()
    // initialiseDatabase()

    initSettings()

    console.log("load time: " + (Date.now() - t) + "ms")
}

// -------------------- SETUP --------------------
// setup() runs once before draw()
function setup() {
    const sceneWidth = 600 
    
    let font = loadFont(Game.textStyling.font)
    textFont(font)

    setSceneDimensions(sceneWidth, windowHeight)
    setFloor(windowHeight)
    
    createCanvas(windowWidth, windowHeight) 

    changeGameState(GameState.states.generate)
}

// -------------------- DRAW --------------------
// draw() runs every frame
function draw() {
    GameState.currentState.function()
}

// -------------------- KEYPRESSED --------------------
// runs when key is pressed
function keyPressed() {

    if (Game.debugMode) {
        debugKeyBinds(keyCode)
    }

    if (keyCode === keys.w || keyCode === keys.space) {
        plr.shoot()
    }
}

// -------------------- MOUSE EVENTS --------------------
// runes when the mouse is clicked
function mouseClicked() {
    // activeInteractions.forEach(button => {
    //     button.checkClicked()
    // })
}

function mousePressed() {
    activeInteractions.forEach(interaction => {
        interaction.checkClicked()
    })
}

function touchStarted() {
    visiblePlatforms = []
    activeInteractions.forEach(interaction => {
        interaction.checkClicked()
    })
}

function mouseReleased() {
    activeInteractions.forEach(interaction => {
        interaction.clicked = false
    })
}


function touchEnded() {
    activeInteractions.forEach(interaction => {
        interaction.clicked = false
    })
}


// google made a change that prevented sounds from playing without consent, this is a workaround
function touchStarted() {
    let ctx = new AudioContext
    ctx.resume()
}