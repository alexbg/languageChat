$( document ).ready(function() {
    // obtengo la ip del usuario y la guardo en la cookie ip
    $.getJSON('https://freegeoip.net/json/', function (data) {
       $.cookie('ip', data.ip);
    }); 
});


