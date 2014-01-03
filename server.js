var path = require('path');
var http = require('http');
var logger = require('log-hanging-fruit').defaultLogger;
var recipeRoutes = require('./routes/recipeRoutes');
var logRoutes = require('./routes/logRoutes');

// Set the path for the log files 
var options = {filePath: path.join(__dirname, 'logs') };
logger.setup(options);

// Configure Express settings
var app = require('./configure').app;

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

app.get('/recipes/:url/:key', recipeRoutes.view);

// These routes return HTML (to be changed)
app.get('/log/current', logRoutes.current);
app.get('/log/:date', logRoutes.byDate);

// Our humble home page (HTML)
app.get('/', function(req, res) {
  logger.info('home page for ' + req.url);
  
  // Temporary code while we migrate out of Azure.
  var host = req.headers.host || "";
  var isAzure = host.toLowerCase().indexOf("azure") >= 0;
  if(isAzure) {
    return res.render('legacy'); 
  }

  res.render('index');
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
