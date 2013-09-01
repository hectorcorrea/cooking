var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");
var async = require("async");
var localUrl = "mongodb://localhost:27017/cooking";
var azureUrl = "<enter connection URL here>";
var db = null;
var targetUrl = localUrl;

var options = {
  db: {},
  server: {
    auto_reconnect: true,
    socketOptions: {keepAlive: 1}
  },
  replSet: {},
  mongos: {}
};


var done = function(err) {
  if(err) {
    console.log("done with error: " + err);
  }
  else {
    console.log("done and happy");
  }

  db.close();
  console.log("db closed");
};


var iterator = function(item, cb) {

  console.log("Saving " + (item && item.key) ? item.key : "N/A");
  db.collection("recipes").save(item, {safe: true}, function(err, savedItem) {
    if(err) {
      console.log("ERROR: saving " + (item && item.key) ? item.key : "N/A");
      cb(err);
      return;
    }
    cb();
  });

};


console.log("Connecting...");
MongoClient.connect(targetUrl, options, function(err, _db) {
  
  if(err) {
    console.log("Could not connect");
    return;
  }
  
  console.log("Fetching data...");
  db = _db;
  var text = fs.readFileSync("recipes.json");
  var data = JSON.parse(text);

  async.eachLimit(data, 1, iterator, done);

});



