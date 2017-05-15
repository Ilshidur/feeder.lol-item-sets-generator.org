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

  queue.process('generator', async function(job, done) {
    console.log('Init MongoDB ...');
    connectMongo();
    console.log('Init MongoDB : done !');

    try {
      await runGenerator();
    } catch (e) {
      done(e);
      console.error(e);
      return;
    } finally {
      console.log('Disconnecting MongoDB ...');
      disconnectMongo();
      console.log('Disconnecting MongoDB : done !');
    }

    done();
  });

  const job = queue
    .create('generator')
    .removeOnComplete(true).save(function(err) {
      if (err) {
        console.log(`Job creation failed for ID ${job.id}`);
        throw err;
      }
    });
};

export default cronTask;
