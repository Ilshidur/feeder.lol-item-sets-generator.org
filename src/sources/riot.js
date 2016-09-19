import _ from 'lodash';
import { Client } from 'node-rest-client';
import { promisifyNodeClient, link } from '../utils';
import { outputLog } from '../log.js';
import config from '../config';

const API_RIOT = 'global.api.pvp.net/api/lol';

const PROD = config.env === 'production';

const getDatas = () => new Promise(async (resolve, reject) => {

  if (!config.key.riot) {
    console.log('No riot key defined.');
    throw new Error('No riot key defined.');
  }

  if (!PROD) {
    outputLog('[Riot] Init REST client ...');
  }
  const client = new Client();
  client.on('error', (err) => {
    reject(err);
  });
  try {
    client.registerMethod('getPatch', link('https', API_RIOT, '/static-data/euw/v1.2/versions'), 'GET');
    client.registerMethod('getChampions', link('https', API_RIOT, '/static-data/euw/v1.2/champion'), 'GET');
    client.registerMethod('getItems', link('https', API_RIOT, '/static-data/euw/v1.2/item'), 'GET');
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

  // Get the champions
  outputLog('[Riot] Retrieving champions ...');
  let champions = [];
  try {
    const championsRqst = await client.methods.getChampionsAsync({ parameters: { api_key: config.key.riot } });
    // TODO: Use the lodash chaining system
    champions = _.mapValues(championsRqst.data, c => {
      return {
        id: c.id,
        key: c.key,
        name: c.name,
        importPatch: patch,
        importDate: Date.now()
      };
    });
    champions = _.sortBy(champions, 'name');
    champions = _.map(champions, (c, index) => { return { ...c, index: index }; });
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving champions : done !`);

  // Get the items
  outputLog('[Riot] Retrieving items ...');
  let items = [];
  try {
    const itemsRqst = await client.methods.getItemsAsync({ parameters: { api_key: config.key.riot } });
    // TODO: Use the lodash chaining system
    items = _.mapValues(itemsRqst.data, i => {
      return {
        id: i.id,
        name: i.name,
        importPatch: patch,
        importDate: Date.now()
      };
    });
    items = _.sortBy(items, 'name');
    items = _.map(items, (i, index) => { return { ...i, index: index }; });
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving items : done !`);

  const datas = {
    patch: patch,
    champions: champions,
    items: items
  };

  resolve(datas);

});

export default getDatas;
