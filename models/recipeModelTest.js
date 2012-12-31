var model = require('./recipeModel');
var connString = "mongodb://localhost:27017/recipes";
var m = model.recipes(connString);

var recipes = [];
var i;
var pork, crepes;

pork = {
  key: 1, 
  name: 'Leg of pork',
  url: 'leg-of-pork', 
  ingredients: '8 lbs leg of pork\r\ngarlic\r\nsour orange',
  directions: 'Stuff with garlic. Marinate all night with a mix with sour orange, ' + 
    'salt, crushed pepper (lots of it). \r\n' +
    'Bake in an oven sack for 3-4 hrs.\r\n' + 
    'If baked with the skin-on, remove most of the skin after the 3rd hour.\r\n' +
    'After the 3rd hour, open the bag and keep in the oven until internal temperature reaches 170 F.'
};

crepes = {
  key: 2,
  name: 'Crepes',
  url: 'crepes', 
  ingredients: '2 cups of milk\r\n1 cup of flour\r\n3 eggs\r\n1 Tbsp sugar\r\n1 tsp vanilla extract\r\n1/4 cup melted butter',
  directions: '1. Combine all ingredientes in a mixer and blen until smooth\r\n' + 
    'In a medium-size skillet over medium heat, melt 1/2 tsp butter; ladle 1/4 cup crepe batter. ' +
    'Swirl the skillet until you have a thin layer of batter covering the bottom.\r\n' + 
    'Cook until the underside is golden brown, about 2 minutes; flip. Cook until the other side ' + 
    'is golden brown, about 1 minute.'
};

recipes.push(pork);
recipes.push(crepes);

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
for(i = 0; i< recipes.length; i++) {
 m.addOne(recipes[i], onAdd);
}

// ...and show them
//m.getAll(showAll);


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
