var five = require("johnny-five");
var board = new five.Board({
  repl:false
});

var moisture = document.querySelector("moistureValue");

board.on("ready", function(){
var sensor = new five.Sensor({
  pin: "A0",
  freq: 250,
  threshold: 2
  });

  sensor.on("change", function(){
    var moistureInfo = this.value;
	moisture.innerHTML = moistureInfo;  
  });
  
});