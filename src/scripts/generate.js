import runTask from '../cronTask';
import taskGenerator from '../cronTasks/generator';

console.log('__ MANUAL GENERATION __');
const version = require('../../package.json').version;
console.log(`[GENERATOR] Generator version : ${version}.`);

runTask(taskGenerator, false);
