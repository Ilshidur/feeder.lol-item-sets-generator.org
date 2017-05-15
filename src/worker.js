import death from 'death';
import runTask from './cronTask';
import generator from './cronTasks/generator';
import { disconnectMongo } from '../db';
import queue from './kue';

console.log('__ AUTOMATED GENERATION __');
const version = require('../package.json').version;
console.log(`Running worker version : ${version}.`);

// ==== Generator ====

const onDeath = death({ uncaughtException: true });
onDeath(function(signal, err) {
  console.log('Shutting down Mongoose ...');
  disconnectMongo();
  console.log('Shuting down Kue ...');
  queue.shutdown(5000, function(err) {
    if (err) {
      console.log('Kue shutdown error : ', err);
    }
    process.exit(0);
  });
});

runTask(generator, config.cron);
