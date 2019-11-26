const express = require('express'),
      app = express(),
      http = require("http"),
      bodyParser = require('body-parser'),
      socketIO = require("socket.io"),
      serialport = require("serialport"),
      Readline = require("parser-readline"),
      rp = require("request-promise"),
      $ = require("cheerio"),
      fs = require("fs"),
      puppeteer = require("puppeteer"),
      extract = require("extract-zip"),
      path = require("path"),
      shell = require("shelljs"),
      lineReader = require("line-reader"),
      Nightmare = require('nightmare');

const chokidar = require('chokidar');

const nightmare = Nightmare({ show: true });

var portName = "/dev/cu.usbmodem14101";
var modelDatabaseURL = "https://free3d.com/3d-models/";
var modelPrintURL = "https://static.free3d.com/models/123d/printable_catalog/";
const modelDownloadFolder = "/Users/Russell/Downloads/";
var zipName = '';

var myPort = new serialport(portName,{
  baudRate: 250000,
  parser: new serialport.parsers.Readline("\r\n")
});

const parser = myPort.pipe(new Readline({ delimiter: "\n"}));

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

nightmare.on('download', function(state, downloadItem){
  if(state == 'started'){
    nightmare.emit('download', modelDownloadFolder+ 'file.zip', downloadItem);
  }
});

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}

function findModel(startPath, filter){
 if (!fs.existsSync(startPath)){
    return '';
  }

  var files = fs.readdirSync(startPath);
  for(var i = 0;i < files.length;i++){
    var fileName = path.join(startPath,files[i]);
    var stat = fs.lstatSync(fileName);
    if (stat.isDirectory()){
      findModel(fileName, filter);
    }
    else if (fileName.indexOf(filter) >= 0) {
      // Found
      return fileName;
    };
  };
};

var extractAndConvertDone = {}; // or fs.watch fires multiple times :(
// Download folder watch
fs.watch(modelDownloadFolder, (eventType, filename) => {
  if (filename.includes(zipName.replace(".zip","")) && filename.includes(".zip") && getFilesizeInBytes(modelDownloadFolder+filename) > 0) {
    var path = modelDownloadFolder+filename;
    var stats = fs.statSync(path);
    let seconds = +stats.mtime;
    if(extractAndConvertDone[filename] === seconds) return;
      extractAndConvertDone[filename] = seconds;
    console.log("filename:" + filename);
    var dest = modelDownloadFolder + filename.replace(".zip", "");
    // shell.exec
    extract(modelDownloadFolder + filename, {dir: dest}, function (err) {
      // If .obj file found but .stl is not
      if (findModel(dest, ".obj").length > 0 && !findModel(dest, ".stl")) {
          // can add scaling value to command
          shell.exec("python obj2stl.py \"" + findModel(dest, ".obj") + "\" ./temp/temp.stl");
          console.log("EXECUTED");
      }
      // If .stl file found but .obj is not
      else if (!findModel(dest, ".obj")  && findModel(dest, ".stl").length > 0) {
          console.log("stl found");
      }
    })
  }
});


var sliceDone = {};
var gcodeSentDone = {};
fs.watch("./temp/", (eventType, filename) => {
    if (filename === "temp.stl") {
        var path = "./temp/temp.stl";
        var stats = fs.statSync(path);
        let seconds = +stats.mtime;
        if(sliceDone[filename] === seconds) return;
        sliceDone[filename] = seconds;
        shell.exec("CuraEngine/build/CuraEngine slice -v -j CuraEngine/fdmprinter.def.json -o  temp/temp.gcode -l temp/temp.stl");
    }
    else if (filename === "temp.gcode") {
        var path = "./temp/temp.gcode";
        var stats = fs.statSync(path);
        let seconds = +stats.mtime;
        if(gcodeSentDone[filename] === seconds) return;
        gcodeSentDone[filename] = seconds;
        // open gcode file
        setTimeout(function(){
            lineReader.eachLine('temp/temp.gcode', function(line, last) {
          //      console.log(line);
                // for each line in gcode, check if comment
                //if not comment and not empty/just whitespace
                var trimmedLine;
                if (line.includes(";")) {
                    trimmedLine = line.substring(0, line.indexOf(";"));
                }
                else {
                    trimmedLine = line;
                }

                if (trimmedLine && /\S/.test(trimmedLine) && trimmedLine !== '') {
                    //strip leading and ending whitespace from line of gcode
                    // append '\n' to line of gcode
                    trimmedLine = trimmedLine.trim() + '\n';
                    // write resulting line to port
                    myPort.write(Buffer.from(trimmedLine),function(err,result){
                        // print response
                        console.log("line: " + trimmedLine);
                        console.log(result);
                    });
                }
                if(last){

                }
            });
        }, 3000);
    }
});

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
          io.sockets.emit("search models num results", $('.page-results-container > .search-results > .search-result > .search-result__content-wrapper > .search-result__thumb-wrapper', html).length);
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
    rp(url)
        .then(function(html){
          if ($('.vault-cont > .files > .file > strong', html).text().includes(".zip")) {
            zipName = $('.vault-cont > .files > .file > strong', html).text();
            const modelDownload = fs.createWriteStream(modelDownloadFolder + zipName);
            const request = http.get(modelPrintURL + zipName, function(response) {
              response.pipe(modelDownload);
            });
          }
        })
        .catch(function(err){
          //handle error
        });
    (async () => {
      const browser = await puppeteer.launch({
          headless: false
      });

      const page = await browser.newPage();

      await page.goto(url);

      await page.click('.btn-download');

      await page.click('.file');

      page.close();
    })();
  });

  socket.on("get printer stats", () =>{
      // Time elapsed
      myPort.write(Buffer.from("M31\n"),function(err,result){
          if(err){
              console.log('ERR: ' + err);
          }
      });
      // Temperature
      myPort.write(Buffer.from("M105\n"),function(err,result){
          if(err){
              console.log('ERR: ' + err);
          }
      });
      // Position
      myPort.write(Buffer.from("M114\n"),function(err,result){
          if(err){
              console.log('ERR: ' + err);
          }
          const printerStats = {
              timeElapsed: timeElapsed,
              temperature: hotendTemperature,
              position: currentPosition
          };
          io.sockets.emit("printer stats", printerStats);
      });
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
