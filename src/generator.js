// import 'babel-polyfill';

import _ from 'lodash';
import path from 'path';
import del from 'delete';
import { Generator as SpriteGenerator } from 'league-sprites';
import { saveFile, zipItems } from './utils';
import { outputLog } from './log';
import * as statsd from './statsd';
import { findAndUpdateMongoDocument, saveMongoDocument } from './db';
import ItemSetDocument from './models/item_set';
import ChampionDocument from './models/champion';
import ItemDocument from './models/item';
import PatchVersionDocument from './models/patch_version';
import config from './config';

const PROD = config.env === 'production';

const DATA_GETTERS = {
  /* eslint-disable global-require */
  riot: require('./sources/riot.js').default,
  championgg: require('./sources/championgg.js').default,
  probuilds: require('./sources/probuilds.js').default,
  /* eslint-enable global-require */
};
const getDatas = source => DATA_GETTERS[source];

const formatSkills = (skills) => {
  let skillStr = '';
  const ults = [6, 12, 16];
  _.forEach(ults, (ult, ultIndex) => {
    // 0 => slice 0 to 6
    // 1 => slice 7 to 12
    // 2 => slice 13 to 16
    const group = _.slice(skills, ults[ultIndex - 1] || 0, ults[ultIndex]);
    const skill = _.chain(group)
      .countBy()
      .toPairs()
      .sortBy(1)
      .reverse()
      .map(0)
      .value()[0];
    skillStr += skill;
    if (ultIndex < ults.length - 1) {
      skillStr += ' > ';
    }
  });
  return skillStr;
};
const formatItemsFromId = items => items.map(i => ({
  count: 1,
  id: i,
}));

