const firebaseConfig = {
    apiKey: "AIzaSyDqrxVLbCj9D1NyPziKNyrmzhegXNpCI6A",
    authDomain: "summer-iw.firebaseapp.com",
    databaseURL: "https://summer-iw.firebaseio.com",
    projectId: "summer-iw",
    storageBucket: "",
    messagingSenderId: "939837361800",
    appId: "1:939837361800:web:b2f180e51fcf2dce"
};
let now_user = undefined;
let last_user = undefined;
let myTimer;
let start_status = 0;
let user_nickname = undefined;
let now_user_nickname = undefined;
let worst_user = undefined;
let worst_time = undefined;
const noSleep = new NoSleep();

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
});
firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});
firebase.database().ref().child('worst').once('value').then(function(snapshot) {
    worst_user = snapshot.val().username;
    worst_time = snapshot.val().time;
});
firebase.database().ref().child('worst').on('value', function(snapshot) {
    worst_user = snapshot.val().username;
    worst_time = snapshot.val().time;
});

firebase.database().ref().child('now').once('value').then(function(snapshot) {
    now_user = snapshot.val().username;  
    now_user_nickname = snapshot.val().nickname; 
    if (now_user_nickname != undefined){
        document.getElementById("current").innerHTML="" + now_user_nickname;
    } else{
        document.getElementById("current").innerHTML="없음";
    } 
});

firebase.database().ref().child('now').on('value', function(snapshot) {
    now_user = snapshot.val().username;  
    now_user_nickname = snapshot.val().nickname;   
    if (now_user_nickname != undefined){
        document.getElementById("current").innerHTML="" + now_user_nickname;
    } else{
        document.getElementById("current").innerHTML="없음";
    } 
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

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().start_status == 1){
        start_status = 1;
    } else if (snapshot.val().start_status == 0) {
        start_status = 0;
    }
});


function add(username){
    if (now_user != username){
        firebase.database().ref('/add').push({
            username: username,
        });
    }
}

function subtract(username){
    if (now_user != username){
        firebase.database().ref('/subtract').push({
            username: username,
        });
    }
}


function reserve(username){
    if(worst_user == username){
        if(worst_time != 0){
            firebase.database().ref('/order/!a').set({
                username: username,
                nickname: user_nickname
            });
        }
    }
    if (last_user != username){
        firebase.database().ref('/order').push({
            username: username,
            nickname: user_nickname
        });
    } 
}

function innerUsername(snapshot){
    let order = [];
    let check = [];
	for (let key in snapshot.val()) {
        order.push(snapshot.val()[key].nickname);
        check.push(snapshot.val()[key].username);
	}
    let number = order.length - 2;
    last_user = check[check.length-1];
    
    if (order[0] != undefined){
        document.getElementById("next").innerHTML="" + order[0];
    } else{
        document.getElementById("next").innerHTML="없음";
    }
    if (order[1] != undefined){
        document.getElementById("more").innerHTML="" + order[1];
    } else{
        document.getElementById("more").innerHTML="없음";
    }
    if (number>0){
        document.getElementById("number").innerHTML="+ " + number;
    } else{
        document.getElementById("number").innerHTML="+ 0";
    }
}

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

function nickname(username) {
    user_nickname = document.getElementById("nickname").value;
    document.getElementById("nickname").remove();
    document.getElementById("save").remove();
    document.getElementById("user"+username).innerHTML= `${user_nickname}`
    firebase.database().ref('/nickname/'+username).set(user_nickname);

}