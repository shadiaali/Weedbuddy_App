//Johnny-Five uses process.stdin, which is not available for Electron's use. 
//This causes Electron's render process to crash! 
//We can reroute process.stdin to a compatible replacement stream though

//process.stdin is Node's way of getting data that's passed into it from outside. 
//stdin , short for “standard in”, is the path by which we can pass data into an application. 
//This is usually text data that the user has typed, but it can also come from another application.

var Readable = require("stream").Readable;
var util = require("util");
var five = require("johnny-five");

util.inherits(MyStream, Readable);

function MyStream(opt) {
  Readable.call(this, opt);
}
MyStream.prototype._read = function () {};
// hook in our stream
process.__defineGetter__("stdin", function () {
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

var board = new five.Board({
  repl: false
});



//sensors
var moisture, moistureReading, moisturePlaceholder;
moisture = document.querySelector("#moisture");
moistureReading = moisture.querySelector(".sensorData");
moisturePlaceholder = moisture.querySelector(".sensorLabel");

var temperature, temperatureReading, temperaturePlaceholder;
temperature = document.querySelector("#temperature");
temperatureReading = temperature.querySelector(".sensorData");
temperaturePlaceholder = temperature.querySelector(".sensorLabel");


var photoresistor, photoresistorReading, photoresistorPlaceholder;
photoresistor = document.querySelector("#photoresistor");
photoresistorReading = photoresistor.querySelector(".sensorData");
photoresistorPlaceholder = photoresistor.querySelector(".sensorLabel");



//math function to clean up the long data being read from moisture and photoresistor
function Round(minNumberIn, maxNumber, minNumberOut, maxNumberOut) {
  return function rounder(x) {
    return Math.round((x - minNumberIn) * (maxNumberOut - minNumberOut) / (maxNumber - minNumberIn) + minNumberOut);
  };
}

//charts.js 
var moistureChart = document.getElementById('moistureChart').getContext('2d');
var temperatureChart = document.getElementById('temperatureChart').getContext('2d');
var photoresistorChart = document.getElementById('photoresistorChart').getContext('2d');



//moisture sensor
board.on("ready", function () {
  var moisture = new five.Sensor({
    pin: "A0",
    freq: 500,
    threshold: 2
  });

  moisture.on("change", function () {
    var sensorInfo = this.value;
    var rounding = Round(200, 1023, 100, 0);
    moistureReading.innerHTML = rounding(sensorInfo) + "%";
    var value = rounding(sensorInfo);

    if (value >= 90) {
      moisturePlaceholder.innerHTML = "Very wet";
    } else if (value > 15) {
      moisturePlaceholder.innerHTML = "Perfect";
    } else {
      moisturePlaceholder.innerHTML = "Parched";
    }

  //moisture chart
    var MoistureChart = new Chart(moistureChart, {
      type: 'doughnut',
      data: {
        responsive: true,
        maintainAspectRatio: true,
        labels: ['Moisture Percentage', 'Dry Level'],
        datasets: [{
          data: [value, 100 - value],
          backgroundColor: ['#4F88F5'],
          borderWidth: [1, 0],
          hoverBorderWidth: 3,
          hoverBorderColor: '#FFF',
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: '#000'
          }
        },
        
        tooltips: {
          enable: true
        },

        animation: {
          animationScale: false
        },

        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }
        },
        cutoutPercentage: 50
      }
    });
  });
});


//temperature sensor

board.on("ready", function () {
  var temperature = new five.Temperature({
    controller: "LM35",
    pin: "A3",
    freq: 4000
  });

  temperature.on("change", function () {
        temperatureReading.innerHTML = this.celsius + "°";
        var value = this.celsius;
        if (value >= 30) {
          temperaturePlaceholder.innerHTML = "Burning Up";
        } else if (value > 5) {
          temperaturePlaceholder.innerHTML = "Ideal";
        } else {
          temperaturePlaceholder.innerHTML = "Too Cold!";
        }
    
//temperature chart
    var TemperatureChart = new Chart(temperatureChart, {
      type: 'horizontalBar',
      data: {
        responsive: true,
        maintainAspectRatio: true,
        labels: ['Temperature'],
        datasets: [{
          data: [value],
          backgroundColor: ['#E57539'],
          borderWidth: [1, 0],
          
        }]
      },
      options: {
        legend: {
          display: false,
          
        },
scales: {
  xAxes: [{
    display: false, // hides the horizontal scale
    stacked: true // stacks the bars on the x axis
  }],
  yAxes: [{
    display: false, // hides the vertical scale
    stacked: true // stacks the bars on the y axis
  }]
},
        animation: {
          animationScale: false
        },

        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }
        },
        cutoutPercentage: 50
      }
    });
  });

});

//photoresistor sensor
board.on("ready", function () {
var photoresistor = new five.Sensor({
  pin: "A2",
  freq: 250
});

photoresistor.on("change", function () {
var sensorInfo = this.value;
var rounding = Round(0, 1023, 100, 0);
photoresistorReading.innerHTML = rounding(sensorInfo) + "<span> lm</span>";
value = rounding(sensorInfo);

if (value >= 95) {
  photoresistorPlaceholder.innerHTML = "Just Right";
} else if (value > 40) {
  photoresistorPlaceholder.innerHTML = "Could be Better";
} else {
  photoresistorPlaceholder.innerHTML = "Too Dark";
}

  //photoresistor chart
var PhotoresistorChart = new Chart(photoresistorChart, {
type: 'doughnut',
data: {
  responsive: true,
  maintainAspectRatio: true,
  labels: ['Light Level', 'Dark Level'],
  datasets: [{
    data: [value, 100 - value],
    backgroundColor: ['#F4EB1B'],
    borderWidth: [1, 0],
    hoverBorderWidth: 3,
    hoverBorderColor: '#FFF',
  }]
},
options: {
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: '#000'
    }
  },

  tooltips: {
    enable: true
  },

  animation: {
    animationScale: false
  },

  layout: {
    padding: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0
    }
  },
  cutoutPercentage: 50
}
});
});
});