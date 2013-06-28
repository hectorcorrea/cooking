var express = require('express');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var http = require('http');
var logger = require('log-hanging-fruit').defaultLogger;
var settingsUtil = require('./settings');
var recipeRoutes = require('./routes/recipeRoutes');
var siteRoutes = require('./routes/siteRoutes');
var logRoutes = require('./routes/logRoutes');

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
    console.log("Global error handler. Error: " + err);
    res.status(500);
    res.render('500', {message: err});
  });

}); 


// Development settings
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var settingsFile = __dirname + "/settings.dev.json";
  console.log('Loading settings from ' + settingsFile);
  app.set("config", settingsUtil.load(settingsFile));
}); 


// Production settings
app.configure('production', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var settingsFile = __dirname + "/settings.prod.json";
  console.log('Loading settings from ' + settingsFile);
  var settings = settingsUtil.load(settingsFile);
  if(process.env.DB_URL) {
    settings.dbUrl = process.env.DB_URL;
  }
  else {
    console.log("This is not good. No DB_URL environment variable was found.");
  }
  app.set("config", settings);
});


// Routes
app.post('/recipe/new', recipeRoutes.addNew);

app.get('/recipe/:url/:key/edit', recipeRoutes.edit);
app.post('/recipe/save/:key', recipeRoutes.save);

app.get('/recipe/:url/:key/star', recipeRoutes.star);
app.get('/recipe/:url/:key/unstar', recipeRoutes.unstar);

app.get('/recipe/:url/:key/shop', recipeRoutes.shop);
app.get('/recipe/:url/:key/noshop', recipeRoutes.noShop);

app.get('/recipe/favorites', recipeRoutes.viewFavorites);
app.get('/recipe/shopping', recipeRoutes.viewShopping);
app.get('/recipe/list', recipeRoutes.viewAll);
app.get('/recipe', recipeRoutes.viewAll);
app.get('/recipe/:url/:key', recipeRoutes.viewOne);

app.get('/log/current', logRoutes.current);
app.get('/log/:date', logRoutes.byDate);

app.get('/search', siteRoutes.search);
app.get('/credits', siteRoutes.credits);

app.get('/', recipeRoutes.viewAll);

app.get('*', siteRoutes.notFound);


// Fire it up! 
var server = http.createServer(app);
var port = app.get('port');
server.listen(port, function() {
  var address = 'http://localhost:' + port;
  logger.info('Express listening at: ' + address);
});
