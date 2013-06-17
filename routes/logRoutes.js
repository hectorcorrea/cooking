var logger = require('log-hanging-fruit').defaultLogger;

var zeroPad = function(number, zeroes) {
  return ('000000' + number).slice(-zeroes);
}

var currentLogFile = function() {
  var now = new Date();
  var day = now.getDate();
  var month = now.getMonth() + 1;
  var date = now.getFullYear() + '-' + zeroPad(month, 2) + '-' + zeroPad(day, 2);
  return date;
}

var current = function(req, res) {
  var path = logger.setupOptions.filePath;
  var date = currentLogFile();
  var html = "<h1>Current Log</h1>" + 
    "log path: " + path + "<br/>" +
    "date: " + date + "<br/>";
  res.send(html);
}

var byDate = function(req, res) {
  res.send('log by date');
}

module.exports = {
  current: current,
  byDate: byDate
}
