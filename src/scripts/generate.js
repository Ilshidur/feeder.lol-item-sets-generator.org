import runTask from '../cronTask';
import generator from '../cronTasks/generator';
import lifecycle from '../lifecycle';

console.log('__ MANUAL GENERATION __');

const { version } = require('../../package.json');

console.log(`[GENERATOR] Generator version : ${version}.`);

// ==== Generator ====

lifecycle.init();

runTask(generator, false);
