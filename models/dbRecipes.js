var logger = require('log-hanging-fruit').defaultLogger;
var dbCollection = "recipes";
var mongoConnect = require("./mongoConnect");


var setup = function(dbConnString) {
  mongoConnect.setup(dbConnString);
};


var getNewId = function(callback) {

  mongoConnect.execute(function(err, db) {

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


var search = function(textToSearch, callback) {
  var query = {'searchText': {'$regex': textToSearch}};
  _fetchList(query, callback);
}

var _fetchList = function(query, callback) {

  mongoConnect.execute(function(err, db) {

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

  mongoConnect.execute(function(err, db) {

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

  mongoConnect.execute(function(err, db) {

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

  });
  
};


var starOne = function(key, starred, callback) {

  mongoConnect.execute(function(err, db) {

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

  mongoConnect.execute(function(err, db) {

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

  mongoConnect.execute(function(err, db) {

    fetchOne(data.key, function(err, item) {

      if(err) return callback(err);
      if(item !== null) return callback("An item with the same key already exists [" + data.key + "]");

      var collection = db.collection(dbCollection);
      collection.save(data, function(err, savedCount){

        if(err) return callback(err);
        callback(null, savedCount);

      });

    });

  });

};


module.exports = {
  setup: setup,
  fetchAll: fetchAll,
  fetchFavorites: fetchFavorites,
  fetchShopping: fetchShopping,
  search: search,
  fetchOne: fetchOne,
  addOne: addOne,
  updateOne: updateOne,
  getNewId: getNewId,
  starOne: starOne,
  addToShoppingList: addToShoppingList,
  removeFromShoppingList: removeFromShoppingList
};

