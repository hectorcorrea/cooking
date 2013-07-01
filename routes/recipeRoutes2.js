var model = require('../models/recipeModel');
var logger = require('log-hanging-fruit').defaultLogger;


var viewAll = function(req, res) {
  logger.info('recipeRoutes2.viewAll');
  res.render('recipeAllJson.ejs');
};


var viewAllData = function(req, res) {
  logger.info('recipeRoutes2.viewAllData');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getAll(function(err, documents){

    if(err) {
      console.log(err);
      error(req, res, 'Error fetching [' + title + '] recipes', err);
      return;
    }

    var recipes = [];
    var i, recipe, doc; 
    for(i=0; i<documents.length; i++) {
      doc = documents[i];
      recipe = {
        name: doc.name,
        link: '/recipe/' + doc.url + '/' + doc.key,
        isStarred: doc.isStarred,
        isShoppingList: doc.isShoppingList
      }
      recipes.push(recipe);
    }

    res.send(recipes);
  });

};


module.exports = {
  viewAll: viewAll, 
  viewAllData: viewAllData, 
}
