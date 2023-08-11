// -------------------- PLAYER CLASS --------------------
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

    // generic function to run every frame alongside draw
    update() {}

    onCollision(plr) {
        plr.kill(this)
    }
}


// -------------------- FUNCTIONS --------------------
/**
 * Generates an enemy with random type, x position and y position
 */
function generateEnemy() {
    // array of functions
    const enemyTypes = [
        (x, y) => {return new Enemy(x, y)}
    ]

    let index = floor(random(enemyTypes.length))

    let x = floor(random(Scene.leftBorder, Scene.rightBorder - 80))
    let y = floor(random(Scene.floorHeight - 100, 0))

    activeEnemies.push( enemyTypes[index](x, y) )
}


/**
 * Checks if any enemies are below the screen, and if so, deletes them
 */
function deleteEnemies() {
    activeEnemies.forEach(enemy => {

        if (enemy.y > Scene.height) {
            activeEnemies.splice(activeEnemies.indexOf(enemy), 1)
        }

    })
}