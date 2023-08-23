// -------------------- GAME STATE OBJECT --------------------
/**
 * Global Game State object which stores sound file urls and sound data
 */
const GameState = {
    states: {
        start: {
            initState: () => {
                initaliseGame()

                const playButton = new StateButton(Scene.leftBorder + Scene.width / 2, Scene.floorHeight - 100, 180, 180) 
                playButton.setSprite(Sprites.playButton)
                playButton.setState(GameState.states.game)
                activeButtons.push(playButton)

                createObstacles()
            },
            function: startMenu
        },
        game: {
            initState: () => {
                activeButtons = []
                plr = new Player(Scene.width/2, Scene.floorHeight - 20)
            },
            function: runGame
        },
        settings: {
            initState: () => {},
            function: () => {}
        },
        death: {
            initState: () => {
                changeGameState(GameState.states.start)
            },
            function: () => {console.log('dead', plr)}
        },
    },

    currentState: undefined
}


// -------------------- FUNCTIONS --------------------

/**
 * Changes current game state
 * @param {Number} state
 */
function changeGameState(state) {
    GameState.currentState = state
    GameState.currentState.initState()
}


// -------------------- GAME STATES --------------------
/**
 * Start, shows start ui
 */
function startMenu() {
    // --- background ---
    sprite(Sprites.background, Scene.leftBorder, 0, Scene.width, Scene.height)

    // --- platforms, powerups, enemies ---
    visiblePlatforms.forEach(platform => {
        platform.draw()
        platform.update()
    })

    visibleEnemies.forEach(enemy => {
        enemy.draw()
        enemy.update()
    })

    activeButtons.forEach(button => {
        button.draw()
    })

    drawWindowBorder()
}

/**
 * Actual gameplay
 */
function runGame() {
    // --- background ---
    sprite(Sprites.background, Scene.leftBorder, 0, Scene.width, Scene.height)

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