var recipeModel = require('../models/recipeModel');

var _notFound = function(req, res) {
  res.status(404).render('404.ejs', { status: 404, message: 'Recipe not found' });
}

var editNew = function(req, res) {}
var saveNew = function(req, res) {}
var edit = function(req, res) {}
var save = function(req, res) {}

var viewAll = function(req, res) {

  recipeModel.getAll(function(err, documents){

    var recipes = [];
    var i, recipe, doc; 

    if(err) {
      res.status(500).render('500.ejs', {message: err});
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
  console.log(key + ", " + url);

  recipeModel.getOne(key, url, function(err, doc){

    if(err) {
      res.status(500).render('500.ejs', {message: err});
      return;
    }

    if(doc === null) {
      _notFound(req, res);
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
