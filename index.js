const firebaseConfig = {
    apiKey: "AIzaSyDgKn2qdiotLT3IhUoWe1h2mMGKXpQMm_4",
    authDomain: "aug-iw.firebaseapp.com",
    databaseURL: "https://aug-iw.firebaseio.com",
    projectId: "aug-iw",
    storageBucket: "",
    messagingSenderId: "929095306586",
    appId: "1:929095306586:web:ec7a4216a7ec63a9"
};
let user_count = 1;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('user_count').once('value').then(function(snapshot) {
    user_count = snapshot.val();
});

function create() {
    firebase.database().ref().child('user_count').once('value').then(function(snapshot) {
        user_count = snapshot.val();
        let user_nickname = document.getElementById("name").value;
        location.href = `./user.html?id=${user_count}&name=${user_nickname}`;
        user_count = user_count + 1;
        firebase.database().ref().child('user_count').set(user_count);
    });
}

function reset() {
    firebase.database().ref().set(null);
    firebase.database().ref().child('user_count').set(1);
    firebase.database().ref().child('start_status').set({
        status: 0
    });
    firebase.database().ref().child('now_status').set({
        status: 0
    });
}