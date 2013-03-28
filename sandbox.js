var MongoClient = require('mongodb').MongoClient;
var dbCollection = "recipes";
var dbUrl = "mongodb://localhost:27017/recipes";

MongoClient.connect(dbUrl, function(err, db) {

  if(err) {
    console.log("Error connecting");
    console.dir(err);
    return;
  }

  // var collection = db.collection(dbCollection);
  // collection.find().sort({sortName:1}).toArray(function(err, items){

  //   if(err) {
  //     console.log("Error finding");
  //     console.dir(err);
  //     return;
  //   }

  //   console.log(items);

  // });

  var collection = db.collection(dbCollection);
  var cursor = collection.find().sort({sortName:1});
  cursor.toArray(function(err, items){

    if(err) {
      console.log("Error finding");
      console.dir(err);
      return;
    }

    console.log(items);

  });
  
});
