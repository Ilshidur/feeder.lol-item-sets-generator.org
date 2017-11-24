import runTask from './cronTask';
import generator from './cronTasks/generator';
import lifecycle from './lifecycle';
import config from './config';

console.log('__ AUTOMATED GENERATION __');

const { version } = require('../package.json');

console.log(`Running worker version : ${version}.`);

// ==== Generator ====

lifecycle.init();

runTask(generator, config.cron);
