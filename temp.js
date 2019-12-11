const { Board, Thermometer } = require("johnny-five");
const board = new Board();

var temp = document.querySelector("#lightValue");

board.on("ready", () => {
  const thermometer = new Thermometer({
    controller: "LM35",
    pin: "A3"
  });

  thermometer.on("change", function(){
    var tempInfo = this.value;
	temp.innerHTML = tempInfo;  
  });
});
