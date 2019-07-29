const mic_on = document.getElementById('mic_on');
const mic_off = document.getElementById('mic_off');
const help = document.getElementById('help');
const label = document.getElementById('label');

let userid = undefined;
let username = undefined;

const firebaseConfig = {
    apiKey: "AIzaSyDgKn2qdiotLT3IhUoWe1h2mMGKXpQMm_4",
    authDomain: "aug-iw.firebaseapp.com",
    databaseURL: "https://aug-iw.firebaseio.com",
    projectId: "aug-iw",
    storageBucket: "",
    messagingSenderId: "929095306586",
    appId: "1:929095306586:web:ec7a4216a7ec63a9"
};
const noSleep = new NoSleep();

let RemainDate = 60000;

window.onload = function(){
    userid = getQueryStringObject().id;
    username = ""+getQueryStringObject().name;
    firebase.database().ref('/now').set({
        id: userid,
        name: username
    });
    firebase.database().ref().child('now_status').set({
        status : 1
    });
};

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().start_status == 1){
        start_status = 1;
    } else if (snapshot.val().start_status == 0) {
        start_status = 0;
    }
});

mic_on.addEventListener('click',function(e){
    firebase.database().ref().child('now_status').set({
        status : 0
    });
    firebase.database().ref('/start_status').set({
        status: 0
    });
    firebase.database().ref('/now').set(null);
    location.href = `./user.html?id=${userid}&name=${username}`;
});

mic_off.addEventListener('click',function(e){
    firebase.database().ref('/start_status').set({
        status: 1
    });
    $("#mic_on").toggle(); // show -> hide , hide -> show
    $("#mic_off").toggle();
    $("#help").toggle(); // show -> hide , hide -> show
});

help.addEventListener('click',function(e){
    help.style.backgroundColor = '#ffffff';
    help.style.color = '#333333';
    help.style.fontWeight = '700';
    help.setAttribute("value", "요청되었습니다");
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