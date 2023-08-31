// -------------------- GAME OBJECT --------------------
/**
 * Global object that defines important game variables
 */
const Game = {
    score: 0,
    scoreMulti: 0.25, // multiply given amounts by scoreMulti 
                      // if score is based off height in pixels, 
                      // getting high numbers is too easy and unrewarding

    debugMode: false,

    touchTime: 0,

    scoreTextStyling: { 
        fontSize: 45,
        outlineSize: 5,
        colour: '#FDFEDE',
        yPos: 60
    },

    textStyling: {
        outlineSize: 5,
        colour: '#CAE6B3',
        font: 'fonts/Amaranth.ttf'
    },


    ambientSound: undefined,

    // --- initial game values ---
    // game values that change have to have their initial values stored here
    initialGameValues: {
        score: 0,

        powerupChance: 100, // 1 in powerupChance for a platform to have a powerup generated with it

        maxPlatformDistance: 130,
        minPlatformDistance: 0,

        enemySpacing: 1000,

        finishedGeneration: false,
        floorKills: false,

        highscoreSet: false,

        heightTint: undefined,
    },

    powerupChance: undefined,
    powerupCombos: {
        all: ["all"],
        noBubbleBlower: [0, 1],
        onlyBubbleBlower: [2],
    },
    availablePowerups: [],

    maxPlatformDistance: undefined,
    minPlatformDistance: undefined,

    enemySpacing: undefined,

    generationMax: -150,
    generationTypes: {
        /* Platforms */
        all: ["all"],
        onlyGreen: [0],
        greenAndBreaking: [0,1],
        onlyMoving: [2],
        movingAndBreaking: [1,2],

        /* Enemies */
        basicEnemy: [0],
        fakePlatform: [1],
    },
    finishedGeneration: false,

    highscore: localStorage.getItem("highscore"),
    highscoreSet: undefined,

    heightTint: undefined,

    floorKills: undefined,
}


// -------------------- FUNCTIONS --------------------
/**
 * Updates the player's current score
 * @param {Number} amount the score amount being added to the player's current score
 */
function updateScore(amount) {
    if (amount < 0) return
    Game.score += round(amount * Game.scoreMulti)
}


/**
 * Draws the current score to the top center of the screen
 */
function drawScore() {
    push()
    rectMode(CENTER)

    strokeWeight(Game.scoreTextStyling.outlineSize)
    fill(Game.scoreTextStyling.colour)
    textSize(Game.scoreTextStyling.fontSize)
    textAlign(CENTER)
    
    text(Game.score + "m", windowWidth/2, Game.scoreTextStyling.yPos)
    // if (avgFrames < 40) fill(255, 0, 0)
    // text(floor(avgFrames) + "fps", windowWidth/2, Scene.height - Game.scoreTextStyling.yPos)

    pop()
}


/**
 * Generates all platforms, powerups and enemies in advance of the player
 * This generation is based off the players score
 */
function createObstacles() {

    if (Game.score < 1000) {
        Game.powerupChance = 35
        setBackgroundSprite(Sprites.skyBackground)
        
        setAvailablePowerups(Game.powerupCombos.noBubbleBlower)
        createPlatforms(Game.generationTypes.onlyGreen)
        return
    }
    
    if (Game.score < 3000) {
        Game.powerupChance = 80
        
        Game.heightTint = color(222, 229, 252)
        
        setAvailablePowerups(Game.powerupCombos.noBubbleBlower)
        createPlatforms(Game.generationTypes.greenAndBreaking)
        return
    }
    
    if (Game.score < 5500) {
        Game.heightTint = color(174, 190, 245)
        
        setAvailablePowerups(Game.powerupCombos.noBubbleBlower)
        createPlatforms(Game.generationTypes.all)
        return
    }
    
    if (Game.score < 10000) {
        Game.enemySpacing = 700
        Game.powerupChance = 60
        
        Game.heightTint = color(132, 155, 232)
        setBackgroundSprite(Sprites.spaceBackground)
        
        setAvailablePowerups(Game.powerupCombos.onlyBubbleBlower)
        createPlatforms(Game.generationTypes.onlyMoving)
        createEnemies(Game.generationTypes.basicEnemy)
        return
    }
    
    if (Game.score < 99999) {
        Game.enemySpacing = 300
        Game.maxPlatformDistance = 100
        Game.minPlatformDistance = 100
        Game.powerupChance = 25
        
        Game.heightTint = color(99, 125, 212)

        setAvailablePowerups(Game.powerupCombos.onlyBubbleBlower)
        createPlatforms(Game.generationTypes.onlyGreen)
        createEnemies(Game.generationTypes.fakePlatform)

        return
    }
}


/**
 * Set game values as if the game was just loaded
 */
function initaliseGame() {
    // set game property values to their default values 
    const initialValues = Game.initialGameValues

    for (let property in initialValues) {
        Game[property] = initialValues[property]
    }

    Sounds.soundData.activeSounds.forEach(sound => {
        // sound.stop() and soud.mute() don't work due to
        // errors with reactjs (I think p5js uses react)
        sound.stop()
    })

    // set global variables
    plr = new Player()
    visiblePlatforms = []
    visibleEnemies = [] 
    visiblePowerups = [] 
    activeInteractions = [] 

    Game.heightTint = color(255)

    Camera.totalScroll = 0
}


/**
 * debug shortcuts
 */
function debugKeyBinds(keyCode) {
    if (keyCode === keys.space) {
        plr.jump()
    }

    if (keyCode === keys.leftArrow) {
        if (ceil(frameRate()) > 10) frameRate(0)
        else if (floor(frameRate()) === 0) frameRate(60)
    }

    if (keyCode === keys.upArrow) {
        frameRate(0)
        draw()
    }
}

/**
 * Updates high score in Game object & local storage
 */
function updateHighscore(score) {
    localStorage.setItem("highscore", score)
    Game.highscore = score
    Game.highscoreSet = true
}

/**
 * Draws a line at highscore's y position
 */
function drawHighscoreLine() {
    if ((Game.highscore - Game.score) / Game.scoreMulti > Scene.height) return
    else if ((Game.score - Game.highscore) / Game.scoreMulti > Scene.height) return
    else if (plr.dead) return // prevents line from drawing for one frame when player dies with new highscore

    let y = Scene.height - (Game.highscore / Game.scoreMulti) + Camera.totalScroll
    stroke(255)
    line(Scene.leftBorder, y, Scene.rightBorder, y)
}