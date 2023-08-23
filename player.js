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

        this.squash = 0
        this.inSquash = false
        this.stretch = 0
        this.maxStretch = 30

        this.jumpPower = 20
        this.gravity = 0.8

        this.moveSpeed = 0.15 

        this.heighestPoint = Infinity

        this.yVel = 0
        this.xVel = 0

        // x pos the player is moving to
        this.xTarget = x + Scene.xOffset 

        this.dead = false

        this.activePowerups = []

        this.projectiles = []

        // The corners of the character, used for collisions
        this.collisionPoints = {
            // corners
            topLeft:     {x: this.x - this.w/2, y: this.y - this.h/2},
            topRight:    {x: this.x + this.w/2, y: this.y - this.h/2},
            bottomLeft:  {x: this.x - this.w/2, y: this.y + this.h/2},
            bottomRight: {x: this.x + this.w/2, y: this.y + this.h/2},

            // sides
            topMiddle:   {x: this.x,            y: this.y - this.h/2},
            bottomMiddle:{x: this.x,            y: this.y + this.h/2},
            leftMiddle:  {x: this.x - this.w/2, y: this.y           },
            rightMiddle: {x: this.x + this.w/2, y: this.y           },
        }

        // So platforms only collide with the bottom two points of the player
        this.platformCollisionPoints = [
            this.collisionPoints.bottomLeft,
            this.collisionPoints.bottomMiddle,
            this.collisionPoints.bottomRight
        ]
    }

    // -------------------- FUNCTIONS -------------------- 
    /**
     * Draws player character on screen
     */
    draw() {
        strokeWeight(4)
        imageMode(CENTER) // player is drawn from the center of his x,y position 

        // fill(this.col)
        // rect(this.x, this.y, this.w + this.squash, this.h + this.stretch)

        sprite(Sprites.player, this.x, this.y, this.w + this.squash, this.h + this.stretch)

        imageMode(CORNER) // everything else is drawn from the top left, using their x,y position

        // todo: fix flickering
        this.projectiles.forEach(proj => {
            proj.draw()
            proj.update()
        })
    }

    
    /**
     * Draws debug items such as collision points and x target
     */
    debugDraw() {
        push()

        rectMode(CENTER)
        stroke(50, 220, 200)
        strokeWeight(9)

        point(this.xTarget, this.y)
        
        for (let pointName in this.collisionPoints) {
            let p = this.collisionPoints[pointName]

            point(p.x, p.y)
        }

        // heighest point
        // line(0, plr.heighestPoint, windowWidth, plr.heighestPoint)

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

        if (this.inSquash) this.updateSquash()
        else this.updateStretch()

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
     * Updates the stretch (height) of the player sprite.
     * This feature improves game feel 
     */
    updateStretch() {
        if (this.squash > 1) this.stretch = Math.pow(this.yVel/100 , 2)
        else this.stretch = Math.pow(this.yVel/4, 2)

        if (this.stretch > this.maxStretch) this.stretch = this.maxStretch

        // this makes sure that the player's area (width x height) stays the same
        let area = this.w * this.h
        this.squash = (area / (this.h + this.stretch)) - this.w
    }
    
    
    /**
     * Updates the squash (width) of the player sprite.
     * This feature improves game feel
     */
    updateSquash() {
        this.squash = Math.pow(this.yVel/7, 2)

        // this makes sure that the player's area (width x height) stays the same
        let area = this.w * this.h
        this.stretch = (area / (this.w + this.squash)) - this.h

        if (floor(this.squash) == 0) this.inSquash = false
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
                    let adjustment = this.y - p.y + this.h/2
                    this.updateCollisionPoints(0, -adjustment)
                    this.y = p.y - this.h/2

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
            if (Game.floorKills) return this.kill('FLOOOOOOOR')

            let adjustment = this.y - Scene.floorHeight + this.h/2
            this.updateCollisionPoints(0, -adjustment)

            this.y = Scene.floorHeight - this.h/2
            
            this.jump()
        }
    }


    /**
     * Makes player jump
     */
    jump() {
        this.inSquash = true

        if (this.jumpPower > 20) playSound(Sounds.highJump)
        else playSound(Sounds.lowJump)

        this.yVel = -this.jumpPower
    }


    /**
     * 
     */
    kill(killer) {
        this.dead = true

        uploadScore()
        
        changeGameState(GameState.states.death)
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


    /**
     * Shoots an enemy killing projectile upwards
     * @param {Boolean} isGun Plays bullet sound effect if true
     */
    shoot(isGun) {
        this.projectiles.push(new Projectile(this.x, this.y))

        if (isGun) playSound(Sounds.shoot)
        else playSound(Sounds.projectile)
    }
}


// -------------------- PROJECTILE CLASS --------------------
/**
 * Projectile attack from player
 */
class Projectile {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.yVel = -25
        this.xVel = 0

        this.size = 10

        this.sprite = Sprites.projectile
    }


    draw() {
        push()

        strokeWeight(3)
        noFill()
        circle(this.x, this.y, this.size)

        imageMode(CENTER)

        sprite(this.sprite, this.x, this.y, this.size, this.size)

        pop()
    }


    // update projectiles position
    update() {
        this.y += this.yVel
        this.x += this.xVel

        if (this.x < Scene.leftBorder || this.x > Scene.rightBorder) plr.projectiles.splice(plr.projectiles.indexOf(this), 1)

        if (this.y < 0 || this.y > Scene.floorHeight) plr.projectiles.splice(plr.projectiles.indexOf(this), 1)

        this.checkEnemyCollision()
    }


    /**
     * Remove projectile from player's projectiles array 
     */
    remove() {
        plr.projectiles.splice(plr.projectiles.indexOf(this), 1)
    }


    /**
     * Checks if projectile collided with an enemy, if so executes enemy.kill()
     */
    checkEnemyCollision() {
        // checks collision in
        visibleEnemies.forEach(enemy => {
            let lastPos = this.y - this.yVel

            // y overlap
            if (enemy.y < lastPos && enemy.y + enemy.h > this.y) {

                // x overlap
                if (enemy.x < this.x + this.size
                    && enemy.x + enemy.w > this.x - this.size) {

                    enemy.kill()
                    this.remove()
                }

            }
        })
    }
}