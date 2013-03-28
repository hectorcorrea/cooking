var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; 
var db = null;

var _connect = function(callback) {

  var isAlreadyConnected = (db != null);
  if(isAlreadyConnected) {
    return callback();
  }

  MongoClient.connect(dbUrl, function(err, dbConn) {
    if(err) return callback(err);
    db = dbConn;
    db.collection(dbCollection).ensureIndex({sortName:1}, function(a,b) {
      console.dir(a);
      console.dir(b);
    });
    callback(null);
  });

}


var setup = function(dbConnString) {
  if(dbUrl == null) {
    dbUrl = dbConnString;
  }
}


var getNewId = function(callback) {

  _connect(function(err) {

    if(err) return callback(err);

    var counters = db.collection('counters');
    var query = {'name': 'recipeId'};
    var order = [['_id','asc']];
    var inc = {$inc:{'next':1}};
    var options = {new: true, upsert: true};
    counters.findAndModify(query, order, inc, options, function(err, doc) {

      if(err) {
        callback(err);
        return;
      }      

      var id = doc.next;
      callback(null, id);
    });

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


var fetchOne = function(key, callback) {

  _connect(function(err) {

    if(err) return callback(err);

    var collection = db.collection(dbCollection);
    var query = {key: key};
    collection.find(query).toArray(function(err, items){
      
      if(err) return callback(err);

      if(items.length === 1) {
        // just what we want
        callback(null, items[0]);
        return;
      }

      if(items.length > 1) {
        // oops! how come we got more than one?
        callback("Error: more than one record found for key [" + key + "]");
        return;
      }

      // no record found
      callback(null, null);

    });

  });

}


var updateOne = function(data, callback) {

  // TODO: we shouldn't need to figure out the "_id",
  // this value should come with the data.
  fetchOne(data.key, function(err, item) {

    if(err) return callback(err);
    if(item === null) return callback("Item to update was not found for key [" + data.key + "]");

    // set the _id to match the one already on the database 
    data._id = item._id;

    var collection = db.collection(dbCollection);
    collection.save(data, function(err, savedCount){

      if(err) return callback(err);
      if(savedCount == 0) return callback("No document was updated");
      if(savedCount > 1) return callback("More than one document was updated");

      fetchOne(data.key, function(err, item) {
        if(err) return callback(err);
        callback(null, item);
      });

    });

  });
  
}


var addOne = function(data, callback) {

  fetchOne(data.key, function(err, item) {

    if(err) return callback(err);
    if(item !== null) return callback("An item with the same key already exists [" + data.key + "]");

    var collection = db.collection(dbCollection);
    collection.save(data, function(err, savedCount){

      if(err) return callback(err);
      callback(null, savedCount);

    });

  });

}


module.exports = {
  setup: setup,
  fetchAll: fetchAll,
  fetchOne: fetchOne,
  addOne: addOne,
  updateOne: updateOne,
  getNewId: getNewId
};

