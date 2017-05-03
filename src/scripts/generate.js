import death from 'death';
import runTask from '../cronTask';
import generator from '../cronTasks/generator';
import queue from '../kue';

console.log('__ MANUAL GENERATION __');
const version = require('../../package.json').version;
console.log(`[GENERATOR] Generator version : ${version}.`);

const onDeath = death({ uncaughtException: true });
onDeath(function(signal, err) {
  queue.shutdown(5000, function(err) {
    if (err) {
      console.log('Kue shutdown error : ', err);
    }
    process.exit(0);
  });
});

runTask(generator, false);
