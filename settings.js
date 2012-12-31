var fs = require('fs');


var readSettings = function(fileName) {

  if (!fs.existsSync(fileName)) {
    throw "Settings file [" + fileName + "] was not found. " + 
      "Current directory [" + __dirname + "].";
  }
  
  text = fs.readFileSync(fileName, 'utf8');
  return JSON.parse(text);
}


var loadSettings = function(fileName) {
  settings = readSettings(fileName); 
  return settings
}


module.exports = {
  load: loadSettings
}