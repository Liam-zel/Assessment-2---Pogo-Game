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

    powerupChance: 100, // 1 in powerupChance for a platform to have a powerup generated with it

    platformMaxHeightDistance: 130,
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

    pop()
}