import kue from 'kue';
import queue from '../kue';
import runGenerator from '../generator';
import config from '../config';
import { connectMongo, disconnectMongo } from '../db';

const cronTask = () => {
  if (config.env === 'production') {
    console.log('Production mode.');
  } else {
    console.log('Dev mode.');
  }

  queue.watchStuckJobs(10000);

  queue.on('error', function(err) {
    console.error(err);
    throw err;
  });

  queue.process('generator', async function(job, done) {
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
    } finally {
      console.log('Shutting down MongoDB connection ...');
      await disconnectMongo();
      console.log('Shutting down MongoDB connection : done !');
    }

    done();
  });

  const job = queue
    .create('generator')
    .ttl(1000 * 60 * 30) // 30 minutes timeout
    .removeOnComplete(true)
    .save(function(err) {
      if (err) {
        console.error(`Job creation failed for ID ${job.id}`);
        throw err;
      } else {
        console.log('Job created.');
      }
    });

  job.on('complete', function(result) {
    console.log(`Job completed. Removing job ${job.id} ...`);
    job.remove(function(err){
      if (err) {
        throw err;
      }
      console.log(`Removing job ${job.id} : done !`);
    });
  }).on('failed attempt', function(errorMessage, doneAttempts) {
    throw new Error('Job attempt failed.');
  }).on('failed', function(errorMessage) {
    throw new Error('Job jailed.');
  });
};

export default cronTask;
