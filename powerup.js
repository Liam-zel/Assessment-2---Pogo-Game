// -------------------- CLASSES --------------------
/**
 * Base powerup class
 */
class Powerup {
    constructor(platform) {
        this.x = platform.x
        this.y = platform.y

        this.w = 20
        this.h = 40

        this.duration // how long the powerup is active for in ms

        this.col = '#443133'

        this.parentPlatform = platform
    }

    
    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }


    // Detaches powerup from parent platform and removes it from activePowerups array
    remove() {
        this.parentPlatform.attachedPowerup = undefined
        activePowerups.splice(activePowerups.indexOf(this), 1)
    }


    // runs when player picks up powerup
    pickUp(plr) {
        plr.hasPowerup = true
        this.update(plr)
    } 


    effect() {} // generic function to run effect of powerup


    // runs the powerup's effect until its duration hits 0
    // plr is passed through to give to effect function
    update(plr) {
        let update = setInterval(() => {
            this.duration -= 50

            this.effect(plr)

            if (this.duration <= 0) {
                this.remove()
                plr.hasPowerup = false
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

        this.boost = -50
        this.duration = 3000
    }

    effect(plr) {
        plr.yVel = this.boost
    }
}