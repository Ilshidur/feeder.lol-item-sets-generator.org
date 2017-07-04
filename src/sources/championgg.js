import _ from 'lodash';
import GG from '@solomid/node-gg';
import semverSort from 'semver-compare';
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
        const patchList = _.map(data, 'patch').sort(semverSort).reverse();
        resolve(patchList[0]);
      }
    });
  });
}

function getChampionsRolesList(apiKey) {
  const gg = GG.init(apiKey);

  return new Promise((resolve, reject) => {
    gg.champions.all({
      // elo: 'PLATINUM,DIAMOND,MASTER,CHALLENGER'
      champData: 'hashes',
      limit: 1000
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

    const rolesMapping = {
      'TOP': 'Top',
      'JUNGLE': 'Jungle',
      'MIDDLE': 'Middle',
      'DUO_CARRY': 'ADC',
      'DUO_SUPPORT': 'Support'
    };

    // TODO: finalitemshashfixed is not defined for
    // champoin ID 1 (duo support)

    try {
      champsSets.push({
        champId: champRole.championId,
        role: rolesMapping[champRole.role],
        ...champRole.hashes.finalitemshashfixed && {
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
          }
        },
        ...champRole.hashes.firstitemshash && {
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
          }
        },
        ...champRole.hashes.skillorderhash && {
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
          }
        },
        ...champRole.hashes.trinkethash && {
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
        }
      });
    } catch (e) {
      reject(e);
    }
  }

  outputLog(`Got ${champRoles.length} item sets.`);

  const datas = {
    sets: champsSets,
    patch: patchVersion
  };

  resolve(datas);

});

export default getDatas;
