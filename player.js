// -------------------- PLAYER CLASS --------------------
class Player {
    /**
     * @param {Number} x intial x position
     * @param {Number} y intial y position
     */
    constructor(x, y) {
        this.x = x + Scene.xOffset
        this.y = y

        this.col = '#FF2346'

        this.w = 30
        this.h = 40

        this.jumpPower = 20
        this.gravity = 0.8

        this.moveSpeed = 0.15 

        this.heighestPoint = Infinity

        this.yVel = 0
        this.xVel = 0

        this.activePowerups = []

        // The corners of the character, used for collisions
        this.collisionPoints = {
            topLeft:     {x: this.x - this.w/2, y: this.y - this.h/2},
            topRight:    {x: this.x + this.w/2, y: this.y - this.h/2},
            bottomLeft:  {x: this.x - this.w/2, y: this.y + this.h/2},
            bottomRight: {x: this.x + this.w/2, y: this.y + this.h/2},
        }

        // So platforms only collide with the bottom two points of the player
        this.platformCollisionPoints = [
            this.collisionPoints.bottomLeft,
            this.collisionPoints.bottomRight
        ]

        // x pos the player is moving to
        this.xTarget = x + Scene.xOffset 
    }

    // -------------------- FUNCTIONS -------------------- 
    /**
     * Draws player character on screen
     */
    draw() {
        strokeWeight(4)
        rectMode(CENTER) // player is drawn from the center of his x,y position 

        fill(this.col)
        rect(this.x, this.y, this.w, this.h)

        rectMode(CORNER) // everything else is drawn from the top left, using their x,y position
    }

    
    /**
     * Draws debug items such as collision points and x target
     */
    debugDraw() {
        push()

        rectMode(CENTER)
        stroke(50,220,200)
        strokeWeight(9)

        point(this.xTarget, this.y)
        
        for (let pointName in this.collisionPoints) {
            let p = this.collisionPoints[pointName]

            point(p.x, p.y)
        }

        // heighest point
        line(0, plr.heighestPoint, windowWidth, plr.heighestPoint)

        pop()
    }

    
    /**
     * Updates player physics, collisions, movement
     */
    update() {
        this.yVel += this.gravity

        this.x += this.xVel
        this.y += this.yVel

        this.updateCollisionPoints(this.xVel, this.yVel)

        // Wraps player to other side of scene when they go off screen
        if (this.x < Scene.leftBorder) this.wrapAround(Scene.rightBorder)
        else if (this.x > Scene.rightBorder) this.wrapAround(Scene.leftBorder)

        // if player is above half the screen height, scroll the camera
        if (this.y < Scene.height/2) scrollCamera()

        if (this.yVel < 0 && this.y < this.heighestPoint) {
            this.heighestPoint = this.y
            updateScore(-this.yVel)
        }

        this.checkCollisions()
    }


    /**
     * Keeps collision points aligned with player x, y position
     * @param {Number} xChange change in player's x position
     * @param {Number} yChange change in player's y position
     */
    updateCollisionPoints(xChange, yChange) {
        for (const pointName in this.collisionPoints) {
            this.collisionPoints[pointName].x += xChange
            this.collisionPoints[pointName].y += yChange
        }
    }



    /**
     * When player goes off screen, sends them to the other side so they appear to 'wrap around'
     */
    wrapAround(borderPos) {
        let adjustment = this.x - borderPos
        this.xTarget -= adjustment
        this.x = borderPos

        this.updateCollisionPoints(-adjustment, 0)
    }


    /**
     * Checks players 4 collisionPoints against given x,y positions and w,h values
     * @param {Number} x x position of hitbox to check against player
     * @param {Number} y y position of hitbox to check against player
     * @param {Number} w width of hitbox to check against player
     * @param {Number} h height of hitbox to check against player
     */
    checkHitboxOverlap(x, y, w, h) {
        for (let pointName in this.collisionPoints) {
            const point = this.collisionPoints[pointName]

            // x overlap
            if (point.x > x && point.x < x + w) {
                // y overlap
                if (point.y > y && point.y < y + h) {
                    return true
                }
            }
        }
    }


    /**
     * Checks players bottom left and right collision points against platform 
     * Parameters are identical to checkHitboxOverlap() function
     */
    checkPlatformCollision(x,y,w,h) {
        // perform collision checks in smaller steps for better collision precision
        // and to reduce possibility of fast falling speeds making player fall 
        // through platforms
        const ySteps = 3 

        for (let p = 0; p < this.platformCollisionPoints.length; p++) {
            const point = this.platformCollisionPoints[p]

            // x overlap
            if (point.x > x && point.x < x + w) {
                // y overlap
                for (let currentStep = 0; currentStep < ySteps; currentStep++) {
                    let yCheck = y - (this.yVel / ySteps) * currentStep

                    if (point.y > yCheck && point.y < yCheck + h) {
                        return true
                    }
                }
            }
        }
    }


    /**
     * Checks collision with floor, platforms etc.
     */
    checkCollisions() {

        // platforms, only check when moving downwards
        if (this.yVel > 0) {
            visiblePlatforms.forEach(p => {
                if (this.checkPlatformCollision(p.x, p.y, p.w, p.h)) {
                    // snaps player to platform (needs to be fixed but use this)
                    // let adjustment = this.y - p.y + this.h/2
                    // this.updateCollisionPoints(0, -adjustment)
                    // this.y = p.y - this.h/2

                    p.onCollision(this)
                }
            })
        }

        // enemies
        visibleEnemies.forEach(e => {
            if (this.checkHitboxOverlap(e.x, e.y, e.w, e.h)) {
                e.onCollision(this)
            }
        })

        // powerups
        visiblePowerups.forEach(pow => {
            if (this.checkHitboxOverlap(pow.x, pow.y, pow.w, pow.h)) {
                pow.pickUp(this)
            }
        })

        // floor
        if (this.y + this.h/2 > Scene.floorHeight) {
            let adjustment = this.y - Scene.floorHeight + this.h/2
            this.updateCollisionPoints(0, -adjustment)

            this.yVel = 0
            this.y = Scene.floorHeight - this.h/2
            
            this.jump()
        }
    }


    /**
     * Makes player jump
     */
    jump() {
        this.yVel = -this.jumpPower
    }


    /**
     * 
     */
    kill(killer) {

    }

    /**
     * Updates horizontal movement for player
     */
    move() {
        if (Settings.inputMode === 'mouse') {
            this.xTarget = mouseX - (mouseX - pmouseX)
            if (this.xTarget > Scene.rightBorder) this.xTarget = Scene.rightBorder
            if (this.xTarget < Scene.leftBorder) this.xTarget = Scene.leftBorder
        }
        else if (Settings.inputMode === 'keys') {
            const speed = 15
            if (keyIsDown(keys.leftArrow) || keyIsDown(keys.a)) {
                this.xTarget -= speed
            }
            if (keyIsDown(keys.rightArrow) || keyIsDown(keys.d)) {
                this.xTarget += speed
            }
        }
        

        let difference = this.xTarget - this.x
        let acceleration = this.moveSpeed * difference

        this.xVel = acceleration
    }
}