const speech_start = document.getElementById('speech_start');
const speech_stop = document.getElementById('speech_stop');

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
let start_status = 0;
let now_user = undefined;
let now_user_nickname = undefined;

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);

firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
    firebase.database().ref('/start_status').set({
        start_status: 0,
    });
});

firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().start_status == 1){
        start_status = 1;
    } else if (snapshot.val().start_status == 0) {
        start_status = 0;
    }
});

speech_start.addEventListener('click', function(event){
    
    if (start_status == 0){
        firebase.database().ref().child('order').once('value').then(function(snapshot){
            let order = [];
            let check = [];
            for (let key in snapshot.val()) {
                check.push(snapshot.val()[key].username);
                order.push(snapshot.val()[key].nickname);
            }
            now_user = check[0];
            now_user_nickname = order[0];
            firebase.database().ref('/now').set({
                username: now_user,
                nickname: now_user_nickname
            });
            firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
            start_status = 1;
            firebase.database().ref('/start_status').set({
                start_status: 1,
            });
            if (now_user_nickname != undefined){
                document.getElementById("current").innerHTML="" + now_user_nickname;
            } else{
                document.getElementById("current").innerHTML="없음";
            }
        });
    }
});

speech_stop.addEventListener('click', function(event){
    start_status = 0;
    firebase.database().ref('/start_status').set({
        start_status: 0,
    });
    now_user = undefined;
    now_user_nickname = undefined;
    firebase.database().ref('/now').set({
        username: null,
        nickname: '없음'
    });
    if (now_user_nickname != undefined){
        document.getElementById("current").innerHTML="" + now_user_nickname;
    } else{
        document.getElementById("current").innerHTML="없음";
    }
});

function innerUsername(snapshot){
    let order = [];
	for (let key in snapshot.val()) {
		order.push(snapshot.val()[key].nickname);
    }
    let number = order.length - 2;
    
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

function reset(){
    firebase.database().ref().set(null);
}


