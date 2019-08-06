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
let arc;
let ArchiveTime = 0;
let now_id = undefined;
let now_name = undefined;

let user_count = 0;

let myTimer;

let datatable = [];


///
const ctx = document.getElementById('my_canvas').getContext('2d');
const start = Math.PI*3/2;
const cw = ctx.canvas.width;
const r = cw/2;
const strokeWeight = r;
let diff;
const remainSec = 60;
let blue_indicator = remainSec;
let red_indicator = 1;
let blue;
let red;
let penalty = 0;
///


document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('archiving').on('value', function(snapshot) {
    let speech_order = [];
    let dynamics = new Array();
	for (let key in snapshot.val()) {
        speech_order.push([snapshot.val()[key].id, snapshot.val()[key].time, snapshot.val()[key].name]);
    }
    for (let k = 0; k<speech_order.length-1; k++){
        let index = 0;
        for (let i = 1; i<11; i++){
            for (let j = 1; j<11; j++){
                if (`${speech_order[k][0]}&${speech_order[k+1][0]}` == `${i}&${j}`){
                    dynamics[index] = {id: `${i}&${j}`, value: speech_order[k+1][1], state: `${speech_order[k][2]} said, then ${speech_order[k+1][2]} said`};
                }
                index ++;
            }
        }
    }
    dynamics.sort(function (a, b) { 
        if(a.hasOwnProperty('value')){
            return b.value - a.value;
        }
    });
    document.getElementById('dynamics1').innerHTML = `1: ${dynamics[0].state} for ${dynamics[0].value} seconds.`
    document.getElementById('dynamics2').innerHTML = `2: ${dynamics[1].state} for ${dynamics[1].value} seconds.`
    document.getElementById('dynamics3').innerHTML = `3: ${dynamics[2].state} for ${dynamics[2].value} seconds.`
    console.log(dynamics[0].state);
});
firebase.database().ref().child('now').once('value').then(function(snapshot) {
    if (snapshot.val().status == 0){
        document.getElementById("current").innerHTML="없음";
    } else {
        now_id = snapshot.val().id; 
        now_name = snapshot.val().name; 
        document.getElementById("current").innerHTML="" + now_name; 
    }
});
firebase.database().ref().child('now').on('value', function(snapshot) {
    if (snapshot.val().status == 0){
        document.getElementById("current").innerHTML="없음";
    } else {
        now_id = snapshot.val().id; 
        now_name = snapshot.val().name; 
        document.getElementById("current").innerHTML="" + now_name; 
    } 
});

firebase.database().ref().child('data').once('value').then(function(snapshot) {
    datatable = [];
    datatable.push(["Element", "Time", { role: "style" }]);
    for (let key in snapshot.val()){
        if (key%2 ==1){
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"gold"]);
        } else{
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"silver"]);
        }
        
    }
    google.charts.setOnLoadCallback(drawChart);     
});

firebase.database().ref().child('data').on('value', function(snapshot) {
    datatable = [];
    datatable.push(["Element", "Time", { role: "style" }]);
    for (let key in snapshot.val()){
        if (key%2 ==1){
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"gold"]);
        } else{
            datatable.push([snapshot.val()[key].name, snapshot.val()[key].time,"silver"]);
        }
        
    }
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
    }
    firebase.database().ref().child('add').set(null);
});

firebase.database().ref().child('add').on('value', function(snapshot) {
    if (start_status == 1){
        for (let key in snapshot.val()) {
            changecolor('#0060ff');
        }
    }
    firebase.database().ref().child('add').set(null);
});



firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().status == 1){
        firebase.database().ref('/data/'+now_id).once('value').then(function(snapshot) {
            start_status = 1;
            ArchiveTime = 0;
            arc=setInterval('arc_time()',100);
            ctx.lineWidth = strokeWeight;
            ctx.fillStyle = "#09F";
            ctx.strokeStyle = "#09F";
            ctx.beginPath();
            blue_indicator = remainSec - snapshot.val().penalty;
            diff = ((blue_indicator/remainSec)*Math.PI*2*10).toFixed(2);
            ctx.arc(r, r, r - strokeWeight/2, start, diff/10+start, false);
            ctx.stroke();
            var current = document.getElementById('current');
            current.style.color = '#09F';
            if (next_user_true == 1){
                if (msg_state == 0){
                    blue = setInterval(blue_timer, 1000);
                    msg_state = 1;
                }
            }   
        });
    } else if (snapshot.val().status == 0) {
        start_status = 0;
        clearInterval(blue);
        ctx.clearRect(0,0,cw,cw);
        clearInterval(arc);
        clearInterval(red);
        var current = document.getElementById('current');
        current.style.color = '#000000';
        document.all.timer.innerHTML = "";
        msg_state = 0;
        ArchiveTime = ArchiveTime/1000;
        firebase.database().ref('/archiving').push({
            id: now_id,
            name: now_name,
            time: ArchiveTime,
        });
        ArchiveTime = datatable[now_id][1] + ArchiveTime;
        datatable[now_id][1] = ArchiveTime;
        drawChart();
        firebase.database().ref('/data/'+now_id).set({
            name: now_name,
            time: ArchiveTime,
            penalty: penalty
        });
        penalty = 0;
        let worst = [];
        for (let i = 1; i<datatable.length; i++){
            worst.push({id: i, value: datatable[i][1]});
        }
        // sort by value
        worst.sort(function (a, b) {
            if(a.hasOwnProperty('value')){
                return a.value - b.value;
            }
        });
        firebase.database().ref('worst').set({
            id: worst[0].id,
            time: worst[0].value,
        });
    }
});

