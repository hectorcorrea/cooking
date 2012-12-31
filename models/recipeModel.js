var db = require('./dbRecipes');
var dbUrl = null;


var getAll = function(cb) {

  var dbRecipes = db.recipes(dbUrl);
  dbRecipes.fetchAll(function(err, documents) {
    cb(err, documents);
  });

}


var getOne = function(key, url, cb) {

  var dbRecipes = db.recipes(dbUrl);
  dbRecipes.fetchOne(key, url, function(err, document) {
    cb(err, document);
  });

}


var addOne = function(data, cb) {

  var dbRecipes = db.recipes(dbUrl);
  dbRecipes.addOne(data, function(err, savedDoc) {
    cb(err, savedDoc);
  });

}


var updateOne = function(data, cb) {

  var dbRecipes = db.recipes(dbUrl);
  dbRecipes.updateOne(data, function(err, savedCount) {
    if (err) {
      cb(err);
    }
    else if(savedCount === 1) {
      cb(null);
    }
    else {
      cb('Record not updated OK [' + savedCount + ']');
    }
  });

}


var publicApi = {
  getAll: getAll,
  getOne: getOne,
  addOne: addOne,
  updateOne: updateOne
}


module.exports.recipes = function(dbConnString) {
  dbUrl = dbConnString;
  return publicApi;
}

