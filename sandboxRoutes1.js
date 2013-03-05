var sandbox = require('./sandboxDb').recipes("mongodb://localhost:27017/recipes");

var getAll = function(req,res) {
  sandbox.fetchAll(function(err, docs) {
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