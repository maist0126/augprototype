const mic_on = document.getElementById('mic_on');
const mic_off = document.getElementById('mic_off');
const help = document.getElementById('help');

let last_known_scroll_position = 0;
let ticking = false;

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