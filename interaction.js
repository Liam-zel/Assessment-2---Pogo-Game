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
                this.letGo()
                this.clicked = false
            }
        }

    }


    onClick() {} // runs when interactible is clicked

    onHold() {} // runs when interactible is held down

    letGo() {} // runs when interctible is let go
}


/**
 * Sets the game's state to a specified value when clicked
 */
class CommandButton extends Interaction {
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

        this.function = () => {}

        this.min = 0
        this.max = 1

        // this.step = 0.1

        this.pointCol = '#A5D46A'
        this.progressCol = '#C9E5A5'
        this.emptyCol = '#F9FCF6'
    }


    draw() {
        const size = this.h
        const sliderProgress = (this.value / this.max)

        const rectRounding = 2

        strokeWeight(3)

        rectMode(CENTER)

        // this is bad
        // empty bar
        fill(this.emptyCol)
        rect(this.x, this.y, this.w, size - 20)

        // filled bar
        fill(this.progressCol)
        rect(this.x - this.w/2 + (this.w * sliderProgress) / 2, this.y, this.w * sliderProgress, size - 20, rectRounding)

        rectMode(CORNER)

        fill(this.pointCol)
        circle(this.x - this.w/2 + (this.w * sliderProgress), this.y, size)
    }


    /**
     * Sets the function ran when the slider value changes
     * @param {Function} func 
     */
    setFunction(func) {
        this.function = func
    }

    
    initState(val) {
        this.value = val
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

    // /**
    //  * Sets how much the value of the slider increases per pixel
    //  * @param {Number} step
    //  */
    // setStep(step) {
    //     this.step = step
    // }


    onHold() {
        let clickX = mouseX - this.x + this.w/2
        let percentageClicked = clickX / this.w 

        this.value = this.max * percentageClicked + this.min

        this.function()

        if (this.value > this.max) this.value = this.max
        if (this.value < this.min) this.value = this.min
    }

    letGo() {
        if (this.value > this.max) this.value = this.max
        if (this.value < this.min) this.value = this.min
    }
}


/**
 * A checkbox which represents a true or false value
 */
class Checkbox extends Interaction {
    constructor(x,y,w,h) {
        super(x,y,w,h)

        this.state = false

        this.options = []

        this.offCol = '#FFFFFF'
        this.onCol = '#A5D46A'

        // this.initState(value)
    }

    initState(value) {
        this.state = value
    }

    checkHeld() {} // remove checkHeld function

    /**
     * @param {Function} option1 unchecked value
     * @param {Function} option2 checked value
     */
    setOptions(option1, option2) {
        this.options = [option1, option2]
    }


    onClick() {
        this.state = !this.state
        this.options[+this.state]()
    }


    draw() {
        if (this.state) fill(this.onCol)
        else fill(this.offCol)

        strokeWeight(3)
        rectMode(CENTER)

        rect(this.x, this.y, this.w, this.h)

        rectMode(CORNER)
    }
}

// -------------------- FUNCTIONS --------------------