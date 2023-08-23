/* Game design notes

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



    BARE MINIMUM:
        - High score system / leaderboard (half done, need start and end screen)
        - Use sprites instead of flat shapes and colours
        - Play sounds & music (done)
        - Actual start page & death page (done)

*/

// -------------------- GLOBAL VARIABLES --------------------
let plr // storess player object
let visiblePlatforms = [] // all currently visible platforms
let visibleEnemies = [] // all currently visible enemies 
let visiblePowerups = [] // all currently visible powerups

let activeButtons = [] // all current active buttons

let frameTimes = []
let avgFrames = 0

// -------------------- PRELOAD --------------------
// runs once before setup()
function preload() {
    let t = Date.now()

    loadSoundFiles()
    loadSpriteFiles()
    // initialiseDatabase()

    console.log("load time: " + (Date.now() - t) + "ms")
}

// -------------------- SETUP --------------------
// setup() runs once before draw()
function setup() {
    const sceneWidth = 600 
    
    setSceneDimensions(sceneWidth, windowHeight)
    setFloor(windowHeight)
    
    createCanvas(windowWidth, windowHeight) 

    changeGameState(GameState.states.start)
}

// -------------------- DRAW --------------------
// draw() runs every frame
function draw() {
    GameState.currentState.function()
}

// -------------------- KEYPRESSED --------------------
// runs when key is pressed
function keyPressed() {

    if (keyCode === keys.space) {
        // plr.jump()
    }

    if (keyCode === keys.leftArrow) {
        if (ceil(frameRate()) > 10) frameRate(0)
        else if (floor(frameRate()) === 0) frameRate(60)
    }

    if (keyCode === keys.upArrow) {
        frameRate(0)
        draw()
    }

    if (keyCode === keys.w || keyCode === keys.space) {
        plr.shoot()
    }
}

// -------------------- MOUSECLICKED --------------------
// runes when the mouse is clicked
function mouseClicked() {
    activeButtons.forEach(button => {
        button.checkClicked()
    })
}


// google made a change that prevented sounds from playing without consent, this is a workaround
function touchStarted() {
    let ctx = new AudioContext
    ctx.resume()
}