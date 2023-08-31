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
                const playButton = new CommandButton(Scene.leftBorder + Scene.width / 2 + 50, Scene.floorHeight - 100, 180, 180) 
                playButton.setSprite(Sprites.playButton)
                playButton.setState(GameState.states.game)

                const settingsButton = new CommandButton(Scene.leftBorder + Scene.width / 2 - 150, Scene.floorHeight - 100, 110, 110)
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
                const backButton = new CommandButton(Scene.leftBorder + 100, Scene.floorHeight - 100, 110, 110)
                backButton.setSprite(Sprites.backButton)
                backButton.setState(GameState.states.start)

                const volumeSlider = new Slider(Scene.leftBorder + Scene.width / 2, 210,
                                                200, 35)
                volumeSlider.setFunction(
                    () => {changeSetting("globalVolume", volumeSlider.value)}
                )
                volumeSlider.initState(Settings.globalVolume)

                const inputType = new Checkbox(Scene.leftBorder + Scene.width / 2 + 50, 305,
                                               100, 35)
                inputType.setOptions(
                    () => {changeSetting("currentInputMode", Settings.inputModes.mouse)},
                    () => {changeSetting("currentInputMode", Settings.inputModes.keys)},
                )
                inputType.initState(Settings.currentInputMode)

                activeInteractions = [backButton, volumeSlider, inputType]
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
                const playButton = new CommandButton(Scene.leftBorder + Scene.width / 2 + 50, Scene.floorHeight - 100, 180, 180) 
                playButton.setSprite(Sprites.playButton)
                playButton.setState(GameState.states.restart)

                const backButton = new CommandButton(Scene.leftBorder + 100, Scene.floorHeight - 100, 110, 110)
                backButton.setSprite(Sprites.backButton)
                backButton.setState(GameState.states.death)

                activeInteractions = [playButton, backButton]

                // --- high score ---
                if (Game.score > Game.highscore) {
                    updateHighscore(Game.score)

                    let soundCount = 3
                    let currentSound = 0

                    // high score jingle
                    let soundInterval = setInterval(() => {
                        playSound(Sounds.highscore)
                        currentSound++
                        if (currentSound === soundCount) clearInterval(soundInterval)
                    }, 100)
                }
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
    drawBackground()
    
    
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

    // --- button elements ---
    activeInteractions.forEach(interaction => {
        interaction.draw()
    })

    drawWindowBorder()
}

/**
 * Actual gameplay
 */
function runGame() {
    drawBackground()

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
    drawScore()
    drawHighscoreLine() // draws line at highscore's y position

    if (Game.score > Game.highscore && !Game.highscoreSet) {
        Game.highscoreSet = true
        playSound(Sounds.highscore)
    }
 
    drawWindowBorder()

    if (Camera.wasScrolled) createObstacles()
    Camera.wasScrolled = false

    frameTimes.push(frameRate())
    avgFrames = frameTimes.reduce((a,b) => a += b)
    avgFrames /= frameTimes.length

    if (frameTimes.length > 5) frameTimes.splice(0,1)
}


function settings() {
    drawBackground()
    
    
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

    textSize(40)
    text("Volume: ", Scene.leftBorder + 100, 200)

    text("Use Keyboard: ", Scene.leftBorder + 150, 300)

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
    drawBackground()

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
    text(`Highscore: ${Game.highscore}m`, Scene.leftBorder + Scene.width / 2, 450)

    if (Game.highscoreSet) {
        let size = abs(40 * sin(frameCount / 30)) + 35

        let r = noise(frameCount/100) * 255 + 140
        let g = noise(frameCount/200) * 255 + 80
        let b = noise(frameCount/300) * 255 + 90
        let col = color(r,g,b)

        fill(col)
        textSize(size)
        text("NEW HIGHSCORE!", Scene.leftBorder + Scene.width / 2, 350)
    }

    // --- button elements
    activeInteractions.forEach(interaction => {
        interaction.draw()
        interaction.checkHeld()
    })

    drawWindowBorder()
}