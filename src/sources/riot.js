import { Client } from 'node-rest-client';
import { promisifyNodeClient, link } from '../utils';
import { outputLog } from '../log.js';
import config from '../config';

const API_RIOT = 'global.api.pvp.net/api/lol';

const PROD = config.env === 'production' ? true : false;

const getDatas = () => new Promise(async (resolve, reject) => {

  if (!config.key.riot) {
    console.log('No riot key defined.');
    throw new Error('No riot key defined.');
  }

  if (!PROD) {
    outputLog('[Riot] Init REST client ...');
  }
  const client = new Client();
  try {
    client.on('error', (err) => {
      reject(err);
    });
    client.registerMethod('getPatch', link('https', API_RIOT, '/static-data/euw/v1.2/versions'), 'GET');
    // Promisify all the registered methods
    promisifyNodeClient(client);
  } catch (e) {
    reject(e);
  }
  if (!PROD) {
    outputLog('[Riot] Init REST client : done !');
  }

  // Get the patch
  outputLog('[Riot] Retrieving patch ...');
  let patch = 'nopatch';
  try {
    const patches = await client.methods.getPatchAsync({ parameters: { api_key: config.key.riot } });
    patch = patches[0];
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving patch : done ! (${patch})`);

  const datas = {
    patch: patch
  };

  resolve(datas);

});

export default getDatas;
