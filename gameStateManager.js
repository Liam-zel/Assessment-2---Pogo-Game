// -------------------- GAME STATE OBJECT --------------------
/**
 * Global Game State object which stores sound file urls and sound data
 */
const GameState = {
    states: {
        /**
         * Generate obstacles and re-initialise game
         */
        generate: {
            initState: () => { 
                initaliseGame()
                createObstacles() 
            },
            function: () => { 
                changeGameState(GameState.states.start) 
            }
        },

        restart: {
            initState: () => {
                initaliseGame()
                createObstacles()
            },
            function: () => {
                changeGameState(GameState.states.game)
            }
        },

        /**
         * Start screen, first thing presented to user
         */
        start: {
            initState: () => {

                Game.ambientSound = Sounds.birdAmbience
                playSound(Game.ambientSound, true)

                // --- buttons ---
                const playButton = new StateButton(Scene.leftBorder + Scene.width / 2 + 50, Scene.floorHeight - 100, 180, 180) 
                playButton.setSprite(Sprites.playButton)
                playButton.setState(GameState.states.game)

                const settingsButton = new StateButton(Scene.leftBorder + Scene.width / 2 - 150, Scene.floorHeight - 100, 110, 110)
                settingsButton.setSprite(Sprites.settingsButton)
                settingsButton.setState(GameState.states.settings)

                activeInteractions = [playButton, settingsButton]

            },
            function: startMenu
        },

        /**
         * Gameplay
         */
        game: {
            initState: () => {
                activeInteractions = []
                plr = new Player(Scene.width/2, Scene.floorHeight - 20)
            },
            function: runGame
        },
        
        /**
         * Settings screen
         */
        settings: {
            initState: () => {
                const backButton = new StateButton(Scene.leftBorder + 100, Scene.floorHeight - 100, 110, 110)
                backButton.setSprite(Sprites.backButton)
                backButton.setState(GameState.states.start)

                const volumeSlider = new Slider(Scene.leftBorder + Scene.width / 2, 210,
                                                200, 35)

                activeInteractions = [backButton, volumeSlider]
            },
            function: settings
        },

        /**
         * Runs when player dies
         */
        death: {
            initState: () => {},
            function: playerDeath
        },

        /**
         * Game over screen
         */
        gameOver: {
            initState: () => {
                // --- buttons ---
                const playButton = new StateButton(Scene.leftBorder + Scene.width / 2 + 50, Scene.floorHeight - 100, 180, 180) 
                playButton.setSprite(Sprites.playButton)
                playButton.setState(GameState.states.restart)

                const backButton = new StateButton(Scene.leftBorder + 100, Scene.floorHeight - 100, 110, 110)
                backButton.setSprite(Sprites.backButton)
                backButton.setState(GameState.states.death)

                activeInteractions = [playButton, backButton]
            },
            function: gameOver
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
    
    
    // --- title ---
    imageMode(CENTER)
    sprite(Sprites.title, 
           Scene.leftBorder + Scene.width/2, 100,
           400, 250)
    imageMode(CORNER)

    // --- button elements
    activeInteractions.forEach(interaction => {
        interaction.draw()
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


function settings() {
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

    // shade box to tint background
    fill(0, 100)
    rect(Scene.leftBorder, 0, Scene.width, Scene.height)


    textSize(60)
    textAlign(CENTER, CENTER);
    strokeWeight(Game.textStyling.outlineSize)
    fill(Game.textStyling.colour)

    text("Settings", Scene.leftBorder + Scene.width / 2, 100)

    textSize(45)
    text("Volume: ", Scene.leftBorder + 100, 200)

    Settings.globalVolume = activeInteractions[1].value
    Howler.volume(Settings.globalVolume)

    // --- button elements
    activeInteractions.forEach(interaction => {
        interaction.draw()
        interaction.checkHeld()
    })

    drawWindowBorder()
}  


/**
 * When player dies
 */
function playerDeath() {
    initaliseGame()
    createObstacles()
    
    changeGameState(GameState.states.start)
}


/**
 * Game over ui
 */
function gameOver() {
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

    // shade box to tint background
    fill(0, 100)
    rect(Scene.leftBorder, 0, Scene.width, Scene.height)

    let finalScore = Game.score
    textSize(60)
    fill(Game.textStyling.colour)
    textAlign(CENTER, CENTER)
    text("Game Over", Scene.leftBorder + Scene.width / 2, 100)

    textSize(45)
    text(`Final Score: ${finalScore}m`, Scene.leftBorder + Scene.width / 2, 200)

    // --- button elements
    activeInteractions.forEach(interaction => {
        interaction.draw()
        interaction.checkHeld()
    })

    drawWindowBorder()
    // changeGameState(GameState.states.death)
}