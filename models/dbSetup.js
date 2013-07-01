var logger = require('log-hanging-fruit').defaultLogger;
var mongoConnect = require("./mongoConnect");

var init = function(dbConnString) {

  mongoConnect.setup(dbConnString);
  mongoConnect.execute(function(err, db) {

    if(err) {
      logger.error("Could not perform DB initialization tasks. Error: " + err);
      return;
    }

    logger.info("Validating index by name...");
    db.collection("recipes").ensureIndex({sortName:1}, function(err,ix) {

      if(err) {
        logger.error("Error creating index: " + err);
        return;
      }

      logger.info("...done validating index by name.");
    });

  }); 

};


module.exports = {
  init: init
}