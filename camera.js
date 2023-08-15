Camera = {
    wasScrolled: false
}

/**
 * Scrolls the camera up to follow the player
 */
function scrollCamera() {
    const scroll = (arr, scrollAmt) => {
        arr.forEach(obj => {
            obj.y += scrollAmt
        })
    }

    let adjustmenet = Scene.height/2 - plr.y
    plr.updateCollisionPoints(0, adjustmenet)
    plr.y = Scene.height/2

    let yScroll = -plr.yVel 
    
    scroll(activePlatforms, yScroll)
    scroll(activeEnemies, yScroll)

    // create array from every platforms attachedPowerup property
    let activePowerups = activePlatforms.map(p => p.attachedPowerup)
    // removes undefined elements in the array
    activePowerups = activePowerups.filter(p => p !== undefined)
    scroll(activePowerups, yScroll)

    Camera.wasScrolled = true
}