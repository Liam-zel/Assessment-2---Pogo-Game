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

    Camera.wasScrolled = true
}