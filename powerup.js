// -------------------- CLASSES --------------------
/**
 * Base powerup class
 */
class Powerup {
    constructor(platform) {
        this.x = platform.x + platform.w / 2
        this.y = platform.y - platform.h * 2

        this.w = 20
        this.h = 40

        this.duration // how long the powerup is active for in ms

        this.pickedUp = false

        this.col = '#443133'

        this.parentPlatform = platform
    }


    // runs when powerup is generated
    init() {
        this.x -= this.w/2
        this.y -= this.h/2
    } 

    
    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }


    // Detaches powerup from parent platform
    remove() {
        this.parentPlatform.attachedPowerup = undefined
        activePowerups.splice(activePowerups.indexOf(this), 1)
    }


    // runs when player picks up powerup
    pickUp(plr) {
        plr.hasPowerup = true
        this.pickedUp = true

        // visiblePowerups.splice(visiblePowerups.indexOf(this), 1)

        this.update(plr)
    } 


    effect(plr) {} // generic function to run effect of powerup


    deactivate(plr) {} // generic function that runs when a powerup's duration runs out


    // runs the powerup's effect until its duration hits 0
    // plr is passed through to give to effect and deactivate functions
    update(plr) {
        let update = setInterval(() => {
            this.duration -= 50

            this.effect(plr)

            if (this.duration <= 0) {
                this.remove()
                plr.hasPowerup = false
                this.deactivate(plr)

                clearInterval(update)
            }
        },50)
    }
}


/**
 * Gives a significant y velocity boost to the player
 */
class Jetpack extends Powerup {
    constructor(platform) {
        super(platform)

        this.boost = -3
        this.duration = 5000
    }

    effect(plr) {
        plr.yVel = this.boost
    }
}

/**
 * Increases player's regular jump power
 */
class SpringBoots extends Powerup {
    constructor(platform) {
        super(platform)

        this.col = '#B1B1B1'

        this.w = 50
        this.h = 20

        this.duration = 6000
        this.springJump = 30
        this.originalJumpPower = 0
    }

    effect(plr) {
        if (plr.jumpPower !== this.springJump) this.originalJumpPower = plr.jumpPower
        plr.jumpPower = this.springJump
    }

    deactivate(plr) {
        plr.jumpPower = this.originalJumpPower
    }
}


// -------------------- FUNCTIONS --------------------

/**
 * Creates and attaches a new powerup object to the given platform argument
 * @param {Object} platform a given platform object to have a powerup attached to it
 */
function generatePowerup(platform) {
    // array of functions
    const powerups = [
        (p) => {return new Jetpack(p)},
        // (p) => {return new SpringBoots(p)},
    ] 

    let index = floor(random(powerups.length))

    let powerup = powerups[index](platform)
    powerup.init()

    platform.attachedPowerup = powerup
    visiblePowerups.push(powerup)
}