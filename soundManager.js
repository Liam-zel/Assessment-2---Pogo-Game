const Sounds = {
    highJump: 'sounds/High jump.wav',
    lowJump: 'sounds/Low jump.wav',

    jetpack1: 'sounds/jetpack 1.wav',
    jetpack2: 'sounds/jetpack 2.wav',
    jetpack3: 'sounds/jetpack 3.wav',

    loaded: [],
}

function loadSoundFiles() {
    for (let sound in Sounds) {
        if (sound === "loaded") break;

        let s = loadSound(Sounds[sound])
        s.setVolume(0.02)
        Sounds.loaded.push(s)

    }
}

function playSound(sound) {

    Sounds.loaded.forEach(s => {
        if (s.url === sound) {
            s.play()
            return
        }
    })
}