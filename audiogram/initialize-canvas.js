var fs = require("fs"),
  request = require('request'),
  path = require("path"),
  Canvas = require("../vendor/canvas"),
  getRenderer = require("../renderer/"),
  d3 = require("d3");

const https= require("https");

function initializeCanvas(theme, cb) {
  // Fonts pre-registered in bin/worker

  d3.json('https://colinroitt.uk/audiogram/theme.json', function(err, customTheme){
    if(theme.backgroundImage.includes('http')){
      theme.waveColor = customTheme.waveColour;
      theme.waveTop = parseInt(customTheme.waveTop);
      theme.waveBottom = parseInt(customTheme.waveTop) + parseInt(customTheme.waveHeight);
    }
    var renderer = getRenderer(theme);
  
    if (!theme.backgroundImage) {
      return cb(null, renderer);
    }
  
    // Load background image from file (done separately so renderer code can work in browser too)
  
    // check if background image is URL
    if(theme.backgroundImage.includes("http")){
  
      let uri = "https://colinroitt.uk/audiogram/upload/image";
      let newFile = path.join(__dirname, "..", "settings", "backgrounds", "IMAGE")
  
      return request.head(uri, function(err, res, body){
        return request(uri).pipe(fs.createWriteStream(newFile)).on('close', () => {
          console.log('done');
          fs.readFile(newFile,
            function(err, raw) {
              if (err) {
                return cb(err);
              }
      
              var bg = new Canvas.Image();
              bg.src = raw;
              renderer.backgroundImage(bg);
      
              return cb(null, renderer);
            }
          );
        });
      });
  
    }else{
      fs.readFile(path.join(__dirname, "..", "settings", "backgrounds", theme.backgroundImage),
        function(err, raw) {
          if (err) {
            return cb(err);
          }
    
          var bg = new Canvas.Image();
          bg.src = raw;
          renderer.backgroundImage(bg);
    
          return cb(null, renderer);
        }
      );
    }  
  });
  
    
}

module.exports = initializeCanvas;
