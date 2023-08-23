// -------------------- SOUNDS OBJECT --------------------
/**
 * Global Sprites object which stores sprite file urls and sprite data
 */
const Sprites = {
    player: 'sprites/player.png',

    basicEnemy: 'sprites/enemy.png',

    jetpack: 'sprites/jetpack.png',
    machineGun: 'sprites/machine gun.png',
    springBoots: 'sprites/spring boots.png',

    background: 'sprites/sky background.png',

    spriteData: {
        loaded: []
    }
}


// -------------------- FUNCTIONS --------------------

/**
 * Goes through all urls in the Sprites object and loads them
 */
function loadSpriteFiles() {

    for (let spriteName in Sprites) {
        if (spriteName === "spriteData") continue
        let spriteUrl = Sprites[spriteName]

        Sprites.spriteData.loaded.push( loadImage(spriteUrl) )
        Sprites.spriteData.loaded[Sprites.spriteData.loaded.length-1].url = spriteUrl

    }

}


/**
 * Draws specified sprite at the given objects location
 * @param {String} spriteFile URL of sprite
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
function sprite(spriteFile, x,y,w,h) {
    let loaded = Sprites.spriteData.loaded

    loaded.forEach(sprite => {
        if (sprite.url === spriteFile) {
            image(sprite, x,y,w,h)
            return
        }
    })

}