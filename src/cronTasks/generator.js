import queue from '../kue';
import runGenerator from '../generator';
import * as statsd from '../statsd';
import config from '../config';
import { connectMongo } from '../db';
import lifecycle from '../lifecycle';

require('make-promises-safe');

const cronTask = () => {
  if (config.env === 'production') {
    console.log('Production mode.');
  } else {
    console.log('Dev mode.');
  }

  queue.watchStuckJobs(10000);

  queue.on('error', (err) => {
    console.error(err);
    throw err;
  });

  queue.process('generator', async (job, done) => {
    statsd.startGenerationTimer();

    console.log('Init MongoDB connection ...');
    try {
      await connectMongo();
    } catch (e) {
      done(e);
      console.error(e);
      return;
    }
    console.log('Init MongoDB connection : done !');

    try {
      await runGenerator();
    } catch (e) {
      console.error(e);
      done(e);
      return;
    }

    await lifecycle.shutdown();

    done();
  });

  const job = queue
    .create('generator')
    .ttl(1000 * 60 * 40) // 40 minutes timeout
    .removeOnComplete(true)
    .save((err) => {
      if (err) {
        console.error(`Job creation failed for ID ${job.id}`);
        throw err;
      } else {
        console.log('Job created.');
      }
    });

  job.on('complete', (/* result */) => {
    console.log(`Job completed. Removing job ${job.id} ...`);
    job.remove((err) => {
      if (err) {
        throw err;
      }
      console.log(`Removing job ${job.id} : done !`);
    });
  }).on('failed attempt', (/* errorMessage,  doneAttempts */) => {
    throw new Error('Job attempt failed.');
  }).on('failed', (/* errorMessage */) => {
    throw new Error('Job jailed.');
  });
};

export default cronTask;
