const label = document.getElementById('label');
const want = document.getElementById('want');

let userid = undefined;
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
const noSleep = new NoSleep();

window.onload = function(){
    userid = getQueryStringObject().id;
    label.innerHTML= ""+getQueryStringObject().name;
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);

want.addEventListener('click', function(){
    firebase.database().ref('/topic').push({name: 'aa'});
});

firebase.database().ref().child('topic').once('value').then(function(snapshot) { 
    let topic_name = [];
    let topic_key = [];
	for (let key in snapshot.val()) {
        topic_name.push(snapshot.val()[key].name);
        topic_key.push(key);
        var div = document.createElement('div');
        div.setAttribute("class", "topic_option");
        div.innerHTML = snapshot.val()[key].name;
        console.log(div);
        document.getElementById('blank').appendChild(div);
    };
});

firebase.database().ref().child('topic').on('value', function(snapshot) { 
    let topic_name = [];
    let topic_key = [];
	for (let key in snapshot.val()) {
        topic_name.push(snapshot.val()[key].name);
        topic_key.push(key);
    };
});


function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}