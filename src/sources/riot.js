import _ from 'lodash';
import api from '../riotApi';
import * as statsd from '../statsd';
import { outputLog } from '../log';

if (!process.env.KEY_RIOT) {
  console.log('No riot key defined.');
  throw new Error('No riot key defined.');
}

const getDatas = () => new Promise(async (resolve, reject) => {
  const {
    n: {
      champion: championVersion,
      item: itemVersion,
    },
  } = await api.DDragon.Realm.list();

  // Get the patch
  outputLog('[Riot] Retrieving patch ...');
  let riotPatch = 'nopatch';
  try {
    const patches = await api.DDragon.Version.list();
    riotPatch = _.first(patches);
  } catch (e) {
    reject(e);
  }
  outputLog(`[Riot] Retrieving patch : done ! (${riotPatch})`);

  // Get the champions
  outputLog('[Riot] Retrieving champions ...');
  let champions = [];
  try {
    const championsRqst = await api.DDragon.Champion.list().version(championVersion);
    champions = _(championsRqst.data)
      .mapValues(c => ({
        id: Number(c.key), // key and id are reversed in the API
        key: c.id, // key and id are reversed in the API
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
  statsd.setRiotChampionsCount(champions.length);
  outputLog(`[Riot] Retrieving champions : done ! (${champions.length})`);

  // Get the items
  outputLog('[Riot] Retrieving items ...');
  let items = [];
  try {
    const itemsRqst = await api.DDragon.Item.list().version(itemVersion);
    items = _(itemsRqst.data)
      .keys()
      .map((itemId) => {
        const item = itemsRqst.data[itemId];
        return {
          id: itemId,
          name: item.name,
          importPatch: riotPatch,
          importDate: Date.now(),
        };
      })
      .sortBy('name')
      .map((i, index) => ({ ...i, index }))
      .value();
  } catch (e) {
    reject(e);
  }
  statsd.setRiotItemsCount(items.length);
  outputLog(`[Riot] Retrieving items : done ! (${items.length})`);

  const datas = {
    patch: riotPatch,
    champions,
    items,
  };

  resolve(datas);
});

export default getDatas;
