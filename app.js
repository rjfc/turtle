const express = require('express'),
      app = express(),
      http = require("http"),
      bodyParser = require('body-parser'),
      socketIO = require("socket.io"),
      serialport = require("serialport"),
      Readline = require("parser-readline"),
      rp = require("request-promise"),
      $ = require('cheerio');

var portName = "/dev/cu.usbmodem14201";
var modelDatabaseURL = "https://free3d.com/3d-models/";

var myPort = new serialport(portName,{
  baudRate:250000,
  parser:new serialport.parsers.Readline("\r\n")
});

const parser =  myPort.pipe(new Readline({ delimiter: "\n"}));

const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 5000;
var portStatus = "";
var timeElapsed = "";
var hotendTemperature = "";
var currentPosition = {
  X: "",
  Y: "",
  Z: ""
};

var modelLinks = [];
var modelNames = [];
var modelThumbnails = [];

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
  });
  res.send({ express: timeElapsed });
});

app.get('/stats/hotendTemperature', (req, res) => {
  myPort.write(Buffer.from("M105\n"),function(err,result){
    if(err){
      console.log('ERR: ' + err);
    }
  });
  res.send({ express: hotendTemperature });
});

app.get('/stats/currentPosition', (req, res) => {
  myPort.write(Buffer.from("M114\n"),function(err,result){
    if(err){
      console.log('ERR: ' + err);
    }
  });
  res.send({ express: currentPosition });
});

app.post('/models/search', (req, res) => {
  //${req.body.post} is the search data.
 /* rp(modelDatabaseURL)
      .then(function(html){
        //success!
        console.log(html);
      })
      .catch(function(err){
        //handle error
      });*/
 //console.log(req.body.searchValue);
  console.log(req.body.searchValue);
  /*rp(modelDatabaseURL + req.body.searchValue)
      .then(function(html){
        const modelLinks = [];
        const modelThumbnails = [];
        console.log($('.search-result__content-wrapper > .search-result__thumb-wrapper', html).length);
        for (let i = 0; i < $('.search-result__content-wrapper > .search-result__thumb-wrapper', html).length; i++) {
          modelLinks.push($('.search-result__content-wrapper > .search-result__thumb-wrapper', html)[i].attribs.href);
          modelThumbnails.push($('.search-result__content-wrapper > .search-result__thumb-wrapper > img', html)[i].attribs.src);
        }
        res.send ({ express: modelThumbnails });
      })
      .catch(function(err){
        //handle error
      });*/
});

/*
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});*/

myPort.on("open", onOpen);
parser.on("data", onData);
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
  var dataString = data.toString();
  dataString = dataString.replace(/\s/g, "");
  console.log("start data:" + dataString + "close\n");

  if (dataString.indexOf("Printtime:") >= 0) { //Print time
    timeElapsed = dataString.substring(dataString.indexOf("Printtime:") + 10, dataString.length);
  }
  else if (dataString.indexOf("okT:") >= 0) { //Hotend temperature
    hotendTemperature = dataString.substring(dataString.indexOf("okT:") + 4, dataString.indexOf("/0.00"));
  }
  else if (dataString.indexOf("CountX:") >= 0) { //X,Y,Z position
    currentPosition.X = dataString.substring(dataString.indexOf("X:") + 2, dataString.indexOf("Y:"));
    currentPosition.Y = dataString.substring(dataString.indexOf("Y:") + 2, dataString.indexOf("Z:"));
    currentPosition.Z = dataString.substring(dataString.indexOf("Z:") + 2, dataString.indexOf("E:"));
  }
}

io.on("connection", socket => {
  console.log("New client connected");
  //Here we listen on a new namespace called "incoming data"
  socket.on("search models", (data)=>{
    //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
    console.log(data);
    rp(modelDatabaseURL + data)
        .then(function(html){
          modelLinks = [];
          modelNames = [];
          modelThumbnails = [];
          console.log($('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper', html).length);
          for (let i = 0; i < $('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper', html).length; i++) {
            modelLinks.push("https://free3d.com" + $('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper', html)[i].attribs.href);
            modelNames.push($('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper > img', html)[i].attribs.title);
            modelNames[i] = modelNames[i].replace("3d model", "").trim();
            modelThumbnails.push($('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper > img', html)[i].attribs.src);
            modelThumbnails[i] = modelThumbnails[i].replace("imgd/s", "imgd/l");
          }
          console.log(modelNames);
          const modelsInfo = {
            modelThumbnails: modelThumbnails
          };
          io.sockets.emit("search models thumbnails", modelsInfo);
        })
        .catch(function(err){
          //handle error
        });
  });

  socket.on("get model info", (idNumber) =>{
    const modelInfo = {
      name: modelNames[idNumber],
      url: modelLinks[idNumber],
      thumbnail: modelThumbnails[idNumber]
    };
    io.sockets.emit("model info", modelInfo);
  });

  socket.on("print model", (url) =>{
    console.log("url:" + url);

  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
