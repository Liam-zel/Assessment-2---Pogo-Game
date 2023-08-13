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
let activeObstacles = [] // all currently visible obstacles are stored in this array

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

    do {
        generateObstacle()
    } while (activeObstacles[activeObstacles.length - 1].y > 0)
}

// -------------------- DRAW --------------------
// draw() runs every frame
function draw() {
    background(220)

    
    plr.draw()
    // plr.debugDraw()
    
    plr.update()
    plr.move()
    
    activeObstacles.forEach(obstacle => {
        obstacle.draw()
        obstacle.update()
    })
    
    // checks for obstacles below the screen and deletes them
    deleteObstacles() 
    
    if (Camera.wasScrolled) generateObstacle()
    Camera.wasScrolled = false

    drawWindowBorder()
}

// -------------------- KEYPRESSED --------------------
// runs when key is pressed
function keyPressed() {

    if (keyCode === keys.space) {
        plr.jump()
    }
}