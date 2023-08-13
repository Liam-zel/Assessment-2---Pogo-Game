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

        if (this.x + this.w > Scene.rightBorder || this.x < Scene.leftBorder) {
            this.direction *= -1
        }
    }
}