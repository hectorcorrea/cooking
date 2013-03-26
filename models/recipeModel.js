var db = require('./dbRecipes');
var util = require('./recipeUtil');
var dbUrl = null;

var getAll = function(cb) {

  db.setup(dbUrl);
  db.fetchAll(function(err, documents) {
    cb(err, documents);
  });

}


var getOne = function(key, cb) {

  db.setup(dbUrl);
  db.fetchOne(key, function(err, document) {
    cb(err, document);
  });

}


var addNew = function(cb) {

  db.setup(dbUrl);
  db.getNewId(function(err, id) {

    if(err) return cb(err);
    
    var data = {
      key: id,
      name: 'New recipe',
      url: 'new-recipe', 
      ingredients: 'enter ingredients',
      directions: 'enter directions'
    };

    db.addOne(data, function(err, savedDoc) {
      cb(err, savedDoc);
    });

  });

}


var updateOne = function(data, cb) {

  db.setup(dbUrl);
  data.url = util.getUrlFromName(data.name);
  console.log(data);

  db.updateOne(data, function(err, savedDoc) {
    if (err) return cb(err);
    cb(null, savedDoc);
  });

}


var publicApi = {
  getAll: getAll,
  getOne: getOne,
  addNew: addNew,
  updateOne: updateOne
}


module.exports.recipes = function(dbConnString) {
  dbUrl = dbConnString;
  return publicApi;
}

