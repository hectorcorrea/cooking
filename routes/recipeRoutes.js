var model = require('../models/recipeModel');
var logger = require('log-hanging-fruit').defaultLogger;


var htmlLineFeeds = function(text) {
  text = text.replace(/\r\n/g, '<br/>');
  text = text.replace(/\r/g,'<br/>');
  text = text.replace(/\n/g,'<br/>');
  return text;
}


var notFound = function(req, res, key) {
  logger.warn('recipeRoutes.notFound. Key [' + key + ']');
  res.status(404).render('404.ejs', { status: 404, message: 'Recipe not found' });
}


var error = function(req, res, title, err) {
  logger.error(title, err);
  res.status(500).render('500.ejs', {message: err});
}


var addNew = function(req, res) {
  
  logger.info('recipeRoutes.addNew');
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.addNew(function(err, newDoc) {

    if(err) {
      error(req, res, 'Error adding new recipe', err);
      return;
    }

    var url = '/recipe/' + newDoc.url + '/' + newDoc.key + '/edit';
    logger.info('redirecting to ' + url);
    res.redirect(url);
  });
}



var save = function(req, res) {
  var key = parseInt(req.params.key);
  logger.info('saving ' + key);

  var data = {
    key: key,
    name: req.body.name,
    ingredients: req.body.ingredients,
    directions: req.body.directions
  };

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.updateOne(data, function(err, updatedDoc) {

    if(err) {
      console.log(err);
      error(req, res, 'Error updating recipe', err);
      return;
    }

    // console.log('updated doc');
    // console.dir(updatedDoc);

    var url = '/recipe/' + updatedDoc.url + '/' + updatedDoc.key;
    logger.info('redirecting to ' + url);
    res.redirect(url);
  });

}


var edit = function(req, res) {
  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);

  logger.info('recipeRoutes.editOne (' + key + ', ' + url + ')');
  m.getOne(key, function(err, doc){

    if(err) {
      error(req, res, 'Error fetching recipe [' + key + ']', err);
      return;
    }

    if(doc === null) {
      notFound(req, res, key);
      return;
    }

    var recipe = {
      key: doc.key,
      name: doc.name,
      ingredients: doc.ingredients,
      directions: doc.directions,
      link: '/recipe/' + doc.url + '/' + doc.key,
      postUrl: '/recipe/save/' + doc.key
    }

    res.render('recipeEdit.ejs', {recipe: recipe});

  });

}


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
  m.getOne(key, function(err, doc){

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
      linkEdit: '/recipe/' + doc.url + '/' + doc.key + '/edit',
      ingredients: htmlLineFeeds(doc.ingredients),
      directions: htmlLineFeeds(doc.directions)
    }

    //console.dir(recipe);
    res.render('recipeOne.ejs', {recipe: recipe});

  });

}


module.exports = {
  addNew: addNew, 
  edit: edit, 
  save: save, 
  viewAll: viewAll, 
  viewOne: viewOne
}
