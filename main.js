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
        - High score system / leaderboard
        - Play sounds & music
        - Use sprites instead of flat shapes and colours
        - Actual start page & death page

*/

// -------------------- GLOBAL VARIABLES --------------------
let plr // player object, initialised in setup()
let visiblePlatforms = [] // all currently visible platforms are stored in this array
let visibleEnemies = [] // all currently visible enemies are stored in this array
let visiblePowerups = [] // all currently visible powerups are stored in this array

let frameTimes = []
let avgFrames = 0

// -------------------- PRELOAD --------------------
// runs once before setup()
function preload() {
    loadSoundFiles()
}

// -------------------- SETUP --------------------
// setup() runs once before draw()
function setup() {
    const sceneWidth = 600 

    
    setSceneDimensions(sceneWidth, windowHeight)
    setFloor(windowHeight)
    
    createCanvas(windowWidth, windowHeight);
    
    plr = new Player(Scene.width/2, Scene.floorHeight - 20)

    createObstacles()

    // initialiseDatabase()
}

// -------------------- DRAW --------------------
// draw() runs every frame
function draw() {
    background(220)

    // --- platforms, powerups, enemies ---
    visiblePlatforms.forEach(platform => {
        platform.draw()
        platform.update()
    })

    // checks for platforms below the screen and deletes them
    deletePlatforms() 

    visibleEnemies.forEach(enemy => {
        enemy.draw()
        enemy.update()
    })
    
    // checks for enemies below the screen and deletes them
    deleteEnemies()

    // --- player ---
    plr.draw()
    // plr.debugDraw()

    plr.update()
    plr.move()

    // --- sounds ---
    // checks for finished sounds and delets them
    // deleteSounds()

    // --- UI ---
    // draws current score to screen
    drawScore()
 
    drawWindowBorder()

    if (Camera.wasScrolled) createObstacles()
    Camera.wasScrolled = false

    frameTimes.push(frameRate())
    avgFrames = frameTimes.reduce((a,b) => a += b)
    avgFrames /= frameTimes.length

    if (frameTimes.length > 5) frameTimes.splice(0,1)
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


// google made a change that prevented sounds from playing without consent, this is a workaround
function touchStarted() {
    let ctx = new AudioContext
    ctx.resume()
}