var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; // "mongodb://localhost:27017/recipes";
var db = null;
var token = "";

var fetchAll = function(callback) {

  // reconnect if initial attempt failed
  // if inital attempt failed this will restablish the conn
  // but the operation will fail.
  //
  // can I pass the code to execute???
  // the code will be immediately executed if already connected
  // or passed to the mongo connect to execute after the connection
  // has been restablished. 
  _connect();

  // _connect(function() {});

  var collection = db.collection(dbCollection);
  collection.find().toArray(function(err, items){

    if(err) return callback(err);
    callback(null, items);

  });

}

var _connect = function() {
  if(db != null) {
    console.log("already connected %s", token);
    return;
  }
  MongoClient.connect(dbUrl, function(err, dbConn) {
    if(err) {
      console.log("Error connecting %s", token);
      console.dir(err);
    }
    else {
      console.log("Connected! %s", token);
      db = dbConn;
    }
  });
}

module.exports = function(dbConnString, x) {
  if(dbUrl == null) {
    console.log("initialized with %s", x);
    dbUrl = dbConnString;
    token = x;
    console.log("Connecting...%s",x);
    _connect();
  }
  return {fetchAll: fetchAll};
}
