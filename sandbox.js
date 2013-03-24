var http = require('http');
var express = require('express');
var app = express();
var routes1 = require('./sandboxRoutes1');
var routes2 = require('./sandboxRoutes2');

app.get('/x', routes2.getSome);
app.get('*', routes1.getAll);

// Fire it up! 
var server = http.createServer(app);
var port = 3000;
server.listen(port, function() {
  var address = 'http://localhost:' + port;
  console.log('Express listening at: ' + address);
});