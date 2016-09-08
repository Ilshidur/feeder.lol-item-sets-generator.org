import path from 'path';

export default {
  env: process.env.NODE_ENV,

  port: process.env.PORT || 3000,

  rootPath: path.join(__dirname, '../'),

  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/lol-item-sets-generator-org',
    options: {
      db: {
        safe: true
      }
    }
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
      // output/sprites/sprite.png :
      spritesheetName: 'sprite.png',
      // output/sprites/sprite.css :
      stylesheetName: 'sprite.css'
    }
  },

  key: {
    riot: process.env.KEY_RIOT,
    championgg: process.env.KEY_CHAMPIONGG,
  }
};