firebase.database().ref().child('time_more').on('value', function(snapshot) {
    if (start_status == 1){
        for (let key in snapshot.val()){
            blue_indicator = blue_indicator + remainSec;
        }
    }
    firebase.database().ref().child('time_more').set(null);
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
                blue = setInterval(blue_timer, 1000);
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

// function msg_time() {
// 	var hours = Math.floor((RemainDate % (1000 * 60 * 60 * 24)) / (1000*60*60));
// 	var minutes = Math.floor((RemainDate % (1000 * 60 * 60)) / (1000*60));
// 	var seconds = Math.floor((RemainDate % (1000 * 60)) / 1000);

// 	m = hours + ":" +  minutes + ":" + seconds ; // 남은 시간 text형태로 변경
	  
//     document.all.timer.innerHTML = m;
    
// 	if (RemainDate <= 0) {      
//         clearInterval(tid);
//         msg_state = 0;
//         // firebase.database().ref('/time_over').set({
//         //     status: 0,
//         // });
// 	} else if (RemainDate >= 1000*16) {
// 		alarm_status = 1;
// 		RemainDate = RemainDate - 100;
// 	} else if (RemainDate <= 1000*15) {
// 		if (alarm_status == 1){
// 		    play();
//             alarm_status = 0;
//             firebase.database().ref('/time_over').set({
//                 status: 2,
//             });
// 		}
// 		RemainDate = RemainDate - 100;
// 	}
// 	else{
// 	    RemainDate = RemainDate - 100;
//     }
// }

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
        width: 1400,
        height: 500,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("chart_div"));
    chart.draw(view, options);
}



function blue_timer(){
    diff = ((blue_indicator/remainSec)*Math.PI*2*10).toFixed(2);
    ctx.clearRect(0,0,cw,cw);
    ctx.lineWidth = strokeWeight;
    ctx.fillStyle = "#09F";
    ctx.strokeStyle = "#09F";
    ctx.textAlign = "center";
    ctx.font = '48px serif';
    ctx.fillText(blue_indicator+" sec", r, r, cw - strokeWeight);
    ctx.beginPath();
    ctx.arc(r, r, r - strokeWeight/2, start, diff/10+start, false);
    ctx.stroke();
    if (blue_indicator <= 0) {
        msg_state = 0;
        red_indicator = 1;
        red = setInterval(red_timer, 1000);
        clearTimeout(blue);
	} else if (blue_indicator >= 16) {
		alarm_status = 1;
		blue_indicator = blue_indicator - 1;
	} else if (blue_indicator <= 15) {
		if (alarm_status == 1){
		    play();
            alarm_status = 0;
            firebase.database().ref('/time_over').set({
                status: 2,
            });
		}
		blue_indicator = blue_indicator - 1;
	}
	else{
	    blue_indicator = blue_indicator - 1;
    }
}

function red_timer(){
    var current = document.getElementById('current');
    current.style.color = '#f00';
    diff = ((red_indicator/remainSec)*Math.PI*2*10).toFixed(2);
    ctx.clearRect(0,0,cw,cw);
    ctx.lineWidth = strokeWeight;
    ctx.fillStyle = "#f00";
    ctx.strokeStyle = "#f00";
    ctx.textAlign = "center";
    ctx.font = '48px serif';
    ctx.fillText(red_indicator+" sec", r, r, cw - strokeWeight);
    ctx.beginPath();
    ctx.arc(r, r, r - strokeWeight/2, start-diff/10, start,  false);
    ctx.stroke();
    red_indicator ++ ;
    penalty ++;
}