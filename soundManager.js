// -------------------- SOUNDS OBJECT --------------------
/**
 * Global sounds object which stores sound file urls and sound data
 */
const Sounds = {
    highJump: ['sounds/high jump 1.wav', 'sounds/high jump 2.wav'],

    lowJump: ['sounds/low jump.wav'],

    jetpackStart: ['sounds/jetpack 1.wav'],
    jetpackEnd: ['sounds/jetpack 2.wav', 'sounds/jetpack 3.wav'],

    shoot: ['sounds/shoot 1.wav', 'sounds/shoot 2.wav'],
    projectile: ['sounds/projectile.wav'],

    // todo: enmemy isnt loading, maybe make preload async and await for a load
    enemyDeath: ['enemy death 1.wav', 'enemy death 2.wav'],

    soundData: {
        loaded: [],
        globalVolume: 0.1,
        
        activeSounds: [], // all currently playing sounds
        // maxSounds: 16
    }
}

// -------------------- FUNCTIONS --------------------

/**
 * Goes through all urls in the Sounds object and loads them
 * Also sets global volume
 */
function loadSoundFiles() {

    Howler.volume(Sounds.soundData.globalVolume)

    for (let arrName in Sounds) {
        if (arrName === "soundData") continue

        Sounds[arrName].forEach(soundUrl => {
            Sounds.soundData.loaded.push(new Howl({src: soundUrl}))
        })

    }

}


/**
 * Plays specified sound
 */
function playSound(sound) {
    let chosenSound = sound[floor(random(sound.length))]

    let loaded = Sounds.soundData.loaded
    loaded.forEach(sound => {
        if (sound._src === chosenSound) {
            Sounds.soundData.activeSounds.push(sound)
            sound.play()
            return
        }
    })
}

/**
 * Deletes sounds finished playing and makes sure there are no more
 * than maxSounds amount of sounds playing concurrently
 */
function deleteSounds() {


}