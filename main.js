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

*/

// -------------------- GLOBAL VARIABLES --------------------
let plr // player object, initialised in setup()
let visiblePlatforms = [] // all currently visible platforms are stored in this array
let visibleEnemies = [] // all currently visible enemies are stored in this array
let visiblePowerups = [] // all currently visible powerups are stored in this array

// -------------------- PRELOAD --------------------
// runs once before setup()
function preload() {

}

// -------------------- SETUP --------------------
// setup() runs once before draw()
function setup() {
    const sceneWidth = 600 

    
    setSceneDimensions(sceneWidth, windowHeight)
    setFloor(windowHeight)
    
    createCanvas(windowWidth, windowHeight);
    
    plr = new Player(Scene.width/2, Scene.floorHeight - 20)

    createPlatforms()
}

// -------------------- DRAW --------------------
// draw() runs every frame
function draw() {
    background(220)

    plr.draw()
    // plr.debugDraw()

    plr.update()
    plr.move()

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

    // draws current score to screen
    drawScore()
 
    if (Camera.wasScrolled) createPlatforms()
    Camera.wasScrolled = false

    drawWindowBorder()
}

// -------------------- KEYPRESSED --------------------
// runs when key is pressed
function keyPressed() {

    if (keyCode === keys.space) {
        plr.jump()
    }

    if (keyCode === keys.leftArrow) {
        frameRate(0)
    }

    if (keyCode === keys.rightArrow) {
        frameRate(60)
    }
}