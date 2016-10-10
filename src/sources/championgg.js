import _ from 'lodash';
import { Client } from 'node-rest-client';
import { promisifyNodeClient, link } from '../utils';
import { outputLog } from '../log.js';
import config from '../config';

const API_CHAMPIONGG = 'api.champion.gg';

const PROD = config.env === 'production';

const getDatas = () => new Promise(async (resolve, reject) => {

  if (!config.key.championgg) {
    console.log('No championgg key defined.');
    throw new Error('No championgg key defined.');
  }

  if (!PROD) {
    outputLog('[ChampionGG] Init REST client ...');
  }
  // Init client and GET methods
  const client = new Client();
  client.on('error', (err) => {
    reject(err);
  });
  try {
    client.registerMethod('getPatch', link('http', API_CHAMPIONGG, '/stats/overall'), 'GET');
    client.registerMethod('getChampions', link('http', API_CHAMPIONGG, '/champion'), 'GET');
    client.registerMethod('getChampionDatas', link('http', API_CHAMPIONGG, '/champion/${name}'), 'GET');
    // Promisify all the registered methods
    promisifyNodeClient(client);
  } catch (e) {
    reject(e);
  }
  if (!PROD) {
    outputLog('[ChampionGG] Init REST client : done !');
  }

  // Get the patch version
  outputLog('[ChampionGG] Retrieving the patch version ...');
  let patchVersion;
  try {
    const patchVersionRequest = await client.methods.getPatchAsync({ parameters: { api_key: config.key.championgg } });
    if (patchVersionRequest.error) {
      throw new Error(patchVersionRequest.error);
    }
    patchVersion = patchVersionRequest.patch;
  } catch (e) {
    reject(e);
  }
  outputLog(`[ChampionGG] Retrieving the patch version : done ! (${patchVersion})`);

  // Get the champions
  outputLog('[ChampionGG] Retrieving the champions list ...');
  let champs;
  try {
    const champsSetsRequest = await client.methods.getChampionsAsync({ parameters: { api_key: config.key.championgg } });
    if (champsSetsRequest.error) {
      throw new Error(champsSetsRequest.error);
    }
    champs = champsSetsRequest;
  } catch (e) {
    reject(e);
  }
  outputLog('[ChampionGG] Retrieving the champions list : done !');

  champs = _.sortBy(champs, c => c.key);

  if (config.env === 'test') {
    champs = [champs[0]];
  }

  // Get the champions data
  outputLog('[ChampionGG] Retrieving the champions datas ...');
  let champsSets = [];
  for (let champ of champs) {
    let champData;
    try {
      if (!PROD) {
        outputLog(`[ChampionGG] Getting ${champ.key} ...`);
      }
      const champDataRequest = await client.methods.getChampionDatasAsync({ path: { name: champ.key }, parameters: { api_key: config.key.championgg } });
      if (champDataRequest.error) {
        throw new Error(`${champ.key} : ${champDataRequest.error}`);
      }
      champData = champDataRequest;
      for (let roleData of champData) {
        if (!PROD) {
          outputLog(`[ChampionGG] ${champ.key}/${roleData.role} : ok.`);
        }
        champsSets.push({
          key: champ.key,
          role: roleData.role,
          name: champ.name,
          items: roleData.items,
          firstItems: roleData.firstItems,
          skills: roleData.skills,
          trinkets: roleData.trinkets,
        });
      }
    } catch (e) {
      reject(e);
    }
  }
  outputLog('[ChampionGG] Retrieving the champions datas : done !');

  const datas = {
    sets: champsSets,
    patch: patchVersion
  };

  resolve(datas);

});

export default getDatas;
