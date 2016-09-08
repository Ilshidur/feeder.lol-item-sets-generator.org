import runGenerator from '../generator';
import config from '../config';
import { connectMongo, disconnectMongo } from '../db';

const cronTask = () => new Promise(async (resolve, reject) => {
  if (config.env === 'production') {
    console.log('Production mode.');
  } else {
    console.log('Dev mode.');
  }

  try {
    console.log('Init MongoDB ...');
    connectMongo();
    console.log('Init MongoDB : done !');
    await runGenerator();
    disconnectMongo();
    resolve();
  } catch (e) {
    reject(e);
    return;
  }

});

export default cronTask;
