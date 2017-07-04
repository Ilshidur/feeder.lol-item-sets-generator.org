import _ from 'lodash';
import api from '../riot_api';
import { outputLog } from '../log.js';
import config from '../config';

const PROD = config.env === 'production';

const getDatas = () => new Promise(async (resolve, reject) => {

  // Get the patch
  outputLog('[Riot] Retrieving patch ...');
  let riotPatch = 'nopatch';
  try {
    const patches = await api.Static.versions();
    riotPatch = _.first(patches);
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving patch : done ! (${riotPatch})`);

  // Get the champions
  outputLog('[Riot] Retrieving champions ...');
  let champions = [];
  try {
    const championsRqst = await api.Static.champions();
    champions = _(championsRqst.data)
      .mapValues(c => {
        return {
          id: c.id,
          key: c.key,
          name: c.name,
          importPatch: riotPatch,
          importDate: Date.now()
        };
      })
      .sortBy('name')
      .map((champion, index) => { return { ...champion, index: index }; })
      .value();
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving champions : done !`);

  // Get the items
  outputLog('[Riot] Retrieving items ...');
  let items = [];
  try {
    const itemsRqst = await api.Static.items();
    items = _(itemsRqst.data)
      .mapValues(i => {
        return {
          id: i.id,
          name: i.name,
          importPatch: riotPatch,
          importDate: Date.now()
        };
      })
      .sortBy('name')
      .map((i, index) => { return { ...i, index: index }; })
      .value();
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving items : done !`);

  const datas = {
    patch: riotPatch,
    champions: champions,
    items: items
  };

  resolve(datas);

});

export default getDatas;
