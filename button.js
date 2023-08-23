// -------------------- BUTTON CLASS --------------------
/**
 * Base button class, Creates an interactable command button
 */
class Button {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y

        this.w = w
        this.h = h

        this.sprite
    }

    /**
     * Sets the image for the button
     * @param {String} spriteURL url of the sprite image
     */
    setSprite(spriteURL) {
        this.sprite = spriteURL
    }
    
    
    draw() {
        // tint(0,0,0) // changes colour of pixels
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

                this.onClick()

            }
        }
    }


    onClick() {} // runs when button is clicked
}


/**
 * Sets the game's state to a specified value when clicked
 */
class StateButton extends Button {
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

// -------------------- FUNCTIONS --------------------