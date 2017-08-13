import path from 'path';
import express from 'express';
import expressStatsd from 'express-statsd';
import config from './config';
import routes from './routes';
import { client } from './statsd';

const version = require('../package.json').version;

console.log(`Running app version : ${version}.`);

function statsd(scope) {
  return (req, res, next) => {
    const method = req.method || 'unknown_method';
    req.statsdKey = ['http', method.toLowerCase(), scope].join('.');
    next();
  };
}

// ==== Server ====

const app = express();

if (config.statsd.enabled) {
  app.use(expressStatsd({
    client,
  }));
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/sprites', statsd('sprites'), routes.sprites);
app.use('/tooltips', statsd('tooltips'), routes.tooltips);
app.use('/', statsd('home'), routes.index);

app.listen(config.port, () => {
  console.log(`[SERVER] Listening on port ${config.port}`);
});
