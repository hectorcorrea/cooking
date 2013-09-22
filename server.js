var express = require('express');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var http = require('http');
var logger = require('log-hanging-fruit').defaultLogger;
var settingsUtil = require('./settings');
var recipeRoutes = require('./routes/recipeRoutes');
var logRoutes = require('./routes/logRoutes');
var dbSetup = require('./models/dbSetup');

// Set the path for the log files 
var options = {filePath: path.join(__dirname, 'logs') };
logger.setup(options);

// Configuration
var app = express();
app.configure(function() {

  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));

  app.set('view engine', 'ejs');

  //app.use(express.favicon());

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  // static must appear before app.router!
  app.use(express.static(path.join(__dirname, 'public'))); 
  app.use(express.logger('dev'));
  // app.use(express.logger({format: 'short', stream: logFile}));
  app.use(app.router);

  // Global error handler
  app.use( function(err, req, res, next) {
    logger.error("Global error handler. Error: " + err);
    res.status(500);
    res.render('500', {message: err});
  });

}); 


// Development settings
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var settingsFile = __dirname + "/settings.dev.json";
  logger.info('Loading settings from ' + settingsFile);
  var settings = settingsUtil.load(settingsFile);
  dbSetup.init(settings.dbUrl);
  app.set("config", settingsUtil.load(settingsFile));
}); 


// Production settings
app.configure('production', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var settingsFile = __dirname + "/settings.prod.json";
  logger.info('Loading settings from ' + settingsFile);
  var settings = settingsUtil.load(settingsFile);
  if(process.env.DB_URL) {
    settings.dbUrl = process.env.DB_URL;
    dbSetup.init(settings.dbUrl);
  }
  else {
    logger.error("This is not good. No DB_URL environment variable was found.");
  }
  app.set("config", settings);
});


// These routes return JSON
// Should they be /api/recipes/whatever to be
// significantly different from the client routes
// /#recipes/whatever ? 
app.get('/recipes/all', recipeRoutes.allRecipes);
app.get('/recipes/favorites', recipeRoutes.favorites);
app.get('/recipes/shopping', recipeRoutes.shopping);
app.get('/recipes/search', recipeRoutes.search);
//app.get('/recipes/touchAll', recipeRoutes.touchAll);

app.post('/recipes/:url/:key', recipeRoutes.save);
app.post('/recipes/new', recipeRoutes.addNew);
app.post('/recipes/:url/:key/star', recipeRoutes.star);
app.post('/recipes/:url/:key/unstar', recipeRoutes.unstar);
app.post('/recipes/:url/:key/shop', recipeRoutes.shop);
app.post('/recipes/:url/:key/noShop', recipeRoutes.noShop);

// These two routes are identical except that for 
// "edit" we decode "<br>"" into "\r\n"
// Ideally they should not be two different routes.
// What would be better way of handling it? Use a "decode" 
// option in the query string? Not handle it on the server
// and leave it to the client?
// app.get('/recipes/:url/:key/edit', recipeRoutes.edit);
app.get('/recipes/:url/:key', recipeRoutes.view);

// These routes return HTML (to be changed)
app.get('/log/current', logRoutes.current);
app.get('/log/:date', logRoutes.byDate);

// Our humble home page (HTML)
app.get('/', function(req, res) {
  logger.info('recipeRoutes.index');
  res.render('index')
});

app.get('*', function(req, res) {
  logger.error('Not found: ' + req.url);
  res.status(404).render('index.ejs', { error: 'Page not found' });
});


// Fire up the web server! 
var server = http.createServer(app);
var port = app.get('port');
server.listen(port, function() {
  var address = 'http://localhost:' + port;
  logger.info('Express listening at: ' + address);
});
