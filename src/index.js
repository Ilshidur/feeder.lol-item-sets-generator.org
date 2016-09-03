var express = require('express');
var config = require('./config');
var routes = require('./routes');

var app = express();

app.use('/', routes.index);
app.use('/sprites', routes.sprites);
app.use('/tooltips', routes.tooltips);

app.listen(config.port, function () {
  console.log('Listening on port ' + config.port);
});
