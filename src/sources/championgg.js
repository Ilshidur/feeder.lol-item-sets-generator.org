import _ from 'lodash';
import GG from '@solomid/node-gg';
import { outputLog } from '../log.js';
import config from '../config';

const PROD = config.env === 'production';

function getPatch(apiKey) {
  const gg = GG.init(apiKey);

  return new Promise((resolve, reject) => {
    gg.statistics.general({
      // elo: 'PLATINUM,DIAMOND,MASTER,CHALLENGER'
    }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data[0].patch);
      }
    });
  });
}

function getChampionsRolesList(apiKey) {
  const gg = GG.init(apiKey);

  return new Promise((resolve, reject) => {
    gg.champions.all({
      // elo: 'PLATINUM,DIAMOND,MASTER,CHALLENGER'
      champData: 'hashes'
    }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const getDatas = () => new Promise(async (resolve, reject) => {

  if (!config.key.championgg) {
    console.log('No championgg key defined.');
    throw new Error('No championgg key defined.');
  }

  // Get the patch version
  outputLog('[ChampionGG] Retrieving the patch version ...');
  const patchVersion = await getPatch(config.key.championgg);
  outputLog(`[ChampionGG] Retrieving the patch version : done ! (${patchVersion})`);

  // Get the champions
  outputLog('[ChampionGG] Retrieving the champions roles and item sets ...');
  let champRoles = await getChampionsRolesList(config.key.championgg);
  outputLog('[ChampionGG] Retrieving the champions roles and item sets : done !');

  if (config.env === 'test') {
    champRoles = [champRoles[0]];
  }

  // Extract the item sets
  let champsSets = [];
  for (let champRole of champRoles) {
    let champData;

    // TODO: Use champRole.hashes.evolveskillorder

    champsSets.push({
      champId: champRole.championId,
      role: champRole.role,
      items: {
        highestCount: {
          items: _(champRole.hashes.finalitemshashfixed.highestCount.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.finalitemshashfixed.highestCount.winrate * 100, 0),
          games: champRole.hashes.finalitemshashfixed.highestCount.count
        },
        highestWinrate: {
          items: _(champRole.hashes.finalitemshashfixed.highestWinrate.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.finalitemshashfixed.highestWinrate.winrate * 100),
          games: champRole.hashes.finalitemshashfixed.highestWinrate.count
        }
      },
      firstItems: {
        highestCount: {
          items: _(champRole.hashes.firstitemshash.highestCount.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.firstitemshash.highestCount.winrate * 100),
          games: champRole.hashes.firstitemshash.highestCount.count
        },
        highestWinrate: {
          items: _(champRole.hashes.firstitemshash.highestWinrate.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.firstitemshash.highestWinrate.winrate * 100),
          games: champRole.hashes.firstitemshash.highestWinrate.count
        }
      },
      skills: {
        highestCount: {
          order: _(champRole.hashes.skillorderhash.highestCount.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.skillorderhash.highestCount.winrate * 100),
          games: champRole.hashes.skillorderhash.highestCount.count
        },
        highestWinrate: {
          order: _(champRole.hashes.skillorderhash.highestWinrate.hash).split('-').tail().value(),
          winrate: _.round(champRole.hashes.skillorderhash.highestWinrate.winrate * 100),
          games: champRole.hashes.skillorderhash.highestWinrate.count
        }
      },
      trinkets: {
        highestCount: {
          item: _(champRole.hashes.trinkethash.highestCount.hash).split('-').value()[0],
          winrate: _.round(champRole.hashes.trinkethash.highestCount.winrate * 100),
          games: champRole.hashes.trinkethash.highestCount.count
        },
        highestWinrate: {
          item: _(champRole.hashes.trinkethash.highestWinrate.hash).split('-').value()[0],
          winrate: _.round(champRole.hashes.trinkethash.highestWinrate.winrate * 100),
          games: champRole.hashes.trinkethash.highestWinrate.count
        }
      }
    });
  }

  const datas = {
    sets: champsSets,
    patch: patchVersion
  };

  resolve(datas);

});

export default getDatas;
