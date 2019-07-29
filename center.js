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

let alarm_status = 1;
let start_status = 0;
let next_user_true = 0;
let msg_state = 0;
let tid;
const timer_time = 60000;
let RemainDate = undefined;
let arc;
let ArchiveTime = 0;
let now_id = undefined;
let now_name = undefined;

let myTimer;

let datatable = [
    ["Element", "Time", { role: "style" } ],
    ["유저 1", 0, "#b87333"],
    ["유저 2", 0, "gold"],
    ["유저 3", 0, "#b87333"],
    ["유저 4", 0, "gold"],
    ["유저 5", 0, "#b87333"],
    ["유저 6", 0, "gold"]
];

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('data').once('value').then(function(snapshot) {
    datatable[1][1] = snapshot.val()[0].user1; 
    datatable[2][1] = snapshot.val()[0].user2; 
    datatable[3][1] = snapshot.val()[0].user3;    
    datatable[4][1] = snapshot.val()[0].user4; 
    datatable[5][1] = snapshot.val()[0].user5; 
    datatable[6][1] = snapshot.val()[0].user6; 
    google.charts.setOnLoadCallback(drawChart);
});
firebase.database().ref().child('now_status').once('value').then(function(snapshot) {
    if (snapshot.val().status == 0){
        document.getElementById("current").innerHTML="없음";
    } else {
        firebase.database().ref().child('now').once('value').then(function(snapshot2) {
            now_id = snapshot2.val().id; 
            now_name = snapshot2.val().name; 
            document.getElementById("current").innerHTML="" + now_name;
        });
    }
});
firebase.database().ref().child('now_status').on('value', function(snapshot) {
    if (snapshot.val().status == 0){
        document.getElementById("current").innerHTML="없음";
    } else {
        firebase.database().ref().child('now').once('value').then(function(snapshot2) {
            now_id = snapshot2.val().id; 
            now_name = snapshot2.val().name; 
            document.getElementById("current").innerHTML="" + now_name;
        });
    }  
});

firebase.database().ref().child('nickname').once('value').then(function(snapshot) {
    datatable[1][0] = snapshot.val()[1]; 
    datatable[2][0] = snapshot.val()[2]; 
    datatable[3][0] = snapshot.val()[3];    
    datatable[4][0] = snapshot.val()[4]; 
    datatable[5][0] = snapshot.val()[5]; 
    datatable[6][0] = snapshot.val()[6]; 
    google.charts.setOnLoadCallback(drawChart);     
});

firebase.database().ref().child('nickname').on('value', function(snapshot) {
    datatable[1][0] = snapshot.val()[1]; 
    datatable[2][0] = snapshot.val()[2]; 
    datatable[3][0] = snapshot.val()[3];    
    datatable[4][0] = snapshot.val()[4]; 
    datatable[5][0] = snapshot.val()[5]; 
    datatable[6][0] = snapshot.val()[6]; 
    google.charts.setOnLoadCallback(drawChart);  
});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('add').once('value').then(function(snapshot) {
    if (start_status == 1){
        let add = 0;
        for (let key in snapshot.val()) {
            add = add + 1;
        }
        changecolor('#0060ff');
        firebase.database().ref().child('add').set(null);
    }
});

firebase.database().ref().child('add').on('value', function(snapshot) {
    if (start_status == 1){
        let add = 0;
        for (let key in snapshot.val()) {
            add = add + 1;
        }
        changecolor('#0060ff');
        firebase.database().ref().child('add').set(null);
    }
});



firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().status == 1){
        start_status = 1;
        RemainDate = timer_time;
        ArchiveTime = 0;
        arc=setInterval('arc_time()',100);
        var current = document.getElementById('current');
        current.style.color = '#ff0000';
        el.style.color = '#ffffff';
        if (next_user_true == 1){
            if (msg_state == 0){
                tid=setInterval('msg_time()', 100);
                msg_state = 1;
            }
        }
    } else if (snapshot.val().status == 0) {
        start_status = 0;
        clearInterval(tid);
        clearInterval(arc);
        var current = document.getElementById('current');
        current.style.color = '#000000';
        document.all.timer.innerHTML = "";
        msg_state = 0;
        ArchiveTime = datatable[now_id][1] + ArchiveTime/1000;
        datatable[now_id][1] = ArchiveTime;
        drawChart();
        firebase.database().ref('/data/0').set({
            user1: datatable[1][1],
            user2: datatable[2][1],
            user3: datatable[3][1],
            user4: datatable[4][1],
            user5: datatable[5][1],
            user6: datatable[6][1],
        });
        firebase.database().ref('/data/'+now_id).set({
            time: ArchiveTime,
        });
        let worst = [
            {name: 1, value: datatable[1][1]},
            {name: 2, value: datatable[2][1]},
            {name: 3, value: datatable[3][1]},
            {name: 4, value: datatable[4][1]},
            {name: 5, value: datatable[5][1]},
            {name: 6, value: datatable[6][1]}
        ];
        // sort by value
        worst.sort(function (a, b) {
            if(a.hasOwnProperty('value')){
                return a.value - b.value;
            }
        });
        firebase.database().ref('worst').set({
            id: worst[0].name,
            time: worst[0].value,
        });
    }
});

function innerUsername(snapshot){
    let name_order = [];
	for (let key in snapshot.val()) {
        name_order.push(snapshot.val()[key].name);
    }
    let number = name_order.length - 2;
    if (name_order[0] != undefined){
        next_user_true = 1;
        if (start_status == 1){
            if (msg_state == 0){
                tid=setInterval('msg_time()', 100);
                msg_state = 1;
            }
        }
        document.getElementById("next").innerHTML="" + name_order[0];
    } else{
        next_user_true = 0;
        document.getElementById("next").innerHTML="없음";
    }
    if (name_order[1] != undefined){
        document.getElementById("more").innerHTML="" + name_order[1];
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
    order = [];
}

function msg_time() {
	var hours = Math.floor((RemainDate % (1000 * 60 * 60 * 24)) / (1000*60*60));
	var minutes = Math.floor((RemainDate % (1000 * 60 * 60)) / (1000*60));
	var seconds = Math.floor((RemainDate % (1000 * 60)) / 1000);

	m = hours + ":" +  minutes + ":" + seconds ; // 남은 시간 text형태로 변경
	  
    document.all.timer.innerHTML = m;
    
	if (RemainDate <= 0) {      
        clearInterval(tid);
        msg_state = 0;
        start_status = 0;
        firebase.database().ref('/start_status').set({
            start_status: 0,
        });
        now_user = undefined;
        firebase.database().ref('/now').set({
            username: null,
            nickname: '없음'
        });
	} else if (RemainDate >= 1000*16) {
		alarm_status = 1;
		RemainDate = RemainDate - 100;
	} else if (RemainDate <= 1000*15) {
		if (alarm_status == 1){
		    play();
		    alarm_status = 0;
		}
		RemainDate = RemainDate - 100;
	}
	else{
	    RemainDate = RemainDate - 100;
    }
}

function arc_time() {
	ArchiveTime = ArchiveTime + 100;
}

function play() { 
    var audio = document.getElementById('audio_play'); 
    if (audio.paused) { 
        audio.play(); 
    }else{ 
        audio.pause(); 
        audio.currentTime = 0;
    } 
}

function changecolor(color){
    clearTimeout(myTimer);
    var el = document.getElementById('timer');
    el.style.backgroundColor = `${color}`;
    el.style.color = '#ffffff';
    myTimer = setTimeout(function() {
        el.style.backgroundColor = '#e6e6e6';
        el.style.color = '#000000';
        }, 1000);
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(datatable);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                    { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" },
                    2]);

    var options = {
        title: "발언 누적 시간 그래프",
        width: 1200,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("chart_div"));
    chart.draw(view, options);
}

