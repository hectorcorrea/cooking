var logger = require('log-hanging-fruit').defaultLogger;
var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = null; 
var db = null;

var _connect = function(callback) {

  var isAlreadyConnected = (db != null);
  if(isAlreadyConnected) {

    // Ping the server to make sure things are still OK.
    //
    // If the connection is dropped because it was idle
    // the ping will restore it and the client won't 
    // even notice we lost connectivity. 
    //
    // This ping is wasteful when the connection is OK
    // but I am willing to take the hit.
    //
    var admin = db.admin();
    
    logger.debug("Already connected, about to ping");
    admin.ping(function(err) {
      if (err) {
        logger.debug("Already connected but then disconnected. Retrying...");
        db = null;
        _connect(callback);
        logger.debug("retried");
      }
      else {
        logger.debug("Already connected");
        callback();
      }
    }); 

    logger.debug("Pinged");
    return;
  }

  // These options yield the best connectivity between 
  // MongoLab and Azure. 
  var options = {
    db: {},
    server: {
      auto_reconnect: true,
      socketOptions: {keepAlive: 1}
    },
    replSet: {},
    mongos: {}
  };

  // Connect!
  logger.debug("Connecting...");
  MongoClient.connect(dbUrl, options, function(err, dbConn) {
    if(err) {
      logger.error("Could not connect to DB");
      return callback(err);
    }
    logger.debug("Connected!");
    db = dbConn;
    db.collection(dbCollection).ensureIndex({sortName:1}, function(err,ix) {});
    callback(null);
  });

};


var setup = function(dbConnString) {
  if(dbUrl == null) {
    dbUrl = dbConnString;
  }
};


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

};


var fetchAll = function(callback) {
  var query = {};
  _fetchList(query, callback);
};


var fetchFavorites = function(callback) {
  var query = {isStarred: true};
  _fetchList(query, callback);
};


var fetchShopping = function(callback) {
  var query = {isShoppingList: true};
  _fetchList(query, callback);
};


var _fetchList = function(query, callback) {

  _connect(function(err) {

    if(err) {
      logger.error("_fetchList - connect error");
      db = null;
      return callback(err);
    }

    logger.debug("_fetchList - connected ok");
    var collection = db.collection(dbCollection);
    var fields = {key: 1, name: 1, url: 1, isStarred: 1, isShoppingList: 1};
    var cursor = collection.find(query, fields).sort({sortName:1});
    cursor.toArray(function(err, items){
      if(err) {
        logger.error("_fetchList - error reading");
        db = null;
        return callback(err);
      }
      logger.debug("_fetchList - everything is OK");
      callback(null, items);
    });

  });

};


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

};


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
  
};


var starOne = function(key, starred, callback) {

  _connect(function(err) {

    if(err) return callback(err);

    var query = {key: key};
    var field = {'$set': {'isStarred': starred}};
    var collection = db.collection(dbCollection);
    collection.update(query, field, function(err, count) {
      if(err) return callback(err);
      if(count === 0) return callback("No records were starred");
      if(count > 1) return callback("More than one record was starred");
      callback(null);
    });

  });

};


var addToShoppingList = function(key, callback) {
  _updateShoppingList(key, true, callback);
}


var removeFromShoppingList = function(key, callback) {
  _updateShoppingList(key, false, callback);
}


var _updateShoppingList = function(key, isAddToList, callback) {

  _connect(function(err) {

    if(err) return callback(err);

    var query = {key: key};
    var field = {'$set': {'isShoppingList': isAddToList}};
    var collection = db.collection(dbCollection);
    collection.update(query, field, function(err, count) {
      if(err) return callback(err);
      if(count === 0) return callback("No records were marked for ShoppingList");
      if(count > 1) return callback("More than one record was for ShoppingList");
      callback(null);
    });

  });

};


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

};


module.exports = {
  setup: setup,
  fetchAll: fetchAll,
  fetchFavorites: fetchFavorites,
  fetchShopping: fetchShopping,
  fetchOne: fetchOne,
  addOne: addOne,
  updateOne: updateOne,
  getNewId: getNewId,
  starOne: starOne,
  addToShoppingList: addToShoppingList,
  removeFromShoppingList: removeFromShoppingList
};

