const express = require('express');
const app = express();
const http = require("http");
const bodyParser = require('body-parser');
const socketIO = require("socket.io");
const serialport = require("serialport");
const axios = require("axios");

var SerialPort = serialport.SerialPort;
var portName = "/dev/cu.usbmodem14101";

var myPort = new serialport(portName,{
  baudRate:250000,
  parser:new serialport.parsers.Readline("\n")
});

const server = http.createServer(app);

const io = socketIO(server);

const port = process.env.PORT || 5000;
var portStatus = "";
var timeElapsed = "";
var hotendTemperature = "";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/port/status', (req, res) => {
  res.send({ express: portStatus });
});

app.get('/stats/timeElapsed', (req, res) => {
  myPort.write(Buffer.from("M31\n"),function(err,result){
    if(err){
      console.log('ERR: ' + err);
    }
   // console.log('result:' + result)
  });
  // TODO: GET TIME ELAPSED AND SEND
  res.send({ express: timeElapsed });
});

app.get('/stats/hotendTemperature', (req, res) => {
  myPort.write(Buffer.from("M105\n"),function(err,result){
    if(err){
      console.log('ERR: ' + err);
    }
    //console.log('result:' + result)

  });
  res.send({ express: hotendTemperature });
});

/*
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});*/

myPort.on("open", onOpen);
myPort.on("data", onData);
myPort.on('close', onClose);

function onOpen() {
  console.log("Opened serial port");
  portStatus = "Online";
  /* setTimeout(function() {
     myPort.write(Buffer.from("M105\n"),function(err,result){
       if(err){
         console.log('ERR: ' + err);
       }
       console.log('result:' + result)
     });
   }, 1000);*/
}

function onClose(error) {
  portStatus = "Offline";
  console.log("Closed serial port");
}

function onData(data) {
  console.log(data + "\n");
  var dataString = data.toString();
  timeElapsed = dataString.substring(dataString.indexOf("time: "), dataString.indexOf("time: ") + 10);
  hotendTemperature = dataString.substring(dataString.indexOf("T:") + 2, dataString.indexOf(" /0"));

}



server.listen(port, () => console.log(`Listening on port ${port}`));
