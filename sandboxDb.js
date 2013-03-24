var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; // "mongodb://localhost:27017/recipes";
var db = null;

var _connect = function(callback) {

  if(db != null) return callback();

  MongoClient.connect(dbUrl, function(err, dbConn) {
    if(err) return callback(err);
    db = dbConn;
    callback(null);
  });

}


var fetchAll = function(callback) {

  _connect(function(err) {

    if(err) return callback(err);

    var collection = db.collection(dbCollection);
    collection.find().toArray(function(err, items){

      if(err) return callback(err);
      callback(null, items);

    });

  });

}


var setup = function(dbConnString) {
  if(dbUrl == null) {
    dbUrl = dbConnString;
  }
}


module.exports = {
  fetchAll: fetchAll,
  setup: setup
};
