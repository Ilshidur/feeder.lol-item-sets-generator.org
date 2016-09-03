var sprites = require('./sprites');
var tooltips = require('./tooltips');

var index = function (req, res, next) {
  res.send('What the hell are you doing here ?');
};

var routes = {
  index: index,
  sprites: sprites,
  tooltips: tooltips
};

module.exports = routes;
