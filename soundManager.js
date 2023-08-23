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

    soundData: {
        loaded: [],
        
        // activeSounds: [], // all currently playing sounds
        // maxSounds: 16
    }
}

// -------------------- FUNCTIONS --------------------

/**
 * Goes through all urls in Sounds object, loads them and lowers their volume
 */
function loadSoundFiles() {

    Howler.volume(0.1)

    for (let arrName in Sounds) {
        if (arrName === "soundData") continue

        Sounds[arrName].forEach(sound => {
            Sounds.soundData.loaded.push(new Howl({src: sound}))
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