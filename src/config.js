import path from 'path';
import url from 'url';

const LOCALHOST = 'localhost' + (process.env.PORT ? ':' + process.env.PORT : '');
const HOST = process.env.HOST || LOCALHOST;

export default {
  env: process.env.NODE_ENV,

  port: process.env.PORT || 3000,

  rootPath: path.join(__dirname, '../'),
  host: HOST,

  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/lol-item-sets-generator-org',
    options: {
      db: {
        safe: true
      }
    }
  },

  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost'
  },

  cron: process.env.CRON_GENERATOR || false,

  path: {
    sets: {
      outputFolder: 'output',

      // output/generator_sets :
      saveFolderTmp: 'generator_sets',

      // output/generator_sets/ItemSets :
      saveFolder: 'ItemSets',

      // output/ItemSets.zip :
      zipFileName: 'ItemSets.zip'
    },
    sprites: {
      outputFolder: 'output',

      // output/sprites_download :
      downloadFolder: 'sprites_download',

      // output/sprites_uncompressed :
      spritesheetFolderTmp: 'sprites_uncompressed',

      spritesheetFolder: 'sprites',

      // output/sprites/champions.png :
      spritesheetName: {
        champions: 'champions.png',
        items: 'items.png'
      },
      // output/sprites/champions.css :
      stylesheetName: {
        champions: 'champions.css',
        items: 'items.css'
      },

      spritesheetLink: {
        champions: url.resolve(HOST, 'sprites/champions.png'),
        items: url.resolve(HOST, 'sprites/items.png'),
      }
    }
  },

  key: {
    riot: process.env.KEY_RIOT,
    championgg: process.env.KEY_CHAMPIONGG,
  }
};
