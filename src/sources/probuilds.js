import Xray from 'x-ray';
import phantom from 'x-ray-phantom';
import { outputLog } from '../log';
import config from '../config';

const PROD = config.env === 'production';

const getChampions = () => new Promise((resolve, reject) => {
  let x;
  try {
    x = Xray().driver(phantom({
      webSecurity: false,
    }));
  } catch (e) {
    reject(e);
    return;
  }

  try {
    x('http://www.probuilds.net/champions', '.champion-results', ['li@data-id'])((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      const stringIds = result.map(c => c.split('|')[0]);
      resolve(stringIds);
    });
  } catch (e) {
    reject(e);
  }
});
const getChampionBuildOrder = champStringID => new Promise((resolve, reject) => {
  if (!PROD) {
    outputLog(`[ProBuilds] Getting ${champStringID} ...`);
  }

  let x;
  try {
    x = Xray().driver(phantom({
      webSecurity: false,
    }));
  } catch (e) {
    reject(e);
    return;
  }

  try {
    x(`http://www.probuilds.net/champions/details/${champStringID}`, '.build-list', ['div img@data-id'])((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      const ids = result.map(i => i || 0);
      if (!PROD) {
        outputLog(`[ProBuilds] Getting ${champStringID} : done !`);
      }
      resolve(ids);
    });
  } catch (e) {
    reject(e);
  }
});

const getDatas = () => new Promise(async (resolve, reject) => {
  outputLog('[ProBuilds] Retrieving the champions list ...');
  let champs;
  try {
    champs = await getChampions();
  } catch (e) {
    reject(e);
    return;
  }
  outputLog('[ProBuilds] Retrieving the champions list : done !');

  if (config.env === 'test') {
    champs = [champs[0]];
  }

  outputLog('[ProBuilds] Retrieving the champions datas ...');
  const builds = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const champ of champs) {
    let build;
    try {
      // eslint-disable-next-line no-await-in-loop
      build = await getChampionBuildOrder(champ);
    } catch (e) {
      reject(e);
      return;
    }
    builds[champ] = { build };
  }
  outputLog('[ProBuilds] Retrieving the champions datas : done !');

  const datas = {
    builds,
  };

  resolve(datas);
});

export default getDatas;
