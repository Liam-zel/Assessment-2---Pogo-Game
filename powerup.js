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
        visiblePowerups.splice(visiblePowerups.indexOf(this), 1)
    }


    // picks up powerup
    pickUp(plr) {
        plr.activePowerups.push(this)
        this.pickedUp = true

        this.onPickUp(plr)

        this.update(plr)
        this.remove()
    } 


    /**
     * generic function to run the moment the powerup is picked up
     */
    onPickUp(plr) {} 

    /**
     * generic function to run effect of powerup, continuously runs over the powerups
     */
    effect(plr) {}


    /**
     * generic function that runs when a powerup's duration runs out
     */
    deactivate(plr) {}


    // runs the powerup's effect until its duration hits 0
    // plr is passed through to give to effect and deactivate functions
    update(plr) {
        let update = setInterval(() => {
            this.duration -= 50

            this.effect(plr)

            if (this.duration <= 0) {
                plr.activePowerups.splice(plr.activePowerups.indexOf(this), 1)
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

        this.boost = -40
        this.duration = 2500

        this.effectCount = 0
    }

    effect(plr) {
        plr.inSquash = false
        plr.yVel = this.boost

        if (this.effectCount % 2 === 0) playSound(Sounds.jetpack1)
        this.effectCount++
    }

    deactivate() {
        playSound(Sounds.jetpack2)
        playSound(Sounds.jetpack3)
    }

    onPickUp() {
        visibleEnemies.forEach(enemy => {
            if (enemy.y < 0) visibleEnemies.splice(visibleEnemies.indexOf(enemy), 1)
        })
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
        this.jumpBoost = 8
    }

    onPickUp(plr) {
        plr.jumpPower += this.jumpBoost
    }

    deactivate(plr) {
        plr.jumpPower -= this.jumpBoost
    }
}


/**
 * Auto fires bullets in all directions
 */
class MachineGun extends Powerup {
    constructor(platform) {
        super(platform)

        this.col = '#EEB273'

        this.w = 40
        this.h = 40

        this.bulletCount = 0
        this.rotationSpeed = 20

        this.duration = 7000
    }

    effect(plr) {
        plr.shoot()
        let bullet = plr.projectiles[plr.projectiles.length - 1]

        // multiplying by PI/180 converts degrees to radians
        bullet.xVel = 25 * Math.cos((this.bulletCount * this.rotationSpeed) * (Math.PI / 180))
        bullet.yVel = 25 * Math.sin((this.bulletCount * this.rotationSpeed) * (Math.PI / 180))

        this.bulletCount++
    }
}


// -------------------- FUNCTIONS --------------------

/**
 * Creates and attaches a new powerup object to the given platform argument
 * @param {Object} platform a given platform object to have a powerup attached to it
 * @param {Number} index to specify an index from powerups[], rather than choose at random
 */
function generatePowerup(platform) {
    let index = Game.availablePowerups[floor(random(Game.availablePowerups.length))]

    // array of functions
    const powerups = [
        (p) => {return new Jetpack(p)},
        (p) => {return new SpringBoots(p)},
        (p) => {return new MachineGun(p)},
    ] 

    // for the 'all' generation type, which can generate any powerup
    if (index === "all") index = floor(random(powerups.length))

    let powerup = powerups[index](platform)
    powerup.init()

    platform.attachedPowerup = powerup
    visiblePowerups.push(powerup)
}


/**
 * @param {Array} possibleIndexes 
 */
function setAvailablePowerups(possibleIndexes) {
    Game.availablePowerups = possibleIndexes
}