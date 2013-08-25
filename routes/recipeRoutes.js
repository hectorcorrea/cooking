var model = require('../models/recipeModel');
var logger = require('log-hanging-fruit').defaultLogger;


var notFound = function(req, res, key) {
  logger.warn('recipeRoutes.notFound. Key [' + key + ']');
  res.status(404).send({ status: 404, message: 'Recipe not found' });
};


var error = function(req, res, title, err) {
  logger.error(title + ' ' + err);
  res.status(500).send({message: err});
};


var index = function(req, res) {
  logger.info('recipeRoutes.index');
  res.render('index.ejs');
};


var allData = function(req, res) {
  logger.info('recipeRoutes.allData');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getAll(function(err, documents){

    if(err) {
      return error(req, res, 'Error fetching [' + title + '] recipes', err);
    }

    var recipes = [];
    var i, recipe, doc; 
    for(i=0; i<documents.length; i++) {
      doc = documents[i];
      recipe = {
        name: doc.name,
        link: 'recipe/' + doc.url + '/' + doc.key,
        key: doc.key,
        url: doc.url,
        isStarred: doc.isStarred,
        isShoppingList: doc.isShoppingList
      }
      recipes.push(recipe);
    }

    res.send(recipes);
  });

};


var oneData = function(req, res) {

  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);

  logger.info('recipeRoutes.oneData (' + key + ', ' + url + ')');
  m.getOne(key, false, function(err, doc){

    if(err) {
      return error(req, res, 'Error fetching recipe [' + key + ']', err);
    }

    if(doc === null) {
      return notFound(req, res, key);
    }

    var recipe = {
      name: doc.name,
      key: doc.key,
      url: doc.url,
      ingredients: doc.ingredients,
      directions: doc.directions,
      notes: doc.notes,
      isStarred: doc.isStarred,
      isShoppingList: doc.isShoppingList
    }

    res.send(recipe);
  });

};


var edit = function(req, res) {

  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);

  logger.info('recipeRoutes.edit (' + key + ', ' + url + ')');
  m.getOne(key, true, function(err, doc){

    if(err) {
      return error(req, res, 'Error fetching recipe [' + key + ']', err);
    }

    if(doc === null) {
      return notFound(req, res, key);
    }

    var recipe = {
      name: doc.name,
      key: doc.key,
      url: doc.url,
      ingredients: doc.ingredients,
      directions: doc.directions,
      notes: doc.notes,
      isStarred: doc.isStarred,
      isShoppingList: doc.isShoppingList
    }

    res.send(recipe);
  });

};


var starOne = function(req, res) {
  logger.info('recipeRoutes.starOne');
  _starOne(req, res, true);
};


var unstarOne = function(req, res) {
  logger.info('recipeRoutes.unstarOne');
  _starOne(req, res, false);
};


var _starOne = function(req, res, star) {
  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.starOne(key, star, function(err) {
    if(err) {
      logger.warn('Could not star/unstar. Key [' + key + ']. Error: ' + err);
      return res.status(500).send({error: 'Could not star/unstar key: ' + key});
    }
    res.send({starred: star});
  });
}


var shop = function(req, res) {
  logger.info('recipeRoutes.shop');
  var key = parseInt(req.params.key)
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.addToShoppingList(key, function(err) {
    if(err) {
      return res.status(500).send({error: 'Could not update recipe'});
    }
    res.send({shop: true});
  });
};


var noShop = function(req, res) {
  logger.info('recipeRoutes.noShop');
  var key = parseInt(req.params.key)
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.removeFromShoppingList(key, function(err) {
    if(err) {
      return res.status(500).send({error: 'Could not update recipe'});
    }
    res.send({shop: false});
  });
};


var save = function(req, res) {
  logger.info('recipeRoutes.save -- to be implemented');
  res.send({saved: true});
};


module.exports = {
  index: index, 
  allRecipes: allData, 
  oneRecipe: oneData,
  star: starOne,
  unstar: unstarOne,
  shop: shop,
  noShop: noShop,
  edit: edit,
  save: save
}
