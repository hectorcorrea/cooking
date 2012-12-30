var dbRecipes = require('./dbRecipes');

var getAll = function(cb) {

  dbRecipes.fetchAll(function(err, items) {
    cb(err, items);
  });

}

var addOne = function(data, cb) {

  dbRecipes.addNew(data, function(err, savedDoc) {
    cb(err, savedDoc);
  });

}

var editOne = function(data, cb) {

  dbRecipes.updateByKey(data, function(err, savedCount) {
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

module.exports = {
  getAll: getAll,
  addOne: addOne,
  editOne: editOne
}