const run = () => new Promise(async (resolve, reject) => {
  // eslint-disable-next-line global-require
  const { version } = require('../package.json');
  console.log(`Version : ${version}.`);

  // == REQUESTS : Start.

  const datas = {};
  const sources = Object.keys(DATA_GETTERS);
  // eslint-disable-next-line no-restricted-syntax
  for (const source of sources) {
    outputLog(`Getting ${source} datas ...`);
    try {
      const getDatasPromise = getDatas(source);
      // eslint-disable-next-line no-await-in-loop
      datas[source] = await getDatasPromise();
    } catch (e) {
      reject(e);
      return;
    }
    outputLog(`Getting ${source} datas : done !`);
  }

  // == REQUESTS : Done.

  if (!PROD) {
    outputLog('Deleting last tmp folder ...');
  }
  try {
    del.sync(path.join(config.path.sets.outputFolder, config.path.sets.saveFolderTmp));
  } catch (e) {
    reject(e);
    return;
  }
  if (!PROD) {
    outputLog('Deleting last tmp folder : done !');
  }

  const riotPatch = datas.riot.patch;
  const championGGPatch = datas.championgg.patch;
  // Only save the datas in the database if the Riot patch and the ChampionGG patch are equal
  // It prevents datas conflicts
  if (riotPatch.startsWith(championGGPatch)) {
    if (!PROD) {
      outputLog('Riot patch equals ChampionGG patch !');
    }
    // Saving the champions, items and patch version in the database
    const { champions } = datas.riot;
    if (!PROD) {
      outputLog('Saving the champions in the database ...');
    }
    await Promise.all(_.map(champions, async (champion) => {
      try {
        await findAndUpdateMongoDocument(ChampionDocument, { id: champion.id }, champion);
      } catch (e) {
        reject(e);
        return false; // break; equivalent for lodash
      }
      return true; // Just because the iteration needs a return
    }));
    if (!PROD) {
      outputLog('Saving the champions in the database : done !');
    }
    const { items } = datas.riot;
    if (!PROD) {
      outputLog('Saving the items in the database ...');
    }
    await Promise.all(_.map(items, async (item) => {
      try {
        await findAndUpdateMongoDocument(ItemDocument, { id: item.id }, item);
      } catch (e) {
        reject(e);
        return false; // break; equivalent for lodash
      }
      return true; // Just because the iteration needs a return
    }));
    if (!PROD) {
      outputLog('Saving the items in the database : done !');
    }
    if (!PROD) {
      outputLog('Saving the patch version in the database ...');
    }
    try {
      const patchVersionDoc = {
        patchVersion: riotPatch,
        importDate: Date.now(),
      };
      await findAndUpdateMongoDocument(PatchVersionDocument, {
        patchVersion: riotPatch,
      }, patchVersionDoc);
    } catch (e) {
      reject(e);
      return;
    }
    if (!PROD) {
      outputLog('Saving the patch version in the database : done !');
    }
  } else if (!PROD) {
    outputLog(`Riot patch : ${riotPatch}, ChampionGG patch ; ${championGGPatch} : not saving the champions/items`);
  }

  // Temp list of SetSchema (./models/item_sets.js)
  let itemSetsList = [];

  const sets = datas.championgg.sets.map((champData) => {
    const champion = _(datas.riot.champions).find(champ => champ.id === champData.champId);
    if (!champion) {
      console.error(`champion not found, id : ${champData.champId}`);
    }
    const newChampData = champData;
    newChampData.champion = champion;
    return newChampData;
  });

  const sortedSets = _.sortBy(sets, 'champion.key');

  // Saving item sets
  outputLog('Generating and saving the sets ...');
  let championIndex = 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const champData of sortedSets) {
    if (!PROD) {
      outputLog(`Generating ${champData.champion.key}/${champData.role} (${championIndex}/${sortedSets.length}) ...`);
    }
    const trinketItems = [
      '3340', // Warding Totem
      '3341', // Sweeping Lens
      '3363', // Farsight Alteration
    ];
    const consumeItems = [
      '2003', // Health Potion
      '2055', // Control Ward
      '2031', // Refillable Potion
      '2032', // Hunter's Potion
      '2033', // Corrupting Potion
      '2138', // Elixir of Iron
      '2139', // Elixir of Sorcery
      '2140', // Elixir of Wrath
    ];
    /* eslint-disable max-len */
    try {
      // eslint-disable-next-line prefer-template
      let skills = formatSkills(champData.skills.highestCount.order) + ` (${champData.skills.highestCount.winrate}% win - ${champData.skills.highestCount.games} games)`;
      if (formatSkills(champData.skills.highestCount.order) !== formatSkills(champData.skills.highestWinrate.order)) {
        // eslint-disable-next-line prefer-template
        skills += ' - ' + formatSkills(champData.skills.highestWinrate.order) + ` (${champData.skills.highestWinrate.winrate}% win - ${champData.skills.highestWinrate.games} games)`;
      }
      const fileData = {
        title: `${riotPatch} ${champData.role} (LISG)`,
        champion: champData.champion.key,
        role: champData.role,
        blocks: [{
          items: champData.firstItems ? formatItemsFromId([...champData.firstItems.highestCount.items.map(i => i.toString()), ...trinketItems]) : formatItemsFromId(trinketItems),
          type: champData.firstItems ? `Most frequent starters (${champData.firstItems.highestCount.winrate}% win - ${champData.firstItems.highestCount.games} games)` : 'Most frequent starters not found',
        }, {
          items: champData.firstItems ? formatItemsFromId([...champData.firstItems.highestWinrate.items.map(i => i.toString()), ...trinketItems]) : formatItemsFromId(trinketItems),
          type: champData.firstItems ? `Highest win rate starters (${champData.firstItems.highestWinrate.winrate}% win - ${champData.firstItems.highestWinrate.games} games)` : 'Highest win rate starters not found',
        }, {
          items: champData.items ? formatItemsFromId(champData.items.highestCount.items.map(i => i.toString())) : formatItemsFromId(trinketItems),
          type: champData.items ? `Most frequent build (${champData.items.highestCount.winrate}% win - ${champData.items.highestCount.games} games)` : 'Most frequent build not found',
        }, {
          items: champData.items ? formatItemsFromId(champData.items.highestWinrate.items.map(i => i.toString())) : formatItemsFromId(trinketItems),
          type: champData.items ? `Highest win rate build (${champData.items.highestWinrate.winrate}% win - ${champData.items.highestWinrate.games} games)` : 'Highest win rate build not found',
        }, {
          items: champData.trinkets ? formatItemsFromId([champData.trinkets.highestCount.item, ..._.without(trinketItems, champData.trinkets.highestCount.item), ...consumeItems]) : formatItemsFromId(consumeItems),
          // eslint-disable-next-line prefer-template
          type: champData.trinkets ? 'Consumables | ' + _.find(datas.riot.items, item => Number(item.id) === Number(champData.trinkets.highestCount.item)).name + ' : ' + champData.trinkets.highestCount.winrate + '% win - ' + champData.trinkets.highestCount.games + ' games' : 'Trinkets not found',
        }, {
          // TODO: Combine the items appearing twice or thrice in a row
          items: (datas.probuilds) ? formatItemsFromId(_.without(_.dropWhile(datas.probuilds.builds[champData.champion.key].build, item => item), undefined)) : formatItemsFromId(consumeItems),
          type: (datas.probuilds) ? `ProBuilds build order | ${skills}` : `ProBuilds items unavailable | ${skills}`,
        }],
      };
      const fileContent = {
        title: fileData.title,
        type: 'custom',
        map: 'any',
        mode: 'any',
        priority: false,
        sortrank: 1,
        champion: fileData.champion,
        blocks: fileData.blocks,
      };
      // eslint-disable-next-line no-await-in-loop
      await saveFile(path.join(config.path.sets.saveFolderTmp, config.path.sets.saveFolder, champData.champion.key, 'Recommended', `${riotPatch} ${champData.role}.json`), JSON.stringify(fileContent, null, '  '));
      itemSetsList.push({
        title: fileData.title,
        champion: fileData.champion,
        role: fileData.role,
        isCustom: false,
        author: null,
        itemBlocks: fileData.blocks,
      });
    } catch (e) {
      reject(e);
      return;
    }
    /* eslint-enable max-len */
    if (!PROD) {
      outputLog(`Generating ${champData.champion.key}/${champData.role} (${championIndex}/${sortedSets.length}): done !`);
    }
    championIndex += 1;
  }
  statsd.setGeneratedBuildsCount(sortedSets.length);
  outputLog(`Generating and saving the sets : done ! (total: ${sortedSets.length})`);

  itemSetsList = _.sortBy(itemSetsList, itemSet => itemSet.champion);

  if (!PROD) {
    outputLog('Saving the sets in the database ...');
  }
  const itemSet = new ItemSetDocument({
    generationDate: Date.now(),
    patchVersion: riotPatch,
    sets: itemSetsList,
  });
  await saveMongoDocument(itemSet);
  if (!PROD) {
    outputLog('Saving the sets in the database : done !');
  }

  outputLog('Saving the sets : done !');

  outputLog('Zipping the sets ...');
  try {
    await zipItems();
  } catch (e) {
    reject(e);
    return;
  }
  outputLog('Zipping the sets : done !');

  if (config.generateSprites) {
    outputLog('Generating the sprites ...');

    const sprites = ['champions', 'items'];

    // eslint-disable-next-line no-restricted-syntax
    for (const spriteType of sprites) {
      let dataType = '';
      switch (spriteType) {
        case 'champions':
          dataType = 'ChampionIcon';
          break;
        case 'items':
          dataType = 'ItemIcon';
          break;
        default:
          reject(new Error(`Unknown sprite type : ${spriteType}`));
          return;
      }
      const generatorOpts = {
        dataType,
        apiKey: config.key.riot,
        region: 'euw',
        patch: riotPatch,
        stylesheetFormat: 'css',
        stylesheetLayout: 'horizontal',
        downloadFolder: path.join(
          config.path.sprites.outputFolder,
          config.path.sprites.downloadFolder,
        ),
        spritePath: path.join(
          config.path.sprites.outputFolder,
          config.path.sprites.spritesheetFolderTmp,
          config.path.sprites.spritesheetName[spriteType],
        ),
        spriteLink: config.path.sprites.spritesheetLink[spriteType],
        stylesheetPath: path.join(
          config.path.sprites.outputFolder,
          config.path.sprites.spritesheetFolder,
          config.path.sprites.stylesheetName[spriteType],
        ),
        finalSpritesheetFolder: path.join(
          config.path.sprites.outputFolder,
          config.path.sprites.spritesheetFolder,
        ),
      };

      try {
        outputLog(`Generating the ${dataType} sprites ...`);
        const spritesGenerator = new SpriteGenerator(generatorOpts);
        // eslint-disable-next-line no-await-in-loop
        await spritesGenerator.generate();
        outputLog(`Generating the ${dataType} sprites : done !`);
      } catch (e) {
        reject(e);
        return;
      }
    }

    outputLog('Generation : done !');
  } else {
    outputLog('Not generating the sprites.');
  }

  resolve();
});

export default run;
