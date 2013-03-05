var http = require('http');
var express = require('express');
var app = express();
app.set("db", null);


var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = "mongodb://localhost:27017/recipes";

var connectToMongo = function(req,res, next) {

  // console.dir(req.app.settings.db);
  if(req.app.settings.db != null) {
    console.log('Already connected');
    next();
    return;
  }

  console.log("Connecting...")
  MongoClient.connect(dbUrl, function(err, db) {
    if(err) {
      console.log('ERROR: could not connect to mongo');
      console.dir(err);
      next(err);
    }
    else {
      console.log('Connected!');
      req.app.set("db", db);
      next();
    }
  });

}

app.get('/db', function(req, res) {
  req.app.set("db", null);  
  res.send('try again');
});

app.get('*', connectToMongo, function(req, res) {
  console.log('hello world');
  res.send('hello world');
});


// Fire it up! 
var server = http.createServer(app);
var port = 3000;
server.listen(port, function() {
  var address = 'http://localhost:' + port;
  console.log('Express listening at: ' + address);
});