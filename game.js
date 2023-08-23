// -------------------- GAME OBJECT --------------------
/**
 * Global object that defines important game variables
 */
const Game = {
    score: 0,
    scoreMulti: 0.25, // multiply given amounts by scoreMulti 
                      // if score is based off height in pixels, 
                      // getting high numbers is too easy and unrewarding

    scoreTextStyling: { 
        fontSize: 45,
        outlineSize: 5,
        colour: '#FDFEDE',
        yPos: 60
    },

    // --- initial game values ---
    // game values that change have to have their initial values stored here
    initialGameValues: {
        powerupChance: 100, // 1 in powerupChance for a platform to have a powerup generated with it

        maxPlatformDistance: 130,
        minPlatformDistance: 0,

        enemySpacing: 1000,

        floorKills: false
    },

    powerupChance: undefined,
    powerupCombos: {
        all: ["all"],
        noMachineGun: [0, 1],
        onlyMachineGun: [2],
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
    if (avgFrames < 40) fill(255, 0, 0)
    text(floor(avgFrames) + "fps", windowWidth/2, Scene.height - Game.scoreTextStyling.yPos)

    pop()
}


/**
 * Generates all platforms, powerups and enemies in advance of the player
 * This generation is based off the players score
 */
function createObstacles() {

    if (Game.score < 1000) {
        Game.powerupChance = 35

        setAvailablePowerups(Game.powerupCombos.noMachineGun)
        createPlatforms(Game.generationTypes.onlyGreen)
        return
    }

    if (Game.score < 3000) {
        Game.powerupChance = 80

        createPlatforms(Game.generationTypes.greenAndBreaking)
        return
    }

    if (Game.score < 5500) {
        createPlatforms(Game.generationTypes.all)
        return
    }

    if (Game.score < 10000) {
        Game.enemySpacing = 700
        Game.powerupChance = 60
        
        setAvailablePowerups(Game.powerupCombos.onlyMachineGun)
        createPlatforms(Game.generationTypes.onlyMoving)
        createEnemies(Game.generationTypes.basicEnemy)
        return
    }

    if (Game.score < 99999) {
        Game.enemySpacing = 300
        Game.maxPlatformDistance = 100
        Game.minPlatformDistance = 100
        Game.powerupChance = 40

        setAvailablePowerups(Game.powerupCombos.onlyMachineGun)
        createPlatforms(Game.generationTypes.onlyGreen)
        createEnemies(Game.generationTypes.fakePlatform)

        return
    }
}



function initaliseGame() {
    // set game property values to their default values 
    const initialValues = Game.initialGameValues

    for (let property in initialValues) {
        Game[property] = initialValues[property]
    }

    // set global variables
    plr = undefined
    visiblePlatforms = []
    visibleEnemies = [] 
    visiblePowerups = [] 
    activeButtons = [] 
}