var five = require("johnny-five");
var board;
var photoresistor;

board = new five.Board();

board.on("ready", function(){
	photoresistor = new five.Sensor({
		pin: "A2",
		frequency: 250
	});
	
	photoresistor.on("data", function() {
    console.log(this.value);
    });
});
