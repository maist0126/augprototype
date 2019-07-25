const mic_on = document.getElementById('mic_on');
const mic_off = document.getElementById('mic_off');
const help = document.getElementById('help');
const label = document.getElementById('label');
let userid = undefined;

window.onload = function(){
    userid = getQueryStringObject().id;
    label.innerHTML = ""+getQueryStringObject().name;
};

mic_on.addEventListener('click',function(e){
    console.log("stop");
    $("#mic_on").toggle(); // show -> hide , hide -> show
    $("#mic_off").toggle();
    $("#help").toggle(); // show -> hide , hide -> show
});
mic_off.addEventListener('click',function(e){
    console.log("start");
    $("#mic_on").toggle(); // show -> hide , hide -> show
    $("#mic_off").toggle();
    $("#help").toggle(); // show -> hide , hide -> show
});


function add(userid) {
  console.log("help");
  help.style.backgroundColor = '#ffffff';
  help.style.color = '#333333';
  help.style.fontWeight = '700';
  help.setAttribute("value", "요청되었습니다");
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