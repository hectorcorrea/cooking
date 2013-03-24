var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; // "mongodb://localhost:27017/recipes";
var db = null;
var status = null;

console.log("printed only once");

var fetchAll = function(callback) {

  var collection = db.collection(dbCollection);
  collection.find().toArray(function(err, items){

    if(err) return callback(err);
    callback(null, items);

  });

}


module.exports.recipes = function(dbConnString, x) {
  console.log("printed once per require call");
  if(status == null) {
    status = "connecting";
    console.log("Connecting...%s", x);
    dbUrl = dbConnString;
    MongoClient.connect(dbUrl, function(err, dbConn) {
      if(err) {
        console.log("Error connecting");
        console.dir(err);
      }
      else {
        console.log("Connected!");
        db = dbConn;
        status = "connected";
      }
    });
  }
  else {
    if(status == "connecting") {
      console.log("(already attempting to connect)...%s", x);
    }
    else {
      if(status == "connected") {
        console.log("already connected...%s", x);
      }
    } 
  }

  return {fetchAll: fetchAll};

}
