var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");
var dbUrl = "mongodb://localhost:27017/cooking";
var joyentUrl = "<enter connection URL here>";
dbUrl = joyentUrl;

var options = {
  db: {},
  server: {
    auto_reconnect: true,
    socketOptions: {keepAlive: 1}
  },
  replSet: {},
  mongos: {}
};

console.log("Connecting...");
MongoClient.connect(dbUrl, options, function(err, db) {
  
  if(err) {
    console.log("Could not connect");
    return;
  }
  
  console.log("Fetching data...");
  var cursor = db.collection("recipes").find().sort({key:1});
  cursor.toArray(function(err, items) {
      console.log("recipes found:", items.length);
      db.close();
      console.log("saving to disk...");
      var text = JSON.stringify(items, null, "\t");
      fs.writeFileSync("recipes.json", text);
      console.log("Done");
  });

});



