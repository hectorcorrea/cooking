var recipeModel = require('./recipeModel');

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

recipeModel.getAll(showAll);

// var cod = {
//   key: 2, 
//   // name: 'Cod', 
//   // ingredients: '2-3 cod filets\r\nsafron\r\nolive oil\r\n',
//   directions: 'cook it'
// }

// addOne(cod, function(err, savedDoc) {
//   if(err) {
//     console.log("oops!");
//     console.log(err);
//   }
//   else {
//     console.log("woo-hoo");
//     console.dir(savedDoc);
//   }
// });

// editOne(cod, function(err) {
//   if(err) {
//     console.log("oops!");
//     console.log(err);
//   }
//   else {
//     console.log("woo-hoo");
//   }
// });