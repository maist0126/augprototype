const mic_on = document.getElementById('mic_on');
const mic_off = document.getElementById('mic_off');
const help = document.getElementById('help');
const label = document.getElementById('label');

let userid = undefined;
let username = undefined;
let start_status = 0;
let myTimer = undefined;
let democracy = undefined;
let help_status = undefined;

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

window.onload = function(){
    userid = getQueryStringObject().id;
    username = ""+getQueryStringObject().name;
    firebase.database().ref('/time_over').set({
        status: 1  
    });
};

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);
firebase.database().ref('user_count').once('value').then(function(snapshot){
    democracy = snapshot.val()/3;
});

firebase.database().ref().child('time_over').on('value', function(snapshot) {
    if (snapshot.val().status == 0){
        start_status = 0;
        firebase.database().ref('/start_status').set({
            status: 0
        });
        firebase.database().ref('/now').set({
            status : 0
        });
        firebase.database().ref('/help').set(null);
        location.href = `./user.html?id=${userid}&name=${username}`;
    } else if (snapshot.val().status == 2){
        $("#help").toggle();
    }
});
firebase.database().ref().child('subtract').on('value', function(snapshot) {
    if (start_status == 1){
        for (let key in snapshot.val()){
            changecolor('#ff3e98');
            firebase.database().ref('/help/'+snapshot.val()[key].id).set({
                status: 1  
            });
        }
    }
    firebase.database().ref().child('subtract').set(null);
});

mic_on.addEventListener('click',function(e){
    firebase.database().ref('/now').set({
        status : 0
    });
    start_status = 0;
    firebase.database().ref('/start_status').set({
        status: 0
    });
    firebase.database().ref('/help').set(null);
    location.href = `./user.html?id=${userid}&name=${username}`;
});

mic_off.addEventListener('click',function(e){
    start_status = 1;
    help_status = 1;
    firebase.database().ref('/start_status').set({
        status: 1
    });
    firebase.database().ref('user_count').once('value').then(function(snapshot){
        democracy = snapshot.val()/3;
    });
    $("#mic_on").toggle(); // show -> hide , hide -> show
    $("#mic_off").toggle();
});

help.addEventListener('click',function(e){
    if (help_status == 1){
        firebase.database().ref('/help').once('value').then(function(snapshot){
            let count = 0;
            for (let key in snapshot.val()) {
                count = count + 1;
            }
            help.style.fontWeight = '700';
            if (count > democracy){
                help.style.backgroundColor = '#ff0000';
                help.style.color = '#ffffff';
                help.setAttribute("value", "연장 실패"); 
            } else{
                firebase.database().ref('/time_more').push({
                    status: 1,
                });
                help.style.backgroundColor = '#ffffff';
                help.style.color = '#333333';
                help.setAttribute("value", "연장 성공"); 
            }
            help_status = 0;
        });
    }
});

function changecolor(color){
    clearTimeout(myTimer);
    vibrate();
    myTimer = setTimeout(function() {
        vibrate_stop();
        }, 5000);
}

function vibrate() {
    console.log("shut up!");
    if (navigator.vibrate) {
        navigator.vibrate(500); // 진동을 울리게 한다. 1000ms = 1초
    }
    else {
    }
}

function vibrate_stop() {
    console.log("shut down!");
    navigator.vibrate(0);
}

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