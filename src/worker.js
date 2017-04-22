import runTask from './cronTask';
import generator from './cronTasks/generator';
import config from './config';

const version = require('../package.json').version;
console.log(`Running worker version : ${version}.`);

// ==== Generator ====

runTask(generator, config.cron);
