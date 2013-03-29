var db = require('./dbRecipes');
var util = require('./recipeUtil');
var Encoder = require('node-html-encoder').Encoder;
var dbUrl = null;


var encodeText = function(encoder, text) {
  if (text === undefined) {
    return '';
  }
  text = encoder.htmlEncode(text);
  text = text.replace(/&#13;&#10;/g, '<br/>');
  text = text.replace(/&#13;/g,'<br/>');
  text = text.replace(/&#10;/g,'<br/>');
  return text;
};


var decodeText = function(encoder, text) {
  if (text === undefined) {
    return '';
  }  
  text = encoder.htmlDecode(text);
  text = text.replace(/<br\/>/g, '\r\n')
  return text;
};


var prepareForSave = function(data) {
  // encode data first
  var encoder = new Encoder('entity');
  data.name = encodeText(encoder, data.name);
  data.ingredients = encodeText(encoder, data.ingredients);
  data.directions = encodeText(encoder, data.directions);
  data.notes = encodeText(encoder, data.notes);
  
  // calculate a few fields
  data.url = util.getUrlFromName(data.name);
  data.sortName = data.name.toLowerCase();

  data.isStarred = data.isStarred === 1 ? 1 : 0;
  return data;
};


var decodeForEdit = function(data) {
  var encoder = new Encoder('entity');
  data.ingredients = decodeText(encoder, data.ingredients);
  data.directions = decodeText(encoder, data.directions);
  data.notes = decodeText(encoder, data.notes);
  return data;
};


var getAll = function(cb) {

  db.setup(dbUrl);
  db.fetchAll(function(err, documents) {
    cb(err, documents);
  });

};


var getOne = function(key, decode, cb) {

  db.setup(dbUrl);
  db.fetchOne(key, function(err, document) {
    if(decode) 
      document = decodeForEdit(document);
    // console.log(document);
    cb(err, document);
  });

};


var addNew = function(cb) {

  db.setup(dbUrl);
  db.getNewId(function(err, id) {

    if(err) return cb(err);
    
    var data = {
      key: id,
      name: 'New recipe',
      ingredients: '',
      directions: '',
      notes: ''
    };
    data = prepareForSave(data);

    db.addOne(data, function(err, savedDoc) {
      cb(err, savedDoc);
    });

  });

};


var updateOne = function(data, cb) {

  db.setup(dbUrl);
  data = prepareForSave(data);
  db.updateOne(data, function(err, savedDoc) {
    if (err) return cb(err);
    cb(null, savedDoc);
  });

};


var starOne = function(key, starred, cb) {

  db.setup(dbUrl);
  db.starOne(key, starred, function(err, savedDoc) {
    if (err) return cb(err);
    cb(null, savedDoc);
  });

};


var publicApi = {
  getAll: getAll,
  getOne: getOne,
  addNew: addNew,
  updateOne: updateOne,
  starOne: starOne
};


module.exports.recipes = function(dbConnString) {
  dbUrl = dbConnString;
  return publicApi;
};

