import _ from 'lodash';
import semverSort from 'semver-compare';
import { outputLog } from '../log';
import config from '../config';
import GG from '../packages/championgg-api-node';

if (!process.env.KEY_CHAMPIONGG) {
  console.log('No championgg key defined.');
  throw new Error('No championgg key defined.');
}

async function getPatch(apiKey) {
  const gg = GG.init(apiKey);

  const data = await gg.statistics.general({
    // elo: 'PLATINUM,DIAMOND,MASTER,CHALLENGER'
  });
  const patchList = _.map(data, 'patch').sort(semverSort).reverse();
  return patchList[0];
}

async function getChampionsRolesList(apiKey) {
  const gg = GG.init(apiKey);

  const data = await gg.champions.all({
    // elo: 'PLATINUM,DIAMOND,MASTER,CHALLENGER'
    champData: 'hashes',
    // Limiting to 1000 because the default value is 100
    limit: 1000,
  });

  return data;
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
  const champsSets = [];
  _.forEach(champRoles, (champRole) => {
    // TODO: Use champRole.hashes.evolveskillorder

    const rolesMapping = {
      TOP: 'Top',
      JUNGLE: 'Jungle',
      MIDDLE: 'Middle',
      DUO_CARRY: 'ADC',
      DUO_SUPPORT: 'Support',
    };

    // TODO: finalitemshashfixed is not defined for
    // champoin ID 1 (duo support)

    try {
      champsSets.push({
        champId: champRole.championId,
        role: rolesMapping[champRole.role],
        ...champRole.hashes.finalitemshashfixed && {
          items: {
            highestCount: champRole.hashes.finalitemshashfixed.highestCount ? {
              items: _(champRole.hashes.finalitemshashfixed.highestCount.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.finalitemshashfixed.highestCount.winrate * 100, 0),
              games: champRole.hashes.finalitemshashfixed.highestCount.count,
            } : {},
            highestWinrate: champRole.hashes.finalitemshashfixed.highestWinrate ? {
              items: _(champRole.hashes.finalitemshashfixed.highestWinrate.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.finalitemshashfixed.highestWinrate.winrate * 100),
              games: champRole.hashes.finalitemshashfixed.highestWinrate.count,
            } : {},
          },
        },
        ...champRole.hashes.firstitemshash && {
          firstItems: {
            highestCount: champRole.hashes.firstitemshash.highestCount ? {
              items: _(champRole.hashes.firstitemshash.highestCount.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.firstitemshash.highestCount.winrate * 100),
              games: champRole.hashes.firstitemshash.highestCount.count,
            } : {},
            highestWinrate: champRole.hashes.firstitemshash.highestWinrate ? {
              items: _(champRole.hashes.firstitemshash.highestWinrate.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.firstitemshash.highestWinrate.winrate * 100),
              games: champRole.hashes.firstitemshash.highestWinrate.count,
            } : {},
          },
        },
        ...champRole.hashes.skillorderhash && {
          skills: {
            highestCount: champRole.hashes.skillorderhash.highestCount ? {
              order: _(champRole.hashes.skillorderhash.highestCount.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.skillorderhash.highestCount.winrate * 100),
              games: champRole.hashes.skillorderhash.highestCount.count,
            } : {},
            highestWinrate: champRole.hashes.skillorderhash.highestWinrate ? {
              order: _(champRole.hashes.skillorderhash.highestWinrate.hash).split('-').tail().value(),
              winrate: _.round(champRole.hashes.skillorderhash.highestWinrate.winrate * 100),
              games: champRole.hashes.skillorderhash.highestWinrate.count,
            } : {},
          },
        },
        ...champRole.hashes.trinkethash && {
          trinkets: {
            highestCount: champRole.hashes.trinkethash.highestCount ? {
              item: _(champRole.hashes.trinkethash.highestCount.hash).split('-').value()[0],
              winrate: _.round(champRole.hashes.trinkethash.highestCount.winrate * 100),
              games: champRole.hashes.trinkethash.highestCount.count,
            } : {},
            highestWinrate: champRole.hashes.trinkethash.highestWinrate ? {
              item: _(champRole.hashes.trinkethash.highestWinrate.hash).split('-').value()[0],
              winrate: _.round(champRole.hashes.trinkethash.highestWinrate.winrate * 100),
              games: champRole.hashes.trinkethash.highestWinrate.count,
            } : {},
          },
        },
      });
    } catch (e) {
      reject(e);
    }
  });

  outputLog(`Got ${champRoles.length} item sets.`);

  const datas = {
    sets: champsSets,
    patch: patchVersion,
  };

  resolve(datas);
});

export default getDatas;
