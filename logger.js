var fs = require('fs');
var path = require('path');
var logLevel = 'INFO';
var logPath = ''; 
var echoToConsole = false;


var zeroPad = function(number, zeroes) {
  return ('000000' + number).slice(-zeroes);
}


var getTimestamp = function() {
  var now = new Date();

  var day = now.getDate();
  var month = now.getMonth() + 1;
  var date = now.getFullYear() + '-' + zeroPad(month, 2) + '-' + zeroPad(day, 2);
  
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var milliseconds = now.getMilliseconds();
  var time = zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2) + '.' + zeroPad(milliseconds, 3);

  return date + ' ' + time;
}


var doLog = function(level, text) {

  var timestamp = getTimestamp();
  var fileName = timestamp.substring(0,10).replace(/-/g,'_') + ".log";
  var logFile = path.join(logPath, fileName);
  var textToLog = timestamp + " " + level + ": " + text;

  if(echoToConsole) {
    console.log(textToLog);
  }

  // Log to disk
  fs.appendFile(logFile, textToLog + '\r\n', function(err) {
    if(err) {
      console.log('ERROR writting to log file [' + logFile + ']. Error [' + err + ']');
    }
  });

}


var info = function(text) {
  if(logLevel == 'INFO') {
    doLog('INFO', text);
  }
}


var warn = function(text) {
  if(logLevel == 'WARN' || logLevel == 'INFO') {
    doLog('WARN', text);
  }
}


var error = function(text, exception) {
  if(logLevel == 'ERROR' || logLevel == 'WARN' || logLevel == 'INFO') {
    if(exception) {
      text = text + '\r\n' + exception;
    }
    doLog('ERROR', text);
  }
}


module.exports.init = function(path, level, echo) {
  if(level == 'INFO' || level == 'WARN' || level == 'ERROR') {
    logLevel = level;
  }
  logPath = path;
  if(echo) {
    echoToConsole = true;
  }
}

module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;

