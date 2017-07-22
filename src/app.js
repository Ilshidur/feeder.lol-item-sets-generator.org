import path from 'path';
import express from 'express';
import config from './config';
import routes from './routes';

const version = require('../package.json').version;

console.log(`Running app version : ${version}.`);

// ==== Server ====

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/sprites', routes.sprites);
app.use('/tooltips', routes.tooltips);
app.use('/', routes.index);

app.listen(config.port, () => {
  console.log(`[SERVER] Listening on port ${config.port}`);
});
