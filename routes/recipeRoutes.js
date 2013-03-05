var model = require('../models/recipeModel');
var logger = require('log-hanging-fruit').defaultLogger;


var notFound = function(req, res, key) {
  logger.warn('recipeRoutes.notFound. Key [' + key + ']');
  res.status(404).render('404.ejs', { status: 404, message: 'Recipe not found' });
}


var error = function(req, res, title, err) {
  logger.error(title, err);
  res.status(500).render('500.ejs', {message: err});
}


var editNew = function(req, res) {
  logger.info('recipeRoutes.editNew');
  
  var data = {
    name: 'New recipe',
    url: 'new-recipe', 
    ingredients: 'enter ingredients',
    directions: 'enter directions'
  };

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.addOne(data, function(err, newDoc) {

    if(err) {
      error(req, res, 'Error adding new recipe', err);
      return;
    }

    res.redirect('/recipe/list');
  });
}

var saveNew = function(req, res) {}
var edit = function(req, res) {}
var save = function(req, res) {}


var viewAll = function(req, res) {

  logger.info('recipeRoutes.viewAll');
  
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getAll(function(err, documents){

    var recipes = [];
    var i, recipe, doc; 

    if(err) {
      error(req, res, 'Error fetching all recipes', err);
      return;
    }

    for(i=0; i<documents.length; i++) {
      doc = documents[i];
      recipe = {
        name: doc.name,
        link: '/recipe/' + doc.url + '/' + doc.key
      }
      recipes.push(recipe);
    }

    res.render('recipeAll.ejs', {recipes: recipes});

  });
}


var viewOne = function(req, res) {

  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);

  logger.info('recipeRoutes.viewOne (' + key + ', ' + url + ')');
  m.getOne(key, url, function(err, doc){

    if(err) {
      error(req, res, 'Error fetching recipe [' + key + ']', err);
      return;
    }

    if(doc === null) {
      notFound(req, res, key);
      return;
    }

    var recipe = {
      name: doc.name,
      link: '/recipe/' + doc.url + '/' + doc.key,
      ingredients: doc.ingredients,
      directions: doc.directions
    }

    res.render('recipeOne.ejs', {recipe: recipe});

  });

}


module.exports = {
  editNew: editNew, 
  saveNew: saveNew, 
  edit: edit, 
  save: save, 
  viewAll: viewAll, 
  viewOne: viewOne
}
