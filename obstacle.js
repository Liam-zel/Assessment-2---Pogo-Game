// -------------------- OBSTACLE CLASS --------------------
class Obstacle {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    // generic function to run every frame alongside draw
    update() {}
}


// -------------------- ENEMY CLASS --------------------
class Enemy extends Obstacle {
    constructor(x, y) {
        super(x,y)

        this.w = 40
        this.h = 50

        this.col = '#FF4040'
    }

    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }

    onCollision(plr) {
        plr.kill(this)
    }
}


// -------------------- PLATFORM CLASS --------------------
class Platform extends Obstacle {
    constructor(x, y) {
        super(x,y)

        this.w = 80
        this.h = 12

        this.col = '#C0FF3E'

        this.attachedPowerup = undefined
    }

    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }

    onCollision(plr) {
        plr.jump()
    }
}



// -------------------- FUNCTIONS --------------------
/**
 * Generates an obstacle with random type, x position and y position
 */
function generateObstacle() {
    // obstacles can generate too far in advance, this prevents that
    if (activeObstacles.length > 0 && activeObstacles[activeObstacles.length-1].y < -500) return

    // array of functions
    const platformTypes = [
        (x, y) => {return new Platform(x, y)},
        (x, y) => {return new BreakablePlatform(x, y)},
        (x, y) => {return new movingPlatform(x, y)},
    ]

    const enemyTypes = [
        (x, y) => {return new Enemy(x, y)},
        (x, y) => {return new blueEnemy(x, y)},
    ]

    let enemyOrPlatform = floor(random(2))


    let index

    if (enemyOrPlatform == 1) index = floor(random(platformTypes.length))
    else index = floor(random(enemyTypes.length))

    let x = floor(random(Scene.leftBorder, Scene.rightBorder - 80))

    // y position of previous platform, otherwise its the floors y position
    let previousY = Scene.floorHeight - 70
    if (activeObstacles.length > 0) previousY = activeObstacles[activeObstacles.length-1].y

    let y = floor(random(previousY, previousY-130))

    if (enemyOrPlatform == 1) activeObstacles.push( platformTypes[index](x, y) )
    else activeObstacles.push( enemyTypes[index](x, y) )
}


/**
 * Checks if any obstacles are below the screen, and if so, deletes them
 */
function deleteObstacles() {
    activeObstacles.forEach(obstacle => {

        if (obstacle.y > Scene.height) {
            activeObstacles.splice(activeObstacles.indexOf(obstacle), 1)
        }

    })
}