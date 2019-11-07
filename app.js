const express = require('express');
const app = express();
const http = require("http");
const bodyParser = require('body-parser');
const socketIO = require("socket.io");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = "/dev/cu.usbmodem14201";

var myPort = new serialport(portName,{
  baudRate:250000,
  parser:new serialport.parsers.Readline("\n")
});

const server = http.createServer(app)

const io = socketIO(server)

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})


myPort.on("open",onOpen);
myPort.on("data", onData);
var receivedData = "";

function onOpen() {
  console.log("Open connection");
  socket.emit('port connected', true);
  setTimeout(function() {
    myPort.write(Buffer.from("M105\n"),function(err,result){
      if(err){
        console.log('ERR: ' + err);
      }
      console.log('result:' + result)
    });
  }, 3000);
}
function onData(data) {
  console.log("Data: " + data);
}


server.listen(port, () => console.log(`Listening on port ${port}`));
