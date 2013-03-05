var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; // "mongodb://localhost:27017/recipes";
var db = null;

var fetchAll = function(callback) {

  var collection = db.collection(dbCollection);
  collection.find().toArray(function(err, items){

    if(err) return callback(err);
    callback(null, items);

  });

}

module.exports.recipes = function(dbConnString) {
  console.log("Connecting...");
  dbUrl = dbConnString;
  MongoClient.connect(dbUrl, function(err, dbConn) {
    if(err) {
      console.log("Error connecting");
      console.dir(err);
    }
    else {
      console.log("Connected!");
      db = dbConn;
    }
  });
  return {fetchAll: fetchAll};
}

