import _ from 'lodash';
import { Client } from 'node-rest-client';
import { promisifyNodeClient, link } from '../utils';
import { outputLog } from '../log.js';
import config from '../config';

const API_CHAMPIONGG = 'api.champion.gg';

const PROD = config.env === 'production' ? true : false;

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
  try {
    client.on('error', (err) => {
      reject(err);
    });
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

  // Get the champions
  outputLog('[ChampionGG] Retrieving the champions list ...');
  let champs;
  try {
    champs = await client.methods.getChampionsAsync({ parameters: { api_key: config.key.championgg } });
    if (champs.error) {
      throw new Error(champs.error);
    }
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
      champData = await client.methods.getChampionDatasAsync({ path: { name: champ.key }, parameters: { api_key: config.key.championgg } });
      if (champData.error) {
        throw new Error(`${champ.key} : ${champData.error}`);
      }
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
    sets: champsSets
  };

  resolve(datas);

});

export default getDatas;
