// -------------------- INTERACTION CLASS --------------------
/**
 * Base interaction class, Creates an interactable command button
 */
class Interaction {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y

        this.w = w
        this.h = h

        this.clicked = false

        this.sprite
    }

    /**
     * Sets the image for the interactible
     * @param {String} spriteURL url of the sprite image
     */
    setSprite(spriteURL) {
        this.sprite = spriteURL
    }
    
    
    draw() {
        strokeWeight(3)
        imageMode(CENTER)

        sprite(this.sprite, this.x, this.y, this.w, this.h)

        imageMode(CORNER)
    }


    /**
     * Checks if mouse position overlaps the button
     */
    checkClicked() {
        const sides = {
            left:   this.x - this.w/2,
            right:  this.x + this.w/2,
            top:    this.y - this.h/2, 
            bottom: this.y + this.h/2,
        }

        if (mouseX > sides.left && mouseX < sides.right) {
            if (mouseY > sides.top && mouseY < sides.bottom) {

                this.clicked = true
                this.onClick()
                return true

            }
        }

        return false
    }

    /**
     * Checks if mouse is being held over
     */
    checkHeld() {

        if (this.clicked) {
            if (this.checkClicked()) this.onHold()
            else {
                this.onHold()
                this.clicked = false
            }
        }

    }


    onClick() {} // runs when interactible is clicked

    onHold() {} // runs when interactible is held down
}


/**
 * Sets the game's state to a specified value when clicked
 */
class StateButton extends Interaction {
    constructor(x,y,w,h) {
        super(x,y,w,h)

        this.newState
    }

    /**
     * Sets the state that the game changes to when the button is clicked
     * @param state Game state
     */
    setState(state) {
        this.newState = state
    }

    onClick() {
        changeGameState(this.newState)
    }
}


/**
 * Slider with set range of values
 */
class Slider extends Interaction {
    constructor(x,y,w,h) {
        super(x,y,w,h)

        this.value = 0.25

        this.min = 0
        this.max = 1

        this.step = 0.1

        this.pointCol = '#A5D46A'
        this.progressCol = '#C9E5A5'
        this.emptyCol = '#F9FCF6'
    }


    draw() {
        const size = this.h
        const sliderProgress = (this.value / this.max)

        const rectRounding = 2

        strokeWeight(3)

        // i hate this, this will be redone later
        rectMode(CENTER)

        fill(this.emptyCol)
        rect(this.x, this.y, this.w, size - 20)

        fill(this.progressCol)
        rect(this.x - this.w/2 + (this.w * sliderProgress) / 2, this.y, this.w * sliderProgress, size - 20, rectRounding)

        rectMode(CORNER)

        fill(this.progressCol)
        circle(this.x - this.w/2 + (this.w * sliderProgress), this.y, size)
    }


    /**
     * Sets the slider's min and max values
     * @param {Number} min
     * @param {Number} max
     */
    setRange(min, max) {
        this.min = min
        this.max = max
    }

    /**
     * Sets how much the value of the slider increases per pixel
     * @param {Number} step
     */
    setStep(step) {
        this.step = step
    }


    onHold() {
        let clickX = mouseX - this.x + this.w/2
        let percentageClicked = clickX / this.w 

        this.value = this.max * percentageClicked + this.min

        if (this.value > this.max) this.value = this.max
        if (this.value < this.min) this.value = this.min
    }
}

// -------------------- FUNCTIONS --------------------