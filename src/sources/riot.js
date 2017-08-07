import _ from 'lodash';
import api from '../riot_api';
import * as statsd from '../statsd';
import { outputLog } from '../log';

if (!process.env.KEY_RIOT) {
  console.log('No riot key defined.');
  throw new Error('No riot key defined.');
}

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
      .mapValues(c => ({
        id: c.id,
        key: c.key,
        name: c.name,
        importPatch: riotPatch,
        importDate: Date.now(),
      }))
      .sortBy('name')
      .map((champion, index) => ({ ...champion, index }))
      .value();
  } catch (e) {
    reject(e);
  }
  statsd.setChampionsCount(champions.length);
  outputLog(`[Riot] Retrieving champions : done ! (${champions.length})`);

  // Get the items
  outputLog('[Riot] Retrieving items ...');
  let items = [];
  try {
    const itemsRqst = await api.Static.items();
    items = _(itemsRqst.data)
      .mapValues(i => ({
        id: i.id,
        name: i.name,
        importPatch: riotPatch,
        importDate: Date.now(),
      }))
      .sortBy('name')
      .map((i, index) => ({ ...i, index }))
      .value();
  } catch (e) {
    reject(e);
  }
  statsd.setItemsCount(items.length);
  outputLog(`[Riot] Retrieving items : done ! (${items.length})`);

  const datas = {
    patch: riotPatch,
    champions,
    items,
  };

  resolve(datas);
});

export default getDatas;
