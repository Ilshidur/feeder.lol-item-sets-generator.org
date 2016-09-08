import express from 'express';
import runTask from './cronTask';
import taskGenerator from './cronTasks/generator';
import config from './config';
import routes from './routes';

// ==== Server ====

const app = express();

app.use('/sprites', routes.sprites);
app.use('/tooltips', routes.tooltips);
app.use('/', routes.index);

app.listen(config.port, () => {
  console.log('[SERVER] Listening on port ' + config.port);
});

// ==== Generator ====

const version = require('../package.json').version;
console.log(`[GENERATOR] Generator version : ${version}.`);

runTask(taskGenerator, config.cron);
