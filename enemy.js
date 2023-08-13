class blueEnemy extends Enemy {
    constructor(x,y) {
        super(x,y)
        
        this.col = '#5500CC'
    }

    onCollision(plr) {
        plr.yVel *= -1  
    }
}