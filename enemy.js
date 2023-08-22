// -------------------- CLASSES --------------------
/**
 * Base enemy class
 */
class Enemy {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.w = 40
        this.h = 50

        this.col = '#FF4040'
    }

    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }


    update() {} // generic function to run every frame alongside draw


    onCollision(plr) {
        plr.kill(this)
    }


    kill() {
        visibleEnemies.splice(visibleEnemies.indexOf(this), 1)
    }
}


/**
 * FAKE PLATFORM TODO
 */
class FakePlatform extends Enemy {
    constructor(x,y) {
        super(x,y)

        this.w = 80
        this.h = 12

        this.col = '#C0FF3E'

        this.framesActive = floor(random(-100, 30))
    }

    draw() {
        strokeWeight(3)
        fill(this.col)
        rect(this.x, this.y, this.w, this.h)
    }

    update() {
        this.framesActive++

        if (this.framesActive > 160) {
            this.col = '#C0FF3E'

            if (this.framesActive % 15 == 0) this.col = '#FF033E'
            if (this.framesActive % 8 == 0) this.col = '#392B21'
        }

        if (this.framesActive > 210) {
            this.framesActive = floor(random(-100, 30))
        }
    }

    onCollision(plr) {
        // only collide while falling
        if (plr.yVel < 0) return    
    
        plr.kill()
    }
}


// -------------------- FUNCTIONS --------------------
/**
 * Generates an enemy with random type, x position and y position
 * @param {Number} index to specify an index from enemyTypes[], rather than choose at random
 */
function generateEnemy(index) {
    // enemies can generate too far in advance, this prevents that
    if (visibleEnemies.length > 0 && visibleEnemies[visibleEnemies.length-1].y < Game.generationMax) return

    // array of functions
    const enemyTypes = [
        (x, y) => {return new Enemy(x, y)},
        (x, y) => {return new FakePlatform(x, y)},
    ]

    // for the 'all' generation type, which can generate any enemy
    if (index === "all") index = floor(random(enemyTypes.length))

    // y position of previous platform, otherwise use the floors y position
    let previousY = -100
    if (visibleEnemies.length > 0) previousY = visibleEnemies[visibleEnemies.length-1].y

    let x = floor(random(Scene.leftBorder, Scene.rightBorder - 80))
    let y = floor(random(previousY, previousY - Game.enemySpacing))

    visibleEnemies.push( enemyTypes[index](x, y) )
}


/**
 * Generates enemies ahead of the player until a y level threshold
 * @param {Array} possibleIndexes array of allowed indexes when generating enemies
 */
function createEnemies(possibleIndexes) {
    // prevents player rocketing straight into an enemy
    if (plr.yVel < - 30) return

    const threshold = -150 // 150 px above screen
    let index = possibleIndexes[floor(random(possibleIndexes.length))]

    do {
        generateEnemy(index)
    } while(visibleEnemies[visibleEnemies.length - 1].y > threshold)
}


/**
 * Checks if any enemies are below the screen, and if so, deletes them
 */
function deleteEnemies() {
    visibleEnemies.forEach(enemy => {

        if (enemy.y > Scene.height) {
            visibleEnemies.splice(visibleEnemies.indexOf(enemy), 1)
        }

    })
}