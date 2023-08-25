// -------------------- SETTINGS OBJECT --------------------
/**
 * Global settings object which stores player preferences
 */
const Settings = {
    inputModes: {
        mouse: 1,
        keys: 2,
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
    Settings.currentInputMode = Settings.inputModes.mouse
    Settings.language = Settings.supportedLanguages.english
}