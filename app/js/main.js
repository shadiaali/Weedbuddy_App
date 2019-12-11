//Johnny-Five uses process.stdin, which is not available for Electron's use. 
//This causes Electron's render process to crash! 
//We can reroute process.stdin to a compatible replacement stream though

//process.stdin is Node's way of getting data that's passed into it from outside. 
//stdin , short for “standard in”, is the path by which we can pass data into an application. 
//This is usually text data that the user has typed, but it can also come from another application.

var Readable = require("stream").Readable;  
var util = require("util");  
util.inherits(MyStream, Readable);  
function MyStream(opt) {  
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__("stdin", function() {  
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

var five = require("johnny-five");
var board = new five.Board({
  repl:false
});

var temp = document.querySelector("#tempValue");
var light = document.querySelector("#lightValue");
var moisture = document.querySelector("#moistureValue");

board.on("ready", function(){
	var sensor = new five.Sensor({
		pin: "A0",
        freq: 250,
        threshold: 2
	});
	
	var photoresistor = new five.Sensor({
		pin: "A2",
		frequency: 250
	});
	
	var thermometer = new five.Sensor({
		controller: "LM35",
        pin: "A3"
    });

thermometer.on("change", function(){
    var tempInfo = this.value;
	temp.innerHTML = tempInfo;  
    });
	
photoresistor.on("data", function() {
    var lightInfo = this.value;
	light.innerHTML = lightInfo;	
    });

sensor.on("change", function(){
	var moistureInfo = this.value;
	moisture.innerHTML = moistureInfo;  
    });
});
