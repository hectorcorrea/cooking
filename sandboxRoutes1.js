var db = require('./sandboxDb')("mongodb://localhost:27017/recipes", 1);

// var r = require('./sandboxDb2');
// var db = r.recipes("mongodb://localhost:27017/recipes", 1);
//
// var Recipes = require('./sandboxDb2').Recipes;
// var db = new Recipes("mongodb://localhost:27017/recipes",1);

var getAll = function(req,res) {
  db.fetchAll(function(err, docs) {
    if(err) {
      console.dir(err);
      res.send('error fetching data');
    }
    else {
      console.log('docs fetched');
      res.send('docs fetch: ' + docs.length);
    }
  });
}

module.exports.getAll = getAll;