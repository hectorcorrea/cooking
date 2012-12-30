var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/recipes";
var dbCollection = "recipes";


var fetchOne = function(key, url, callback) {

  MongoClient.connect(dbUrl, function(err, db) {

    if(err) return callback(err);

    var collection = db.collection(dbCollection);
    var query = {key: key, url: url};
    collection.find(query).toArray(function(err, items){

      db.close();
      
      if(err) return callback(err);

      console.dir(items);
      
      if(items.length === 1) {
        // just what we want
        callback(null, items[0]);
      }
      else if(items.length > 1) {
        // oops! how come we got more than one?
        callback("Error: more than one record found for key [" + key + ", " + url + "]");
      }
      else {
        // no record found
        callback(null, null);
      }

    });

  });

}


var fetchAll = function(callback) {

  MongoClient.connect(dbUrl, function(err, db) {

    if(err) return callback(err);

    var collection = db.collection(dbCollection);
    collection.find().toArray(function(err, items){

      db.close()
      if(err) return callback(err);
      callback(null, items);

    });

  });

}


var updateByKey = function(data, callback) {

  fetchByKey(data.key, function(err, item) {

    if(err) return callback(err);
    if(item === null) return callback("Item to update was not found for key [" + data.key + "]");

    // set the _id to match the one already on the database 
    data._id = item._id;

    MongoClient.connect(dbUrl, function(err, db) {

      if(err) return callback(err);

      var collection = db.collection(dbCollection);
      collection.save(data, function(err, savedCount){

        db.close()
        if(err) return callback(err);
        callback(null, savedCount);

      });

    });

  });
  
}


var addNew = function(data, callback) {

  fetchByKey(data.key, function(err, item) {

    if(err) {
      return callback(err);
    }

    if(item !== null) {
      return callback("An item with the same key already exists [" + data.key + "]");
    }

    MongoClient.connect(dbUrl, function(err, db) {

      if(err) return callback(err);

      var collection = db.collection(dbCollection);
      collection.save(data, function(err, savedCount){

        db.close()
        if(err) return callback(err);
        callback(null, savedCount);

      });

    });

  });

}

module.exports = {
  fetchOne: fetchOne,
  fetchAll: fetchAll,
  addNew: addNew,
  updateByKey: updateByKey
}
