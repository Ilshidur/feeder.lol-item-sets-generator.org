import death from 'death';
import runTask from '../cronTask';
import generator from '../cronTasks/generator';
import { disconnectMongo } from '../db';
import queue from '../kue';

console.log('__ MANUAL GENERATION __');

const version = require('../../package.json').version;

console.log(`[GENERATOR] Generator version : ${version}.`);

// ==== Generator ====

const onDeath = death({ uncaughtException: true });
onDeath(async (/* signal, err */) => {
  console.log('Shutting down MongoDB connection ...');
  await disconnectMongo();
  console.log('Shuting down Kue ...');
  queue.shutdown(5000, (err) => {
    if (err) {
      console.log('Kue shutdown error : ', err);
    }
    console.log('Exiting ...');
    process.exit(0);
  });
});

runTask(generator, false);
