import { disconnectMongo } from './db';
import queue from './kue';
import * as statsd from './statsd';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function shutdown() {
  console.log('Shutting down MongoDB connection ...');
  await disconnectMongo();
  console.log('Shuting down Kue ...');

  queue.shutdown(5000, async (err) => {
    if (err) {
      console.log('Kue shutdown error : ', err);
    }
    statsd.stopGenerationTimer();
    statsd.registerGeneration();

    // Wait 2s for the client to send the datas.
    // That's because statsd UDP calls are asynchronous (fire-and-forget).
    await wait(2000);

    statsd.close();

    console.log('Exiting ...');
    process.exit(0);
  });
}

function init() {
  process.on('unhandledRejection', (reason /* , p */) => {
    throw reason;
  });
  process.on('uncaughtException', async (error) => {
    console.error(error);
    await shutdown();
  });

  process.on('exit', (code) => {
    // The exit event is fired when calling 'process.exit()'
    // or when the event loop no longer has any work to perform.
    // This should only perform synchronous actions :
    console.log('exiting with code %s ...', code);
  });
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log('shutdown message received, shutting down ...');
      shutdown();
    }
  });
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received, shutting down ...');
    shutdown();
  });
  process.on('SIGINT', () => {
    // Catching SIGINT signal for eventual PM2 graceful reloads.
    // Will save current workers and close all connections.
    console.log('SIGINT signal received, shutting down ...');
    shutdown();
  });
  process.on('SIGQUIT', () => {
    console.log('SIGQUIT signal received, shutting down ...');
    shutdown();
  });
}

export default { init, shutdown };
