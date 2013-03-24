var db = require('./sandboxDb');

var getSome = function(req,res) {

  db.setup("mongodb://localhost:27017/recipes");
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

module.exports.getSome = getSome;