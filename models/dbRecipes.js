var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; // e.g. "mongodb://localhost:27017/recipes";


var getNewId = function(callback) {

  MongoClient.connect(dbUrl, function(err, db) {

    if(err) return callback(err);

    var counters = db.collection('counters');
    var query = {'name': 'recipeId'};
    var order = [['_id','asc']];
    var inc = {$inc:{'next':1}};
    var options = {new: true, upsert: true};
    counters.findAndModify(query, order, inc, options, function(err, doc) {
      db.close()
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


var fetchOne = function(key, url, callback) {

  MongoClient.connect(dbUrl, function(err, db) {

    if(err) return callback(err);

    var collection = db.collection(dbCollection);
    var query = {key: key, url: url};
    collection.find(query).toArray(function(err, items){

      db.close();
      
      if(err) return callback(err);
      
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


var updateOne = function(data, callback) {

  fetchOne(data.key, data.url, function(err, item) {

    if(err) return callback(err);
    if(item === null) return callback("Item to update was not found for key [" + data.key + ", " + data.url + "]");

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


var addOne = function(data, callback) {

  fetchOne(data.key, data.url, function(err, item) {

    if(err) {
      return callback(err);
    }

    if(item !== null) {
      return callback("An item with the same key already exists [" + data.key + "," + data.url + "]");
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


var publicApi = {
  fetchAll: fetchAll,
  fetchOne: fetchOne,
  addOne: addOne,
  updateOne: updateOne,
  getNewId: getNewId
};


module.exports.recipes = function(dbConnString) {
  dbUrl = dbConnString;
  return publicApi;
}

