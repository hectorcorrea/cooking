var logger = require('log-hanging-fruit').defaultLogger;


var getLog = function(path, date, callback) {

  console.dir(logger);

}

module.exports = {
  getLog: getLog
}