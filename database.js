// -------------------- INITIALISE DATABASE --------------------
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCmZDcqpL1aXO3sV_CulLt2wYkRjGRHG7w",
    authDomain: "pogo-jump-2c076.firebaseapp.com",
    databaseURL: "https://pogo-jump-2c076-default-rtdb.firebaseio.com",
    projectId: "pogo-jump-2c076",
    storageBucket: "pogo-jump-2c076.appspot.com",
    messagingSenderId: "690594500423",
    appId: "1:690594500423:web:c3db6e725caece8c258662",
    measurementId: "G-32CE2YSWCC"
}

// firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
// const Database = firebase.database().ref()


// -------------------- FUNCTIONS --------------------

function uploadScore() {
    const score = Game.score

    const data = {
        player: "insert name",
        score: score
    }

    // Database.push(data)
}