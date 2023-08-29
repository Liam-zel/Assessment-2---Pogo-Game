// -------------------- SETTINGS OBJECT --------------------
/**
 * Global settings object which stores player preferences
 */
const Settings = {
    inputModes: {
        mouse: 0,
        keys: 1,
    },
    currentInputMode: undefined,

    globalVolume: 0.2,

    supportedLanguages: {
        english: 1,
        spanish: 2,
        polish: 3,
    },
    language: undefined,
}


// -------------------- FUNCTIONS --------------------
/**
 * Set default settings values
 */
function initSettings() {
    Settings.currentInputMode = parseInt(localStorage.getItem("currentInputMode")) || Settings.inputModes.mouse
    Settings.globalVolume = parseFloat(localStorage.getItem("globalVolume")) || 0.2

    Settings.language = Settings.supportedLanguages.english
}


function changeSetting(setting, value) {
    Settings[setting] = value
    localStorage.setItem(setting, value)
}