// -------------------- CLASSES --------------------
/**
 * Base platform class
 */
class Platform {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.w = 80
        this.h = 12

        this.col = '#C0FF3E'

        this.attachedPowerup = undefined
    }


    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)

        // draw powerup
        if (this.attachedPowerup !== undefined) {
            this.attachedPowerup.draw()
        }
    }


    update() {} // generic function to run every frame alongside draw


    // runs when player collides with platform while falling
    onCollision(plr) {
        plr.jump()
    }
}


/**
 * Can only be jumped on a single time
 */
class BreakablePlatform extends Platform {
    constructor(x,y) {
        super(x,y) // calls the constructor function from the original platform class

        this.col = '#FFD700'
        this.broken = false
    }

    onCollision(plr) {
        if (!this.broken) plr.jump()

        this.break()
    }

    break() {
        this.col = '#7F6B00'
        this.broken = true
    }
}


/**
 * Moves left and right, changes direction when it reaches the end of the screen
 */
class movingPlatform extends Platform {
    constructor(x,y) {
        super(x,y) // calls the constructor function from the original platform class

        this.col = '#9999FF'

        this.direction = floor(random(2))-1 || 1
        this.moveSpeed = 2
    }

    update() {
        this.x += this.moveSpeed * this.direction

        if (this.attachedPowerup !== undefined) this.attachedPowerup.x += this.moveSpeed * this.direction

        if (this.x + this.w > Scene.rightBorder || this.x < Scene.leftBorder) {
            this.direction *= -1
        }

    }
}


// -------------------- FUNCTIONS --------------------
/**
 * Generates a platform with random type, x position and y position
 */
function generatePlatform() {
    // platforms can generate too far in advance, this prevents that
    if (visiblePlatforms.length > 0 && visiblePlatforms[visiblePlatforms.length-1].y < -500) return

    // array of functions
    const platformTypes = [
        (x, y) => {return new Platform(x, y)},
        (x, y) => {return new BreakablePlatform(x, y)},
        (x, y) => {return new movingPlatform(x, y)},
    ]    
    
    let index = floor(random(platformTypes.length))
    
    let x = floor(random(Scene.leftBorder, Scene.rightBorder - 80))
    
    // y position of previous platform, otherwise use the floors y position
    let previousY = Scene.floorHeight - 70
    if (visiblePlatforms.length > 0) previousY = visiblePlatforms[visiblePlatforms.length-1].y
    
    let y = floor(random(previousY, previousY - Game.platformMaxHeightDistance))
    
    visiblePlatforms.push( platformTypes[index](x, y) )
            
    // rolls random number between 0 - powerupChance
    if (floor(random(Game.powerupChance)) === 0) {
        generatePowerup(visiblePlatforms[visiblePlatforms.length-1])
    }
}


/**
 * Generates platforms ahead of the player until a y level threshold
 */
function createPlatforms() {
    const threshold = -500 // -500px

    do {
        generatePlatform()
    } while (visiblePlatforms[visiblePlatforms.length - 1].y > threshold)
}


/**
 * Checks if any platforms are below the screen, and if so, deletes them
 */
function deletePlatforms() {
    visiblePlatforms.forEach(platform => {
        let heightThreshold = Scene.height
        if (platform.attachedPowerup !== undefined) heightThreshold += platform.attachedPowerup.h

        if (platform.y > heightThreshold) {
            if (platform.attachedPowerup !== undefined) visiblePowerups.splice(visiblePowerups.indexOf(platform.attachedPowerup), 1)
            visiblePlatforms.splice(visiblePlatforms.indexOf(platform), 1)
        }

    })
}