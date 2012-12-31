var model = require('./recipeModel');

var recipes = [];
var i;
var pork, cod;

pork = {
  key: 1, 
  name: 'Leg of pork',
  url: 'leg-of-pork', 
  ingredients: 'ing 1\r\n ing 2\r\n',
  directions: 'cook it'
};

cod = {
  key: 2, 
  name: 'Cod',
  url: 'cod', 
  ingredients: '2-3 cod filets\r\nsafron\r\nolive oil\r\n',
  directions: 'cook it'
};

recipes.push(pork);
recipes.push(cod);

var onAdd = function(err, savedDoc) {
  if(err) {
    console.log("oops!");
    console.log(err);
  }
  else {
    console.log("woo-hoo");
    console.dir(savedDoc);
  }
}


var showAll = function(err, items) {
  if(err) {
    console.log("oops!");
    console.log(err);
  }
  else {
    console.log("woo-hoo");
    console.dir(items);
  }
}

// Add a couple of recipes
// for(i = 0; i< recipes.length; i++) {
//  recipeModel.addOne(recipes[i], onAdd);
// }

// ...and show them
var connString = "mongodb://localhost:27017/recipes";
var m = model.recipes(connString);
m.getAll(showAll);


// recipeModel.getOne(1, 'leg-of-pork', function(err, document) {
//   if (err) {
//     console.log("Oops");
//     console.log(err);
//     return;
//   }

//   if (document === null) {
//     console.log("Document not found");
//     return;
//   }

//   console.log("woo-hoo!!");
//   console.log(document);
// });
