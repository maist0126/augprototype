const label = document.getElementById('label');
const want = document.getElementById('want');
const add = document.getElementById('add');
const subtract = document.getElementById('subtract');


let userid = undefined;
let username = undefined;

let next_id = undefined;
let last_id = undefined;

let worst_id = undefined;
let worst_time = undefined;

let now_id = undefined;
let now_status = 0;

let start_status = 0;
let empty = undefined;

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
    username = getQueryStringObject().name;
    firebase.database().ref('/nickname/'+userid).set(username);
    label.innerHTML= ""+username;
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

///

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    let name_order = [];
    let id_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
        id_order.push(snapshot.val()[key].id);
	}
    last_id = id_order[id_order.length-1];
    next_id = id_order[0];
    if (id_order.length == 0){
        empty = 1;
    } else {
        empty = 0;
        if (now_status == 0){
            if (next_id == userid){
                firebase.database().ref().child('order').once('value').then(function(snapshot){
                    firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
                });
                location.href = `./on.html?id=${userid}&name=${username}`;
            }
        }
    }
    console.log(empty);
});
firebase.database().ref().child('order').on('value', function(snapshot) {
    let name_order = [];
    let id_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
        id_order.push(snapshot.val()[key].id);
	}
    last_id = id_order[id_order.length-1];
    next_id = id_order[0];
    if (id_order.length == 0){
        empty = 1;
    } else {
        empty = 0;
        if (now_status == 0){
            if (next_id == userid){
                firebase.database().ref().child('order').once('value').then(function(snapshot){
                    firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
                });
                location.href = `./on.html?id=${userid}&name=${username}`;
            }
        }
    }
    console.log(empty);
});

firebase.database().ref().child('worst').once('value').then(function(snapshot) {
    worst_id = snapshot.val().id;
    worst_time = snapshot.val().time;
});
firebase.database().ref().child('worst').on('value', function(snapshot) {
    worst_id = snapshot.val().id;
    worst_time = snapshot.val().time;
});

firebase.database().ref().child('subtract').on('value', function(snapshot) {
    if (start_status == 1){
        let subtract = 0;
        for (let key in snapshot.val()) {
            subtract = subtract + 1;
        }
        changecolor('#ff3e98');
        firebase.database().ref().child('subtract').set(null);
    }
});

firebase.database().ref().child('now_status').on('value', function(snapshot) {
    if (snapshot.val().status == 0){
        now_status = 0;
        if (empty == 0){
            if (next_id == userid){
                firebase.database().ref().child('order').once('value').then(function(snapshot){
                    firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
                });
                location.href = `./on.html?id=${userid}&name=${username}`;
            }
        }
    } else{
        now_status = 1;
    }
});

///
want.addEventListener('click', function() {
    if(worst_id == userid){
        if(worst_time != 0){
            firebase.database().ref('/order/!a').set({
                id: userid,
                name: username
            });
        }
    }
    if (last_id != userid){
        firebase.database().ref('/order').push({
            id: userid,
            name: username
        });
    } 
  });

add.addEventListener('click', function() {
    if (now_user != userid){
        firebase.database().ref('/add').push({
            id: userid,
        });
    }
  });
subtract.addEventListener('click', function() {
    if (now_user != userid){
        firebase.database().ref('/subtract').push({
            id: userid,
        });
    }
});

///
function changecolor(color){
    clearTimeout(myTimer);
    var el = document.getElementById(`user${now_user}`);
    el.style.backgroundColor = `${color}`;
    el.style.color = '#ffffff';
    vibrate();
    myTimer = setTimeout(function() {
        el.style.backgroundColor = '#e6e6e6';
        el.style.color = '#000000';
        vibrate_stop();
        }, 1000);
}

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(20000); // 진동을 울리게 한다. 1000ms = 1초
    }
    else {
    }
}

function vibrate_stop() {
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